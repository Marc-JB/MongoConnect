import { Mongoose, Document, Schema, connect, Model, ConnectionOptions, SchemaTypeOpts, SchemaType } from "mongoose"
import { DocumentModel } from "./repositories/DocumentModel"
import { tryFunction } from "./utils/asyncUtils"
import { Repository, MutableRepository } from "./repositories/Repository"
import { MutableDocumentModel } from "./repositories/MutableDocumentModel"

export type ConnectOptions = ConnectionOptions

export type MongoSchema<T extends Object> = {
    [P in keyof T]: SchemaTypeOpts<any> | Schema | SchemaType
}

const defaultConnectOptions: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

export class MongoDB {
    private constructor(private readonly connection = new Mongoose()) {}

    private getMongoModel<T extends Object>(name: string, schema: MongoSchema<T>): Model<Document & T> {
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
        schema: MongoSchema<T>, 
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
        schema: MongoSchema<T>, 
        errorHandler: (error: Error) => boolean = (): boolean => true
    ): MutableRepository<T> {
        return new MutableDocumentModel<T>(this.getMongoModel(name, schema), errorHandler)
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
