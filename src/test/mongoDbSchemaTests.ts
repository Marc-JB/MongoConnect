import mongoose from "mongoose"
import { suite, test, expect } from "./utils"
import { convertSchemaToSchemaDefinition } from "../main/Schema"

@suite
export class MongoDbSchemaTests {
    @test
    public testSimpleSchema(): void {
        // Arrange
        const schema = {
            name: String
        }

        // Act
        const resultSchema = convertSchemaToSchemaDefinition(schema)

        // Assert
        expect(Object.keys(resultSchema)).to.have.length(1)
        expect(Object.keys(resultSchema)).to.contain("name")
        expect(resultSchema["name"]).to.equal(mongoose.SchemaTypes.String)
    }

    @test
    public testComplexSchema(): void {
        // Arrange
        const schema = {
            title: String,
            author: String,
            body: String,
            comments: [{ body: String, date: Date }],
            date: Date,
            hidden: Boolean,
            meta: {
                votes: Number,
                favs: Number
            }
        }

        // Act
        const resultSchema = convertSchemaToSchemaDefinition(schema)

        // Assert
        const keys = Object.keys(resultSchema)
        expect(keys).to.have.length(7)
        expect(keys).to.contain("title")
        expect(resultSchema["title"]).to.equal(mongoose.SchemaTypes.String)
        expect(keys).to.contain("author")
        expect(resultSchema["author"]).to.equal(mongoose.SchemaTypes.String)
        expect(keys).to.contain("body")
        expect(resultSchema["body"]).to.equal(mongoose.SchemaTypes.String)
        expect(keys).to.contain("comments")
        expect(resultSchema["comments"]).to.be.an.instanceof(Array)
        expect(resultSchema["comments"]).to.have.length(1)
        // @ts-ignore
        expect(Object.keys(resultSchema["comments"][0])).to.contain("body")
        // @ts-ignore
        expect(Object.keys(resultSchema["comments"][0])).to.contain("date")
        expect(keys).to.contain("date")
        expect(resultSchema["date"]).to.equal(mongoose.SchemaTypes.Date)
        expect(keys).to.contain("hidden")
        expect(resultSchema["hidden"]).to.equal(mongoose.SchemaTypes.Boolean)
        expect(keys).to.contain("meta")
        expect(Object.keys(resultSchema["meta"])).to.contain("votes")
        expect(Object.keys(resultSchema["meta"])).to.contain("favs")
    }
}
