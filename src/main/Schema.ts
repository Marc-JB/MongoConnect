import { Schema, SchemaTypes } from "mongoose"

export type SchemaType =
    typeof Schema.Types.ObjectId |
    typeof Schema.Types.DocumentArray |
    typeof Schema.Types.Mixed |
    typeof Schema.Types.Embedded |
    typeof Schema.Types.Decimal128 |
    typeof String |
    typeof Number |
    typeof Date |
    typeof Array |
    typeof Buffer |
    typeof Boolean |
    typeof Map

export function reference<B extends boolean, S extends string>(
    tableName: S,
    isRequired: B
): { type: typeof Types.ID; ref: S; required: B } {
    return {
        type: Types.ID,
        ref: tableName,
        required: isRequired
    }
}

export function required<T extends SchemaType>(type: T): { type: T; required: true } {
    return {
        type,
        required: true
    }
}

export function optional<T extends SchemaType>(type: T): { type: T; required: false } {
    return {
        type,
        required: false
    }
}

/* eslint-disable @typescript-eslint/naming-convention */
export const Types = {
    ID: SchemaTypes.ObjectId as SchemaType,
    DocumentArray: SchemaTypes.DocumentArray as SchemaType,
    Mixed: SchemaTypes.Mixed as SchemaType,
    Embedded: SchemaTypes.Embedded as SchemaType,
    Decimal128: SchemaTypes.Decimal128 as SchemaType,
    String: String as SchemaType,
    Number: Number as SchemaType,
    Date: Date as SchemaType,
    Array: Array as SchemaType,
    Buffer: Buffer as SchemaType,
    Boolean: Boolean as SchemaType,
    Map: Map as SchemaType
}
