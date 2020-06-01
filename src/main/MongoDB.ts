import { Mongoose, Document, Schema, connect, SchemaDefinition, Model, ConnectionOptions } from "mongoose"
import { DocumentModel, MutableDocumentModel } from "./DocumentModel"
import { tryFunction } from "./asyncUtils"
import { Repository, MutableRepository } from "./Repository"
import { NullableDocumentModel, MutableNullableDocumentModel } from "./NullableDocumentModel"

export type ConnectOptions = ConnectionOptions

const defaultConnectOptions: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

export class MongoDB {
    private constructor(private readonly connection = new Mongoose()) {}

    private getMongoModel<T extends Object>(name: string, schema: SchemaDefinition): Model<Document & T> {
        return this.connection.model<Document & T>(name, new Schema(schema))
    }

    /** Creates a new, readonly repository. Will throw errors on failure. */
    public getRepository<T extends Object>(name: string, schema: SchemaDefinition): Repository<T> {
        return new DocumentModel<T>(this.getMongoModel(name, schema))
    }

    /** Creates a new, mutable repository. Will throw errors on failure. */
    public getMutableRepository<T extends Object>(name: string, schema: SchemaDefinition): MutableRepository<T> {
        return new MutableDocumentModel<T>(this.getMongoModel(name, schema))
    }

    /** Creates a new, readonly repository. Will return null on failure.  */
    public getNullableRepository<T extends Object>(name: string, schema: SchemaDefinition): Repository<T, null> {
        return new NullableDocumentModel<T>(new DocumentModel<T>(this.getMongoModel(name, schema)))
    }

    /** Creates a new, mutable repository. Will return null on failure. */
    public getMutableNullableRepository<T extends Object>(name: string, schema: SchemaDefinition): MutableRepository<T, null> {
        return new MutableNullableDocumentModel<T>(new MutableDocumentModel<T>(this.getMongoModel(name, schema)))
    }

    public static async connectOnce(url = "mongodb://localhost:27017", options: ConnectOptions = defaultConnectOptions): Promise<MongoDB> {
        const connection = await connect(url, options)
        return new MongoDB(connection)
    }

    public static async connect(url = "mongodb://localhost:27017", maxNumOfTries = 10, options: ConnectOptions = defaultConnectOptions): Promise<MongoDB> {
        return tryFunction(async () => this.connectOnce(url, options), maxNumOfTries)
    }
}
