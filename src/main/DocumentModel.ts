import mongoose from "mongoose"

export type WithId<T> = T & { id: string }

export type MongoObject<T> = T & { _id: string; __v?: any }

export class DocumentModel<T extends Object> {
    public constructor(private readonly model: mongoose.Model<mongoose.Document & T, {}>) {}

    private static convert<T>(object: MongoObject<T>): WithId<T> {
        const { _id, __v, ...t } = object
        return { id: _id, ...(t as unknown as T) }
    }

    public async getById(id: string): Promise<WithId<T> | null> {
        const model = await this.model.findById(id)
        return model === null ? null : DocumentModel.convert<T>(model.toObject())
    }

    public async getAll(): Promise<WithId<T>[]> {
        const models = await this.model.find()
        return models.map(it => DocumentModel.convert<T>(it.toObject()))
    }

    public async add(object: T): Promise<WithId<T>> {
        const model = await new this.model(object).save()
        return DocumentModel.convert<T>(model.toObject())
    }

    public async insert(object: T): Promise<WithId<T>> {
        return this.add(object)
    }

    public async addObjectWithId(object: WithId<T>): Promise<WithId<T>> {
        const { id, ...rest } = object
        return this.addWithId(id, rest as unknown as T)
    }

    public async addWithId(id: string, object: T): Promise<WithId<T>> {
        const model = await new this.model({ _id: id, ...object }).save()
        return DocumentModel.convert<T>(model.toObject())
    }

    public async update(id: string, object: T): Promise<WithId<T> | null> {
        const model = await this.model.findByIdAndUpdate(id, object as unknown as any)
        return model === null ? null : DocumentModel.convert<T>(model.toObject())
    }

    public async patch(id: string, object: Partial<T>): Promise<WithId<T> | null> {
        const dbObject = await this.getById(id)
        if (dbObject === null)
            return null

        for (const key in dbObject) {
            if (!(key in object)) {
                // @ts-ignore
                object[key] = dbObject[key]
            }
        }

        const model = await this.model.findByIdAndUpdate(id, object as unknown as any)
        return model === null ? null : DocumentModel.convert<T>(model.toObject())
    }

    public async delete(id: string): Promise<WithId<T> | null> {
        const model = await this.model.findByIdAndDelete(id)
        return model === null ? null : DocumentModel.convert<T>(model.toObject())
    }

    public async remove(id: string): Promise<WithId<T> | null> {
        return this.delete(id)
    }
}
