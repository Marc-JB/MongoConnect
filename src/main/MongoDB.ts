import { Mongoose, Document, Schema, connect, SchemaDefinition, Model, ConnectionOptions } from "mongoose"
import { DocumentModel, MutableDocumentModel } from "./DocumentModel"
import { tryFunction } from "./asyncUtils"
import { Repository, MutableRepository } from "./Repository"

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

    /**
     * Creates a new readonly repository
     * @param name The name of this repository, this will also appear in your DB
     * @param schema The schema for objects in this repository, like `{ name: required(String), birthdate: optional(Date) }`
     * @param errorHandler Specify a custom error handler. Return `false` to rethrow errors, return `true` to ignore errors.
     */
    public getRepository<T extends Object>(
        name: string, 
        schema: SchemaDefinition, 
        errorHandler: (error: Error) => boolean = (): boolean => true
    ): Repository<T> {
        return new DocumentModel<T>(this.getMongoModel(name, schema), errorHandler)
    }

    /**
     * Creates a new mutable/writeable repository
     * @param name The name of this repository, this will also appear in your DB
     * @param schema The schema for objects in this repository, like `{ name: required(String), birthdate: optional(Date) }`
     * @param errorHandler Specify a custom error handler. Return `false` to rethrow errors, return `true` to ignore errors.
     */
    public getMutableRepository<T extends Object>(
        name: string, 
        schema: SchemaDefinition, 
        errorHandler: (error: Error) => boolean = (): boolean => true
    ): MutableRepository<T> {
        return new MutableDocumentModel<T>(this.getMongoModel(name, schema), errorHandler)
    }

    /** 
     * @deprecated switch to getRepository
     */
    public getNullableRepository<T extends Object>(name: string, schema: SchemaDefinition): Repository<T> {
        return this.getRepository(name, schema)
    }

    /** 
     * @deprecated switch to getMutableRepository
     */
    public getMutableNullableRepository<T extends Object>(name: string, schema: SchemaDefinition): MutableRepository<T> {
        return this.getMutableRepository(name, schema)
    }

    /**
     * Connects to the database at the specified URL. Will try to connect once, even when the connection attempt was unsuccessful.
     * @param url The URL of the database. Defaults to `mongodb://localhost:27017`
     * @param options Connection options, defaults to `{ useNewUrlParser: true, useUnifiedTopology: true }`
     */
    public static async connectOnce(url = "mongodb://localhost:27017", options: ConnectOptions = defaultConnectOptions): Promise<MongoDB> {
        const connection = await connect(url, options)
        return new MongoDB(connection)
    }

    /**
     * Connects to the database at the specified URL
     * @param url The URL of the database. Defaults to `mongodb://localhost:27017`
     * @param maxNumOfTries After how much unsuccessful connection attempts should we stop? Defaults to `10` (attempts). 
     * @param options Connection options, defaults to `{ useNewUrlParser: true, useUnifiedTopology: true }`
     */
    public static async connect(url = "mongodb://localhost:27017", maxNumOfTries = 10, options: ConnectOptions = defaultConnectOptions): Promise<MongoDB> {
        return tryFunction(async () => this.connectOnce(url, options), maxNumOfTries)
    }
}
