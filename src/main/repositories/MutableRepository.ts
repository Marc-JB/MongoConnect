import { Model, Document } from "mongoose"
import { ObjectType } from "../utils/typeUtils"
import { Repository, WithId } from "./Repository"

interface InsertableRepository<T extends ObjectType> extends Repository<T> {
    add(object: T): Promise<WithId<T> | null>
    insert(object: T): Promise<WithId<T> | null>
    addObjectWithId(object: WithId<T>): Promise<WithId<T> | null>
    addWithId(id: string, object: T): Promise<WithId<T> | null>
}

interface UpdateableRepository<T extends ObjectType> extends Repository<T> {
    update(id: string, object: T): Promise<WithId<T> | null>
    patch(id: string, object: Partial<T>): Promise<WithId<T> | null>
}

interface DeleteableRepository<T extends ObjectType> extends Repository<T> {
    delete(id: string): Promise<WithId<T> | null>
    remove(id: string): Promise<WithId<T> | null>
}

export interface MutableRepository<T extends ObjectType> extends InsertableRepository<T>, UpdateableRepository<T>, DeleteableRepository<T> {
    /**
     * Exposes the Model object of mongoose.
     * @param block use the Model of mongoose. Must return a promise.
     * @param onError what to return when an error occurs which is not handled by the errorHandler.
     * @example
     * ```typescript
     * async function printAllMacaws(birds: MutableRepository<Bird>): Promise<void> {
     *     const macaws = await birds.custom(async (model) => {
     *          return await this.model.find({ kind: "macaw" }, "name")
     *     }, [])
     * 
     *     for(const macaw of macaws) {
     *          console.log(macaw.name)
     *     }
     * }
     * ```
     */
    custom<R, E>(
        block: (model: Model<Document & T, {}>) => Promise<Partial<R & Document> | Partial<R & Document>[] | null>, 
        onError: E
    ): Promise<Partial<WithId<R>> | Partial<WithId<R>>[] | E>
    
    readonly: Repository<T>
}