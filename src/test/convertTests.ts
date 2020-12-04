import { suite, test, expect } from "@peregrine/test-with-decorators"
import mongoose from "mongoose"
import { convert } from "../main/convert"
import { MongoObject } from "../main/repositories/Repository"

@suite
export class ConvertTests {
    @test
    public testBasicObject(): void {
        // Arrange
        const id = new mongoose.Types.ObjectId()
        const mongoObject = {
            _id: id,
            someField: "someValue",
            someNumber: 1234.5678,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "__v": 0
        }
        const expectedResult = {
            id: id,
            someField: "someValue",
            someNumber: 1234.5678
        }

        // Act
        const actualResult = convert(mongoObject as unknown as MongoObject<unknown>)

        // Assert
        expect(actualResult).to.deep.equal(expectedResult)
    }
    
    @test
    public testComplexObjectWithNestedIdsInList(): void {
        // Arrange
        const id = new mongoose.Types.ObjectId()
        const idsList = [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
        ]
        const mongoObject = {
            _id: id,
            someField: "someValue",
            someNumber: 1234.5678,
            nestedIds: idsList,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "__v": 0
        }
        const expectedResult = {
            id: id,
            someField: "someValue",
            someNumber: 1234.5678,
            nestedIds: idsList
        }

        // Act
        const actualResult = convert(mongoObject as unknown as MongoObject<unknown>)

        // Assert
        expect(actualResult).to.deep.equal(expectedResult)
    }
    
    @test
    public testComplexObjectWithNestedIdsInObject(): void {
        // Arrange
        const id = new mongoose.Types.ObjectId()
        const idsList = [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
        ]
        const mongoObject = {
            _id: id,
            someField: "someValue",
            someNumber: 1234.5678,
            firstId: idsList[0],
            secondId: idsList[1],
            thirdId: idsList[2],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "__v": 0
        }
        const expectedResult = {
            id: id,
            someField: "someValue",
            someNumber: 1234.5678,
            firstId: idsList[0],
            secondId: idsList[1],
            thirdId: idsList[2]
        }

        // Act
        const actualResult = convert(mongoObject as unknown as MongoObject<unknown>)

        // Assert
        expect(actualResult).to.deep.equal(expectedResult)
    }
    
    @test
    public testComplexObjectWithNestedIdsInObjectInList(): void {
        // Arrange
        const id = new mongoose.Types.ObjectId()
        const idsList = [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
        ]
        const mongoObject = {
            _id: id,
            someField: "someValue",
            someNumber: 1234.5678,
            nestedIds: idsList.map((it, i) => ({ _id: it, index: i })),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "__v": 0
        }
        const expectedResult = {
            id: id,
            someField: "someValue",
            someNumber: 1234.5678,
            nestedIds: idsList.map((it, i) => ({ id: it, index: i }))
        }

        // Act
        const actualResult = convert(mongoObject as unknown as MongoObject<unknown>)

        // Assert
        expect(actualResult).to.deep.equal(expectedResult)
    }
}
