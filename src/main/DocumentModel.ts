import { Model, Document } from "mongoose"
import { Repository, MutableRepository, MongoObject, WithId, Options, Filter } from "./Repository"

type DocumentFilter<T> = Filter<T & Document>

export class DocumentModel<T extends Object> implements Repository<T> {
    public constructor(
        protected readonly model: Model<Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    protected static convert<T>(object: MongoObject<T>): WithId<T> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _id, __v, ...t } = object
        return { id: _id, ...(t as unknown as T) }
    }

    public async getEstimatedSize(): Promise<number> {
        try {
            return await this.model.estimatedDocumentCount()
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return 0
        }
    }

    public async getEstimatedLength(): Promise<number> {
        return this.getEstimatedSize()
    }

    public async getExactSize(filter: Filter<T> | null = null): Promise<number> {
        try {
            return await (filter === null ? 
                this.model.countDocuments() : 
                this.model.countDocuments(filter as DocumentFilter<T>)
            )
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return 0
        }
    }

    public async getExactLength(filter: Filter<T> | null = null): Promise<number> {
        return this.getExactSize(filter)
    }

    public async getById(id: string): Promise<WithId<T> | null> {
        try {
            const model = await this.model.findById(id)
            return model === null ? null : DocumentModel.convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async getAll(): Promise<WithId<T>[]> {
        try {
            const models = await this.model.find()
            return models.map(it => DocumentModel.convert<T>(it.toObject()))
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return []
        }
    }

    public async exists(filter: Filter<T>): Promise<boolean> {
        try {
            return await this.model.exists(filter as DocumentFilter<T>)
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return false
        }
    }

    public async firstOrNull(filter: Filter<T>): Promise<WithId<T> | null> {
        try {
            const model = await this.model.findOne(filter as DocumentFilter<T>)
            return model === null ? null : DocumentModel.convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async filter(filter: Filter<T>, options: Options<T> | null = null): Promise<WithId<T>[]> {
        try {
            const models = await (options === null ? 
                this.model.find(filter as DocumentFilter<T>) : 
                this.model.find(filter as DocumentFilter<T>, undefined, options)
            )
            return models.map(it => DocumentModel.convert<T>(it.toObject()))
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return []
        }
    }

    public async getDistinct(key: (keyof T) & string, options: Options<T> | null = null): Promise<WithId<T>[]> {
        try {
            const models = await (options === null ? 
                this.model.distinct(key) : 
                this.model.distinct(key, options)
            )
            return models.map(it => DocumentModel.convert<T>(it.toObject()))
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return []
        }
    }
}

export class MutableDocumentModel<T extends Object> extends DocumentModel<T> implements MutableRepository<T> {
    public constructor(
        model: Model<Document & T, {}>,
        errorHandler: (error: Error) => boolean = (): boolean => true
    ) {
        super(model, errorHandler)
    }

    public async add(object: T): Promise<WithId<T> | null> {
        try {
            const model = await new this.model(object).save()
            return DocumentModel.convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async insert(object: T): Promise<WithId<T> | null> {
        return this.add(object)
    }

    public async addObjectWithId(object: WithId<T>): Promise<WithId<T> | null> {
        try {
            const { id, ...rest } = object
            return await this.addWithId(id, rest as unknown as T)
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async addWithId(id: string, object: T): Promise<WithId<T> | null> {
        try {
            const model = await new this.model({ _id: id, ...object }).save()
            return DocumentModel.convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async update(id: string, object: T): Promise<WithId<T> | null> {
        try {
            const model = await this.model.findByIdAndUpdate(id, object as unknown as any)
            return model === null ? null : DocumentModel.convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async patch(id: string, object: Partial<T>): Promise<WithId<T> | null> {
        try {
            const dbObject = await this.getById(id)
            if (dbObject === null)
                return null

            for (const key in dbObject) {
                if (!(key in object)) {
                    // @ts-ignore
                    object[key] = dbObject[key]
                }
            }

            return await this.update(id, object as unknown as T)
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async delete(id: string): Promise<WithId<T> | null> {
        try {
            const model = await this.model.findByIdAndDelete(id)
            return model === null ? null : DocumentModel.convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async remove(id: string): Promise<WithId<T> | null> {
        return this.delete(id)
    }

    public get readonly(): Repository<T> {
        return this
    }
}
