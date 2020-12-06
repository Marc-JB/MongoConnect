import { Document, DocumentQuery } from "mongoose"
import { DocumentQueryBuilder, ObjectWithID } from "./QueryBuilderTypes"
import { convert } from "../convert"
import { WithId } from "../repositories/Repository"
import { KeyWithSpecifiedValueType, ObjectType, ReplaceValueForKey } from "../utils/typeUtils"

export class DocumentQueryBuilderImpl<T extends ObjectType> implements DocumentQueryBuilder<T> {
    public constructor(
        protected readonly query: DocumentQuery<(Document & T) | null, Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    public inlineReferencedObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, string | ObjectWithID | null>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, WithId<R> | null>>
    
    public inlineReferencedObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, (string | ObjectWithID | null)[]>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, WithId<R>[]>>
    
    public inlineReferencedObject(key: any): any {
        return new DocumentQueryBuilderImpl(
            this.query.populate(key),
            this.errorHandler
        )
    }

    public inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key], string | ObjectWithID | null>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key], typeof subKey, WithId<R> | null>>>
    
    public inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key], (string | ObjectWithID | null)[]>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key], typeof subKey, WithId<R>[]>>>
    
    public inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType[]>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key][0], string | ObjectWithID | null>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key][0], typeof subKey, WithId<R> | null>[]>>
    
    public inlineReferencedSubObject<R extends ObjectType>(
        key: KeyWithSpecifiedValueType<T, ObjectType[]>, 
        subKey: KeyWithSpecifiedValueType<T[typeof key][0], (string | ObjectWithID | null)[]>
    ): DocumentQueryBuilder<ReplaceValueForKey<T, typeof key, ReplaceValueForKey<T[typeof key][0], typeof subKey, WithId<R>[]>[]>>
    
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
