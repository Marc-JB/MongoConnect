import mongoose from "mongoose"
import { Required as RequiredConstructor, convertSchemaToSchemaDefinition } from "./Schema"

class MongoInstance {
    public constructor(private readonly connection = mongoose) {}

    public getModel(name: string, schema: any): Model {
        const mongoModel = this.connection.model(name, MongoDB.convertSchema(schema))

        return new Model(mongoModel)
    }
}

class Model {
    public constructor(private readonly model: mongoose.Model<mongoose.Document, {}>) {}

    public async save(object: any): Promise<mongoose.Document> {
        const mongoObject = new this.model("toJSON" in object ? object.toJSON() : object)
        return mongoObject.save()
    }

    public async update(id: string, object: any): Promise<mongoose.Document | null> {
        return this.model.findOneAndUpdate({ _id: id }, object)
    }

    public async getById(id: string): Promise<mongoose.Document | null> {
        return this.model.findOne({ _id: id })
    }

    public async getAll(): Promise<mongoose.Document[]> {
        return this.model.find()
    }
}

export function Required(type: new (...args: any[]) => any): RequiredConstructor {
    return new RequiredConstructor(type)
}

export const MongoDB = {
    convertSchema: (schema: any): mongoose.Schema =>
        new mongoose.Schema(convertSchemaToSchemaDefinition(schema)),

    connect: async (url: string, useNewUrlParser = true, useUnifiedTopology = true): Promise<MongoInstance> => {
        const connection = await mongoose.connect(url, { useNewUrlParser, useUnifiedTopology })
        return new MongoInstance(connection)
    }
}
