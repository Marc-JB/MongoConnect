import { FilterQuery } from "mongoose"
import { DocumentQueryBuilder, DocumentsArrayQueryBuilder } from "../query_builders/QueryBuilderTypes"
import { ObjectType } from "../utils/typeUtils"

export type Filter<T> = FilterQuery<T>

export interface Options<T extends ObjectType> {
    limit: number
    skip: number
    sort: {
        [K in keyof T]: 1 | -1 | "asc" | "desc" | "ascending" | "descending"
    }
}

export type WithId<T extends ObjectType> = T & { id: string }

// eslint-disable-next-line @typescript-eslint/naming-convention
export type MongoObject<T extends ObjectType> = T & { _id: string; __v?: any }

export interface Repository<T extends ObjectType> {
    errorHandler: (error: Error) => boolean

    getEstimatedLength(): Promise<number>
    
    getEstimatedSize(): Promise<number>

    getExactLength(): Promise<number>
    getExactLength(filter: Filter<T>): Promise<number>

    getExactSize(): Promise<number>
    getExactSize(filter: Filter<T>): Promise<number>

    /**
     * Returns a single model from the database by its id, or null if none
     * @param id The ID of the model.
     */
    getById(id: string): Promise<WithId<T> | null>
    queryById(id: string): DocumentQueryBuilder<T>

    /**
     * Returns all models from the database, or an empty array if none
     */
    getAll(): Promise<WithId<T>[]>
    queryAll(): DocumentsArrayQueryBuilder<T>

    /**
     * Returns true if a model matching the filter exists
     * @param filter The filter
     */
    exists(filter: Filter<T>): Promise<boolean>

    /**
     * Returns the first model that matches the filter, or null if none
     * @param filter The filter
     */
    firstOrNull(filter: Filter<T>): Promise<WithId<T> | null>
    queryFirstOrNull(filter: Filter<T>): DocumentQueryBuilder<T>

    /**
     * Returns all models that match the filter, or an empty array if none
     * @param filter The filter
     */
    filter(filter: Filter<T>): Promise<WithId<T>[]>
    filterAndQuery(filter: Filter<T>): DocumentsArrayQueryBuilder<T>

    /**
     * Returns all models that match the filter, or an empty array if none
     * @param filter The filter
     * @param options Additional options
     */
    filter(filter: Filter<T>, options: Options<T>): Promise<WithId<T>[]>
    filterAndQuery(filter: Filter<T>, options: Options<T>): DocumentsArrayQueryBuilder<T>

    /**
     * Returns all models that have a different value for the specified key
     * @param key The key for the value that has to be distinct
     */
    getDistinct(key: (keyof T) & string): Promise<WithId<T>[]>
    queryDistinct(key: (keyof T) & string): DocumentsArrayQueryBuilder<T>

    /**
     * Returns all models that have a different value for the specified key
     * @param key The key for the value that has to be distinct
     * @param options Additional options
     */
    getDistinct(key: (keyof T) & string, options: Options<T>): Promise<WithId<T>[]>
    queryDistinct(key: (keyof T) & string, options: Options<T>): DocumentsArrayQueryBuilder<T>
}
