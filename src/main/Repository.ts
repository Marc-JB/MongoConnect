import { FilterQuery } from "mongoose"

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

export interface Repository<T extends Object, DeprecatedType = never> {
    errorHandler: (error: Error) => boolean

    getEstimatedLength(): Promise<number>
    
    getEstimatedSize(): Promise<number>

    getExactLength(): Promise<number>
    getExactLength(filter: Filter<T>): Promise<number>

    getExactSize(): Promise<number>
    getExactSize(filter: Filter<T>): Promise<number>

    getById(id: string): Promise<WithId<T> | null>

    getAll(): Promise<WithId<T>[]>

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

export interface MutableRepository<T extends Object, DeprecatedType = never> extends InsertableRepository<T>, UpdateableRepository<T>, DeleteableRepository<T> {
    readonly: Repository<T>
}
