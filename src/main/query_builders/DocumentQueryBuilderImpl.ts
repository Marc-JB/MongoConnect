import { Document, DocumentQuery } from "mongoose"
import { DocumentQueryBuilder, KeyWithStringArrayValue, KeyWithStringValue, ReplaceValueOfSingleKey, ReplaceValueOfSingleNestedArrayKey, ReplaceValueOfSingleNestedKey } from "./QueryBuilderTypes"
import { convert } from "../convert"
import { WithId } from "../repositories/Repository"

export class DocumentQueryBuilderImpl<T> implements DocumentQueryBuilder<T> {
    public constructor(
        protected readonly query: DocumentQuery<(Document & T) | null, Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    public inlineReferencedObject<R extends Object>(key: KeyWithStringValue<T>): DocumentQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R> | null>>
    public inlineReferencedObject<R extends Object>(key: KeyWithStringArrayValue<T>): DocumentQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>[]>>
    public inlineReferencedObject(key: any): any {
        return new DocumentQueryBuilderImpl(
            this.query.populate(key),
            this.errorHandler
        )
    }

    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R> | null>>
    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R> | null>>
    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>[]>>
    public inlineReferencedSubObject<R extends Object>(key: KeyWithStringArrayValue<T>, subKey: KeyWithStringArrayValue<T[typeof key]>): DocumentQueryBuilder<ReplaceValueOfSingleNestedArrayKey<T, typeof key, typeof subKey, WithId<R>[]>>
    public inlineReferencedSubObject(key: any, subKey: any): any {
        return new DocumentQueryBuilderImpl(
            this.query.populate({
                path: key,
                populate: {
                    path: subKey
                }
            }),
            this.errorHandler
        )
    }

    public async getResult(): Promise<WithId<T> | null> {
        try {
            const model = await this.query
            return model === null ? null : convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }
}
