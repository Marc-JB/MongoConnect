import { WithId } from "../repositories/Repository"
import { KeyWithSpecifiedValueType, ObjectType, ReplaceValueForKey } from "../utils/typeUtils"

export type ObjectWithID = { id: string }

export interface DocumentQueryBuilder<T extends ObjectType> {
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, string | ObjectWithID | null>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, (string | ObjectWithID | null)[]>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, WithId<R>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key], string | ObjectWithID | null>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key], typeof subKey, WithId<R> | null>>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key], (string | ObjectWithID | null)[]>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key], typeof subKey, WithId<R>[]>>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType[]>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key][0], string | ObjectWithID | null>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key][0], typeof subKey, WithId<R> | null>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType[]>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key][0], (string | ObjectWithID | null)[]>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key][0], typeof subKey, WithId<R>[]>[]>>
    
    getResult(): Promise<WithId<T> | null>
}

export interface DocumentsArrayQueryBuilder<T extends ObjectType> {
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, string | ObjectWithID | null>
    ): DocumentsArrayQueryBuilder<ReplaceValueForKey<T, typeof key, WithId<R> | null>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself
     * @param key The key for the value with the ID reference
     */
    inlineReferencedObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, (string | ObjectWithID | null)[]>
    ): DocumentsArrayQueryBuilder<ReplaceValueForKey<T, typeof key, WithId<R>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key], string | ObjectWithID | null>
    ): DocumentsArrayQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key], typeof subKey, WithId<R> | null>>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key], (string | ObjectWithID | null)[]>
    ): DocumentsArrayQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key], typeof subKey, WithId<R>[]>>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType[]>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key][0], string | ObjectWithID | null>
    ): DocumentsArrayQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key][0], typeof subKey, WithId<R> | null>[]>>
    
    /**
     * Replaces the ID of a referenced object/model with the model itself. Use this if your reference is within a nested object
     * @param key The key for the nested object/model
     * @param subKey The key for the value with the ID reference within the nested object/model
     */
    inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType[]>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key][0], (string | ObjectWithID | null)[]>
    ): DocumentsArrayQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key][0], typeof subKey, WithId<R>[]>[]>>
    
    getResult(): Promise<WithId<T>[]>
}