import mongoose from "mongoose"
import { Required, convertSchemaToSchemaDefinition } from "./Schema.js"

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
    async getModel(name, schema) {
        const mongoModel = await this.#connection.model(name, MongoDB.convertSchema(schema))

        return new Model(mongoModel)
    }
}

class Model {
    /** @type {mongoose.Model<mongoose.Document, {}>} */
    #model

    /**
     * @param {mongoose.Model<mongoose.Document, {}>} mongoModel
     */
    constructor(mongoModel) {
        this.#model = mongoModel
    }

    save(object) {
        const mongoObject = new this.#model("toJSON" in object ? object.toJSON() : object)
        return mongoObject.save()
    }

    async getById(id) {
        return await this.#model.findOne({ _id: id })
    }

    async getAll() {
        return await this.#model.find()
    }
}

export { Required }

export class MongoDB {
    static convertSchema(schema) {
        return new mongoose.Schema(convertSchemaToSchemaDefinition(schema))
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
