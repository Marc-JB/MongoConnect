import mongoose from "mongoose"

/** @type {ReadonlyMap<new(...args) => any, typeof mongoose.SchemaType>} */
const schemaMap = (() => {
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
    /** @type {new(...args) => any} type */
    #type

    /**
     * @param {new(...args) => any} type
     */
    constructor(type) {
        this.#type = type
    }

    get type() {
        return this.#type
    }
}

export function getType(type) {
    for(const [constructor, mongooseSchemaType] of schemaMap) {
        if(type === constructor) {
            return mongooseSchemaType
        }
    }

    if(type instanceof Required) {
        return {
            type: getType(type.type),
            required: true
        }
    }

    return null
}

export function convertSchemaToSchemaDefinition(schema) {
    /** @type {mongoose.SchemaDefinition} */
    const mongoSchema = {}

    for (const prop of Object.keys(schema)) {
        const foundType = getType(schema[prop])

        if(foundType != null) {
            mongoSchema[prop] = foundType
        } else {
            if(schema[prop] instanceof Array) {
                mongoSchema[prop] = schema[prop].map(it => convertSchemaToSchemaDefinition(it))
            } else if(schema[prop] instanceof Object) {
                mongoSchema[prop] = convertSchemaToSchemaDefinition(schema[prop])
            }
        }
    }

    return mongoSchema
}
