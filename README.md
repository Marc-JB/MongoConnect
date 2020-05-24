# Mongo Connect [![Node.js CI](https://github.com/Marc-JB/MongoConnect/workflows/Node.js%20CI/badge.svg)](https://github.com/Marc-JB/MongoConnect/actions?query=workflow%3A%22Node.js+CI%22) [![license](https://badgen.net/github/license/Marc-JB/MongoConnect?color=cyan)](https://github.com/Marc-JB/MongoConnect/blob/master/LICENSE)
Very simple and minimal mongoose wrapper.

## Notes
* All objects internally have an `_id` field for the ID. Don't specify the primary ID in the Schema.
* When passing or retreiving an object, the `_id` field will be renamed to `id`

## Demo
```TypeScript
// @peregrine/mongo-connect for npm, @marc-jb/mongo-connect for GitHub Packages
import { MongoDB, Model, required } from "mongo-connect"

type Nullable<T> = T | null

interface Pet {
    name: string
    kind: string
    dateOfBirth?: Date
}

interface PetWithId extends Pet {
    id: string
}

const db = await MongoDB.connect(process.env.MONGO_URL)
const pets: Model<Pet> = db.getModel<Pet>("pets", {
    name: required(String),
    kind: required(String),
    dateOfBirth: Date
})

const maya: Pet = {
    name: "Maya",
    kind: "Parrot"
}

const databaseMaya: PetWithId = await pets.add(maya)

const updatedMaya: Nullable<PetWithId> = await pets.update(maya.id, {
    name: maya.name,
    kind: "Macaw"
})
// OR
const patchedMaya: Nullable<PetWithId> = await pets.patch(maya.id, { kind: "Macaw" })
```
