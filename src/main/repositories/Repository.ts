import { FilterQuery } from "mongoose"
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
