import mongoose from "mongoose"

const schemaMap = ((): ReadonlyMap<new(...args: any[]) => any, typeof mongoose.SchemaType> => {
    const tmp0 = new Map()
    tmp0.set(String, mongoose.SchemaTypes.String)
    tmp0.set(Number, mongoose.SchemaTypes.Number)
    tmp0.set(Date, mongoose.SchemaTypes.Date)
    tmp0.set(Boolean, mongoose.SchemaTypes.Boolean)
    tmp0.set(Buffer, mongoose.SchemaTypes.Buffer)
    tmp0.set(Map, mongoose.SchemaTypes.Map)
    tmp0.set(Array, mongoose.SchemaTypes.Array)
    return tmp0
})()

export class Required {
    public constructor(public readonly type: new(...args: any[]) => any) {}
}

export function getType(type: new(...args: any[]) => any): any {
    for (const [constructor, mongooseSchemaType] of schemaMap) {
        if (type === constructor) {
            return mongooseSchemaType
        }
    }

    if (type instanceof Required) {
        return {
            type: getType(type.type),
            required: true
        }
    }

    return null
}

export function convertSchemaToSchemaDefinition(schema: any): mongoose.SchemaDefinition {
    const mongoSchema: mongoose.SchemaDefinition = {}

    for (const prop of Object.keys(schema)) {
        const foundType = getType(schema[prop])

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (foundType !== null) {
            mongoSchema[prop] = foundType
        } else {
            if (schema[prop] instanceof Array) {
                mongoSchema[prop] = schema[prop].map((it: any) => convertSchemaToSchemaDefinition(it))
            } else if (schema[prop] instanceof Object) {
                mongoSchema[prop] = convertSchemaToSchemaDefinition(schema[prop])
            }
        }
    }

    return mongoSchema
}
