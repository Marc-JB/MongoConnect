import { Model, Document, Query } from "mongoose"
import { convert } from "../convert"
import { DocumentQueryBuilderImpl } from "../query_builders/DocumentQueryBuilderImpl"
import { DocumentsArrayQueryBuilderImpl } from "../query_builders/DocumentsArrayQueryBuilderImpl"
import { DocumentQueryBuilder, DocumentsArrayQueryBuilder } from "../query_builders/QueryBuilderTypes"
import { ObjectType } from "../utils/typeUtils"
import { Repository, WithId, Options, Filter } from "./Repository"

type DocumentFilter<T> = Filter<T & Document>

export class DocumentModel<T extends ObjectType> implements Repository<T> {
    public constructor(
        protected readonly model: Model<Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    public async getEstimatedSize(): Promise<number> {
        try {
            return await Promise.resolve(this.model.estimatedDocumentCount())
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
            return await Promise.resolve(filter === null ? 
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
            return model === null ? null : convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public queryById(id: string): DocumentQueryBuilder<T> {
        return new DocumentQueryBuilderImpl(this.model.findById(id), this.errorHandler)
    }

    public async getAll(options: Options<T> | null = null): Promise<WithId<T>[]> {
        try {
            const models = await (options === null ? this.model.find() : this.model.find({}, undefined, options))
            return models.map(it => convert<T>(it.toObject()))
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return []
        }
    }

    public queryAll(options: Options<T> | null = null): DocumentsArrayQueryBuilder<T> {
        const find = options === null ? this.model.find() : this.model.find({}, undefined, options)
        return new DocumentsArrayQueryBuilderImpl(find, this.errorHandler)
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
            return model === null ? null : convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }
    
    public queryFirstOrNull(filter: Filter<T>): DocumentQueryBuilder<T> {
        return new DocumentQueryBuilderImpl(this.model.findOne(filter as DocumentFilter<T>), this.errorHandler)
    }

    public async filter(filter: Filter<T>, options: Options<T> | null = null): Promise<WithId<T>[]> {
        try {
            const models = await (options === null ? 
                this.model.find(filter as DocumentFilter<T>) : 
                this.model.find(filter as DocumentFilter<T>, undefined, options)
            )
            return models.map(it => convert<T>(it.toObject()))
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return []
        }
    }

    public filterAndQuery(filter: Filter<T>, options: Options<T> | null = null): DocumentsArrayQueryBuilder<T> {
        const find = options === null ? 
            this.model.find(filter as DocumentFilter<T>) : 
            this.model.find(filter as DocumentFilter<T>, undefined, options)

        return new DocumentsArrayQueryBuilderImpl(find, this.errorHandler)
    }

    public async getDistinct(key: (keyof T) & string, options: Options<T> | null = null): Promise<WithId<T>[]> {
        try {
            const models = await (options === null ? 
                this.model.distinct(key) : 
                this.model.distinct(key, options)
            )
            return models.map(it => convert<T>(it.toObject()))
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return []
        }
    }

    public queryDistinct(key: (keyof T) & string, options: Options<T> | null = null): DocumentsArrayQueryBuilder<T> {
        const distinct: Query<(Document & T)[]> = options === null ? 
            this.model.distinct(key) : 
            this.model.distinct(key, options)

        return new DocumentsArrayQueryBuilderImpl(distinct, this.errorHandler)
    }
}
