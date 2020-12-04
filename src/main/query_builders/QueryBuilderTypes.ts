import { WithId } from "../repositories/Repository"

export type ReplaceValueOfSingleKey<T, K extends keyof T, R> = Omit<T, K> & { [P in K]: R }
export type ReplaceValueOfSingleNestedKey<T, K extends keyof T, S extends keyof T[K], R> = ReplaceValueOfSingleKey<T, K, ReplaceValueOfSingleKey<T[K], S, R>>

export interface DocumentQueryBuilder<T extends Object> {
    inlineReferencedObject<R extends Object>(key: keyof T): DocumentQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>>>
    inlineReferencedSubObject<R extends Object>(key: keyof T, subKey: keyof T[typeof key]): DocumentQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>>>
    getResult(): Promise<WithId<T> | null>
}

export interface DocumentsArrayQueryBuilder<T extends Object> {
    inlineReferencedObject<R extends Object>(key: keyof T): DocumentsArrayQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>>>
    inlineReferencedSubObject<R extends Object>(key: keyof T, subKey: keyof T[typeof key]): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>>>
    getResult(): Promise<WithId<T>[]>
}