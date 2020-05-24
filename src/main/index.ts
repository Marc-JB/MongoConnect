import mongoose from "mongoose"
import { Model } from "./Model"
import { tryFunction } from "./asyncUtils"

export type SchemaDefinition = mongoose.SchemaDefinition

export type SchemaType =
    typeof mongoose.Schema.Types.ObjectId |
    typeof mongoose.Schema.Types.DocumentArray |
    typeof mongoose.Schema.Types.Mixed |
    typeof mongoose.Schema.Types.Embedded |
    typeof mongoose.Schema.Types.Decimal128 |
    typeof String |
    typeof Number |
    typeof Date |
    typeof Array |
    typeof Buffer |
    typeof Boolean |
    typeof Map

export function required(type: SchemaType): { type: SchemaType; required: true } {
    return {
        type,
        required: true
    }
}

export function optional(type: SchemaType): { type: SchemaType; required: false } {
    return {
        type,
        required: false
    }
}

export const Types = {
    ID: mongoose.SchemaTypes.ObjectId as SchemaType,
    DocumentArray: mongoose.SchemaTypes.DocumentArray as SchemaType,
    Mixed: mongoose.SchemaTypes.Mixed as SchemaType,
    Embedded: mongoose.SchemaTypes.Embedded as SchemaType,
    Decimal128: mongoose.SchemaTypes.Decimal128 as SchemaType,
    String: String as SchemaType,
    Number: Number as SchemaType,
    Date: Date as SchemaType,
    Array: Array as SchemaType,
    Buffer: Buffer as SchemaType,
    Boolean: Boolean as SchemaType,
    Map: Map as SchemaType
}

export class MongoDB {
    private constructor(private readonly connection = mongoose) {}

    public getModel<T extends Object>(name: string, schema: SchemaDefinition): Model<T> {
        const mongoModel = this.connection.model<mongoose.Document & T>(name, new mongoose.Schema(schema))

        return new Model<T>(mongoModel)
    }

    public static async connectOnce(url: string, useNewUrlParser = true, useUnifiedTopology = true): Promise<MongoDB> {
        const connection = await mongoose.connect(url, { useNewUrlParser, useUnifiedTopology })
        return new MongoDB(connection)
    }

    public static async connect(url: string, maxNumOfTries = 10): Promise<MongoDB> {
        return tryFunction(async () => this.connectOnce(url), maxNumOfTries)
    }
}
