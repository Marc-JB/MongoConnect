import { DocumentModel, MutableDocumentModel } from "./DocumentModel"
import { Repository, MutableRepository, WithId } from "./Repository"

export class NullableDocumentModel<T extends Object> implements Repository<T, null> {
    public constructor(protected readonly model: DocumentModel<T>) {}

    public async getById(id: string): Promise<WithId<T> | null> {
        try {
            return await this.model.getById(id)
        } catch (error) {
            return null
        }
    }

    public async getAll(): Promise<WithId<T>[] | null> {
        try {
            return await this.model.getAll()
        } catch (error) {
            return null
        }
    }
}

export class MutableNullableDocumentModel<T extends Object> extends NullableDocumentModel<T> implements MutableRepository<T, null> {
    public constructor(protected readonly model: MutableDocumentModel<T>) {
        super(model)
    }

    public async add(object: T): Promise<WithId<T> | null> {
        try {
            return await this.model.add(object)
        } catch (error) {
            return null
        }
    }

    public async insert(object: T): Promise<WithId<T> | null> {
        return this.add(object)
    }

    public async addObjectWithId(object: WithId<T>): Promise<WithId<T> | null> {
        try {
            return await this.model.addObjectWithId(object)
        } catch (error) {
            return null
        }
    }

    public async addWithId(id: string, object: T): Promise<WithId<T> | null> {
        try {
            return await this.model.addWithId(id, object)
        } catch (error) {
            return null
        }
    }

    public async update(id: string, object: T): Promise<WithId<T> | null> {
        try {
            return await this.model.update(id, object)
        } catch (error) {
            return null
        }
    }

    public async patch(id: string, object: Partial<T>): Promise<WithId<T> | null> {
        try {
            return await this.model.patch(id, object)
        } catch (error) {
            return null
        }
    }

    public async delete(id: string): Promise<WithId<T> | null> {
        try {
            return await this.model.delete(id)
        } catch (error) {
            return null
        }
    }

    public async remove(id: string): Promise<WithId<T> | null> {
        return this.delete(id)
    }

    public get readonly(): Repository<T, null> {
        return this
    }
}
