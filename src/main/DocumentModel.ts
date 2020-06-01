import { Model, Document } from "mongoose"
import { Repository, MutableRepository, MongoObject, WithId } from "./Repository"

export class DocumentModel<T extends Object> implements Repository<T> {
    public constructor(protected readonly model: Model<Document & T, {}>) {}

    protected static convert<T>(object: MongoObject<T>): WithId<T> {
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
}

export class MutableDocumentModel<T extends Object> extends DocumentModel<T> implements MutableRepository<T> {
    public constructor(model: Model<Document & T, {}>) {
        super(model)
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

        return this.update(id, object as unknown as T)
    }

    public async delete(id: string): Promise<WithId<T> | null> {
        const model = await this.model.findByIdAndDelete(id)
        return model === null ? null : DocumentModel.convert<T>(model.toObject())
    }

    public async remove(id: string): Promise<WithId<T> | null> {
        return this.delete(id)
    }

    public get readonly(): Repository<T> {
        return this
    }
}
