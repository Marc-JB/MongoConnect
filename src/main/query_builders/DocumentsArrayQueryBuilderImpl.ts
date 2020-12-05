import { Document, DocumentQuery } from "mongoose"
import { DocumentsArrayQueryBuilder, KeyWithStringArrayValue, KeyWithStringValue, ReplaceValueOfSingleKey, ReplaceValueOfSingleNestedArrayKey, ReplaceValueOfSingleNestedKey } from "./QueryBuilderTypes"
import { convert } from "../convert"
import { WithId } from "../repositories/Repository"

export class DocumentsArrayQueryBuilderImpl<T> implements DocumentsArrayQueryBuilder<T> {
    public constructor(
        protected readonly query: DocumentQuery<(Document & T)[], Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    public inlineReferencedObject<R extends Object>(key: KeyWithStringValue<T>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R> | null>>
    public inlineReferencedObject<R extends Object>(key: KeyWithStringArrayValue<T>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>[]>>
    public inlineReferencedObject(key: any): any {
        return new DocumentsArrayQueryBuilderImpl(
            this.query.populate(key),
            this.errorHandler
        )
    }

    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R> | null>>
    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R> | null>>
    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>[]>>
    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R>[]>>
    public inlineReferencedSubObject(key: any, subKey: any): any {
        return new DocumentsArrayQueryBuilderImpl(
            this.query.populate({
                path: key,
                populate: {
                    path: subKey
                }
            }),
            this.errorHandler
        )
    }

    public async getResult(): Promise<WithId<T>[]> {
        try {
            const models = await this.query
            return models.map(it => convert<T>(it.toObject()))
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return []
        }
    }
}
