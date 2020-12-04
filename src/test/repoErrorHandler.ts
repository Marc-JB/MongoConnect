import { suite, test, expect } from "@peregrine/test-with-decorators"
import { Model, Document } from "mongoose"
import { DocumentModel } from "../main/repositories/DocumentModel"

@suite
export class RepoErrorHandlerTests {
    @test
    public async testErrorHandlerWhenNotInvoked(): Promise<void> {
        // Arrange
        interface TestModel {}

        let handlerInvoked = 0
        const handler = (): boolean => {
            handlerInvoked++
            return true
        }

        const expectedResult = 5

        const model = {
            estimatedDocumentCount: async (): Promise<number> => Promise.resolve(expectedResult)
        } as unknown as Model<Document & TestModel, {}>

        const repo = new DocumentModel<TestModel>(model, handler)

        // Act
        const actualResult = await repo.getEstimatedSize()

        // Assert
        expect(actualResult).to.equal(expectedResult)
        expect(handlerInvoked).to.equal(0)
    }

    @test
    public async testErrorHandlerWithNoErrorThrowing(): Promise<void> {
        // Arrange
        interface TestModel {}

        let handlerInvoked = 0
        let errorFromHandler: Error | null = null
        const handler = (error: Error): boolean => {
            handlerInvoked++
            errorFromHandler = error
            return true
        }

        const error = new Error("Fake error")

        const model = {
            estimatedDocumentCount: async (): Promise<number> => Promise.reject(error)
        } as unknown as Model<Document & TestModel, {}>

        const repo = new DocumentModel<TestModel>(model, handler)

        // Act
        let actualResult: number | null = null
        let actualError: any = null
        try {
            actualResult = await repo.getEstimatedSize()
        } catch (err) {
            actualError = err
        }

        // Assert
        expect(actualResult).to.equal(0)
        expect(actualError).to.be.null
        expect(handlerInvoked).to.equal(1)
        expect(errorFromHandler).to.equal(error)
    }

    @test
    public async testErrorHandlerWithErrorThrowing(): Promise<void> {
        // Arrange
        interface TestModel {}

        let handlerInvoked = 0
        let errorFromHandler: Error | null = null
        const handler = (error: Error): boolean => {
            handlerInvoked++
            errorFromHandler = error
            return false
        }

        const error = new Error("Fake error")

        const model = {
            estimatedDocumentCount: async (): Promise<number> => Promise.reject(error)
        } as unknown as Model<Document & TestModel, {}>

        const repo = new DocumentModel<TestModel>(model, handler)

        // Act
        let actualResult: number | null = null
        let actualError: any = null
        try {
            actualResult = await repo.getEstimatedSize()
        } catch (err) {
            actualError = err
        }

        // Assert
        expect(actualResult).to.be.null
        expect(actualError).to.equal(error)
        expect(handlerInvoked).to.equal(1)
        expect(errorFromHandler).to.equal(error)
    }
}
