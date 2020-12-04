import { FilterQuery, Model, Document } from "mongoose"
import { DocumentQueryBuilder, DocumentsArrayQueryBuilder } from "../query_builders/QueryBuilderTypes"

export type Filter<T> = FilterQuery<T>

export interface Options<Model extends Object> {
    limit: number
    skip: number
    sort: {
        [P in keyof Model]: 1 | -1 | "asc" | "desc" | "ascending" | "descending"
    }
}

export type WithId<T> = T & { id: string }

// eslint-disable-next-line @typescript-eslint/naming-convention
export type MongoObject<T> = T & { _id: string; __v?: any }

export interface Repository<T extends Object> {
    errorHandler: (error: Error) => boolean

    getEstimatedLength(): Promise<number>
    
    getEstimatedSize(): Promise<number>

    getExactLength(): Promise<number>
    getExactLength(filter: Filter<T>): Promise<number>

    getExactSize(): Promise<number>
    getExactSize(filter: Filter<T>): Promise<number>

    getById(id: string): Promise<WithId<T> | null>
    queryById(id: string): DocumentQueryBuilder<T>

    getAll(): Promise<WithId<T>[]>
    queryAll(): DocumentsArrayQueryBuilder<T>

    exists(filter: Filter<T>): Promise<boolean>

    firstOrNull(filter: Filter<T>): Promise<WithId<T> | null>

    filter(filter: Filter<T>): Promise<WithId<T>[]>
    filter(filter: Filter<T>, options: Options<T>): Promise<WithId<T>[]>

    getDistinct(key: (keyof T) & string): Promise<WithId<T>[]>
    getDistinct(key: (keyof T) & string, options: Options<T>): Promise<WithId<T>[]>
}

interface InsertableRepository<T extends Object> extends Repository<T> {
    add(object: T): Promise<WithId<T> | null>
    insert(object: T): Promise<WithId<T> | null>
    addObjectWithId(object: WithId<T>): Promise<WithId<T> | null>
    addWithId(id: string, object: T): Promise<WithId<T> | null>
}

interface UpdateableRepository<T extends Object> extends Repository<T> {
    update(id: string, object: T): Promise<WithId<T> | null>
    patch(id: string, object: Partial<T>): Promise<WithId<T> | null>
}

interface DeleteableRepository<T extends Object> extends Repository<T> {
    delete(id: string): Promise<WithId<T> | null>
    remove(id: string): Promise<WithId<T> | null>
}

export interface MutableRepository<T extends Object> extends InsertableRepository<T>, UpdateableRepository<T>, DeleteableRepository<T> {
    /**
     * Exposes the Model object of mongoose.
     * @param block use the Model of mongoose. Must return a promise.
     * @param onError what to return when an error occurs which is not handled by the errorHandler.
     * @example
     * ```typescript
     * async function printAllMacaws(birds: MutableRepository<Bird>): Promise<void> {
     *     const macaws = await birds.custom(async (model) => {
     *          return await this.model.find({ kind: "macaw" }, "name")
     *     }, [])
     * 
     *     for(const macaw of macaws) {
     *          console.log(macaw.name)
     *     }
     * }
     * ```
     */
    custom<R, E>(
        block: (model: Model<Document & T, {}>) => Promise<Partial<R & Document> | Partial<R & Document>[] | null>, 
        onError: E
    ): Promise<Partial<WithId<R>> | Partial<WithId<R>>[] | E>
    
    readonly: Repository<T>
}
