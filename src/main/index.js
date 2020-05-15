import mongoose from "mongoose"

class MongoInstance {
    /** @type {typeof mongoose} */
    #connection

    /**
     * @param {typeof mongoose} connection
     */
    constructor(connection) {
        this.#connection = connection
    }

    /**
     * @param {string} name
     * @param {*} schema
     */
    getModel(name, schema) {
        const mongoModel = this.#connection.model(name, MongoDB.convertSchema(schema))

        return class {
            #model = mongoModel

            save(object) {
                const mongoObject = new this.#model("toJSON" in object ? object.toJSON() : object)
                return mongoObject.save()
            }

            async getAll() {
                const allObjects = await this.#model.find()
                return allObjects
            }
        }
    }
}

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

export class MongoDB {
    static convertSchemaToSchemaDefinition(schema) {
        /** @type {mongoose.SchemaDefinition} */
        const mongoSchema = {}

        for (const prop of Object.keys(schema)) {
            let typeFound = false

            for(const [constructor, mongooseSchemaType] of schemaMap) {
                if(schema[prop] === constructor) {
                    mongoSchema[prop] = mongooseSchemaType
                    typeFound = true
                }
            }

            if(!typeFound) {
                if(schema[prop] instanceof Array) {
                    mongoSchema[prop] = schema[prop].map(it => this.convertSchemaToSchemaDefinition(it))
                } else if(schema[prop] instanceof Object) {
                    mongoSchema[prop] = this.convertSchemaToSchemaDefinition(schema[prop])
                }
            }
        }

        return mongoSchema
    }

    static convertSchema(schema) {
        return new mongoose.Schema(MongoDB.convertSchemaToSchemaDefinition(schema))
    }

    /**
     * Creates a MongoDB connection
     * @param {string} url
     * @param {boolean} useNewUrlParser
     * @param {boolean} useUnifiedTopology
     */
    static async connect(url, useNewUrlParser = true, useUnifiedTopology = true) {
        const connection = await mongoose.connect(url, { useNewUrlParser, useUnifiedTopology })
        return new MongoInstance(connection)
    }
}
