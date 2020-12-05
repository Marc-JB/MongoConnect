import { Document, DocumentQuery } from "mongoose"
import { DocumentQueryBuilder, ReplaceValueOfSingleKey, ReplaceValueOfSingleNestedKey } from "./QueryBuilderTypes"
import { convert } from "../convert"
import { WithId } from "../repositories/Repository"

export class DocumentQueryBuilderImpl<T> implements DocumentQueryBuilder<T> {
    public constructor(
        protected readonly query: DocumentQuery<(Document & T) | null, Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    public inlineReferencedObject<R extends Object>(key: keyof T): DocumentQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>>> {
        type NewDoc = ReplaceValueOfSingleKey<T, typeof key, WithId<R>>
        return new DocumentQueryBuilderImpl(
            this.query.populate(key) as unknown as DocumentQuery<(Document & NewDoc) | null, Document & NewDoc, {}>,
            this.errorHandler
        )
    }

    public inlineReferencedSubObject<R extends Object>(key: keyof T, subKey: keyof T[typeof key]): DocumentQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>>> {
        type NewDoc = ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>>
        return new DocumentQueryBuilderImpl(
            this.query.populate({
                path: key,
                populate: {
                    path: subKey
                }
            }) as unknown as DocumentQuery<(Document & NewDoc) | null, Document & NewDoc, {}>,
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
