import { Document, DocumentQuery } from "mongoose"
import { DocumentsArrayQueryBuilder, ReplaceValueOfSingleKey, ReplaceValueOfSingleNestedKey } from "./QueryBuilderTypes"
import { convert } from "../convert"
import { WithId } from "../repositories/Repository"

export class DocumentsArrayQueryBuilderImpl<T> implements DocumentsArrayQueryBuilder<T> {
    public constructor(
        protected readonly query: DocumentQuery<(Document & T)[], Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    public inlineReferencedObject<R extends Object>(key: keyof T): DocumentsArrayQueryBuilder<ReplaceValueOfSingleKey<T, typeof key, WithId<R>>> {
        type NewDoc = ReplaceValueOfSingleKey<T, typeof key, WithId<R>>
        return new DocumentsArrayQueryBuilderImpl<NewDoc>(
            this.query.populate(key) as unknown as DocumentQuery<(Document & NewDoc)[], Document & NewDoc, {}>,
            this.errorHandler
        )
    }

    public inlineReferencedSubObject<R extends Object>(key: keyof T, subKey: keyof T[typeof key]): DocumentsArrayQueryBuilder<ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>>> {
        type NewDoc = ReplaceValueOfSingleNestedKey<T, typeof key, typeof subKey, WithId<R>>
        return new DocumentsArrayQueryBuilderImpl<NewDoc>(
            this.query.populate({
                path: key,
                populate: {
                    path: subKey
                }
            }) as unknown as DocumentQuery<(Document & NewDoc)[], Document & NewDoc, {}>,
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
