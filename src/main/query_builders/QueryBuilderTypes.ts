import { WithId } from "../repositories/Repository"

export type ReplaceValueOfSingleKey<T, K extends keyof T, R> = Omit<T, K> & { [P in K]: R }
export type ReplaceValueOfSingleNestedKey<T, K extends keyof T, S extends keyof T[K], R> = ReplaceValueOfSingleKey<T, K, ReplaceValueOfSingleKey<T[K], S, R>>
export type ReplaceValueOfSingleNestedArrayKey<T, K extends keyof T, S extends keyof T[K], R> = ReplaceValueOfSingleKey<T, K, ReplaceValueOfSingleKey<T[K], S, R>[]>
export type KeyWithStringValue<T extends Object> = {[P in keyof T]: T[P] extends string ? P : never}[keyof T]
export type KeyWithStringArrayValue<T extends Object> = {[P in keyof T]: T[P] extends string[] ? P : never}[keyof T]

export interface DocumentQueryBuilder<T extends Object> {
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends Object>(key: KeyWithStringValue<T>): DocumentQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends Object>(key: KeyWithStringArrayValue<T>): DocumentQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R>[]>>
    
    getResult(): Promise<WithId<T> | null>
}

export interface DocumentsArrayQueryBuilder<T extends Object> {
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends Object>(key: KeyWithStringValue<T>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends Object>(key: KeyWithStringArrayValue<T>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R>[]>>
    
    getResult(): Promise<WithId<T>[]>
}