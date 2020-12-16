import { Document, DocumentQuery } from "mongoose"
import { DocumentsArrayQueryBuilder } from "./QueryBuilderTypes"
import { convert } from "../convert"
import { WithId } from "../repositories/Repository"
import { ObjectType } from "../utils/typeUtils"

export class DocumentsArrayQueryBuilderImpl<T extends ObjectType> implements DocumentsArrayQueryBuilder<T> {
    public constructor(
        protected readonly query: DocumentQuery<(Document & T)[], Document & T, {}>,
        public errorHandler: (error: Error) => boolean = (): boolean => true
    ) {}

    public inlineReferencedObject(key: any): any {
        return new DocumentsArrayQueryBuilderImpl(
            this.query.populate(key),
            this.errorHandler
        )
    }

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
