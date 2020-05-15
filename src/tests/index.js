import { convertSchemaToSchemaDefinition } from "../main/Schema.js"
import mocha from "mocha"
import chai from "chai"
import mongoose from "mongoose"

chai.should()

mocha.describe("MongoDB schema tests", () => {
    it("Test simple schema", () => {
        // Arrange
        const schema = {
            name: String
        }

        // Act
        const resultSchema = convertSchemaToSchemaDefinition(schema)

        // Assert
        Object.keys(resultSchema).should.have.length(1)
        Object.keys(resultSchema).should.contain("name")
        resultSchema["name"].should.equal(mongoose.SchemaTypes.String)
    })

    it("Test complex schema", () => {
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
        keys.should.have.length(7)
        keys.should.contain("title")
        resultSchema["title"].should.equal(mongoose.SchemaTypes.String)
        keys.should.contain("author")
        resultSchema["author"].should.equal(mongoose.SchemaTypes.String)
        keys.should.contain("body")
        resultSchema["body"].should.equal(mongoose.SchemaTypes.String)
        keys.should.contain("comments")
        resultSchema["comments"].should.be.an.instanceof(Array)
        resultSchema["comments"].should.have.length(1)
        Object.keys(resultSchema["comments"][0]).should.contain("body")
        Object.keys(resultSchema["comments"][0]).should.contain("date")
        keys.should.contain("date")
        resultSchema["date"].should.equal(mongoose.SchemaTypes.Date)
        keys.should.contain("hidden")
        resultSchema["hidden"].should.equal(mongoose.SchemaTypes.Boolean)
        keys.should.contain("meta")
        Object.keys(resultSchema["meta"]).should.contain("votes")
        Object.keys(resultSchema["meta"]).should.contain("favs")
    })
})
