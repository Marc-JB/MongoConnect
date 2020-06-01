export type WithId<T> = T & { id: string }

export type MongoObject<T> = T & { _id: string; __v?: any }

export interface Repository<T extends Object, E = never> {
    getById(id: string): Promise<WithId<T> | null | E>
    getAll(): Promise<WithId<T>[] | E>
}

interface InsertableRepository<T extends Object, E = never> extends Repository<T, E> {
    add(object: T): Promise<WithId<T> | E>
    insert(object: T): Promise<WithId<T> | E>
    addObjectWithId(object: WithId<T>): Promise<WithId<T> | E>
    addWithId(id: string, object: T): Promise<WithId<T> | E>
}

interface UpdateableRepository<T extends Object, E = never> extends Repository<T, E> {
    update(id: string, object: T): Promise<WithId<T> | null | E>
    patch(id: string, object: Partial<T>): Promise<WithId<T> | null | E>
}

interface DeleteableRepository<T extends Object, E = never> extends Repository<T, E> {
    delete(id: string): Promise<WithId<T> | null | E>
    remove(id: string): Promise<WithId<T> | null | E>
}

export interface MutableRepository<T extends Object, E = never> extends InsertableRepository<T, E>, UpdateableRepository<T, E>, DeleteableRepository<T, E> {
    readonly: Repository<T, E>
}
