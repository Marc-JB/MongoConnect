import { Model, Document } from "mongoose"
import { convert } from "../convert"
import { DocumentModel } from "./DocumentModel"
import { Repository, WithId } from "./Repository"
import { MutableRepository } from "./MutableRepository"

export class MutableDocumentModel<T extends Object> extends DocumentModel<T> implements MutableRepository<T> {
    public constructor(
        model: Model<Document & T, {}>,
        errorHandler: (error: Error) => boolean = (): boolean => true
    ) {
        super(model, errorHandler)
    }

    public async add(object: T): Promise<WithId<T> | null> {
        try {
            const model = await new this.model(object).save()
            return convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async insert(object: T): Promise<WithId<T> | null> {
        return this.add(object)
    }

    public async addObjectWithId(object: WithId<T>): Promise<WithId<T> | null> {
        try {
            const { id, ...rest } = object
            return await this.addWithId(id, rest as unknown as T)
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async addWithId(id: string, object: T): Promise<WithId<T> | null> {
        try {
            const model = await new this.model({ _id: id, ...object }).save()
            return convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async update(id: string, object: T): Promise<WithId<T> | null> {
        try {
            const model = await this.model.findByIdAndUpdate(id, object as unknown as any)
            return model === null ? null : convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async patch(id: string, object: Partial<T>): Promise<WithId<T> | null> {
        try {
            const dbObject = await this.getById(id)
            if (dbObject === null)
                return null

            for (const key in dbObject) {
                if (!(key in object)) {
                    // @ts-ignore
                    object[key] = dbObject[key]
                }
            }

            return await this.update(id, object as unknown as T)
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async delete(id: string): Promise<WithId<T> | null> {
        try {
            const model = await this.model.findByIdAndDelete(id)
            return model === null ? null : convert<T>(model.toObject())
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return null
        }
    }

    public async remove(id: string): Promise<WithId<T> | null> {
        return this.delete(id)
    }

    public async custom<R, E>(
        block: (model: Model<Document & T, {}>) => Promise<Partial<R & Document> | Partial<R & Document>[] | null>, 
        onError: E
    ): Promise<Partial<WithId<R>> | Partial<WithId<R>>[] | E> {
        try {
            const returned = await block(this.model)
            if (returned !== null && typeof returned === "object") {
                if (Array.isArray(returned)) {
                    if (returned.every(it => {
                        return typeof it === "object" && !Array.isArray(it) && "_id" in it && ("__v" in it || !("_bsontype" in it))
                    })) {
                        return returned.map(it => convert<R>(it.toObject?.()))
                    } else {
                        return returned
                    }
                } else {
                    const obj = returned.toObject?.()
                    return "_id" in obj && ("__v" in obj || !("_bsontype" in obj)) ? convert<R>(obj) : returned
                }
            }
            return onError
        } catch (error) {
            if (error instanceof Error && !this.errorHandler(error))
                throw error

            return onError
        }
    }

    public get readonly(): Repository<T> {
        return this
    }
}
