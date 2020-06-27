[![Node.js linter & tests](https://github.com/Marc-JB/MongoConnect/workflows/Node.js%20linter%20&%20tests/badge.svg)](https://github.com/Marc-JB/MongoConnect/actions)
[![Node.js deployment](https://github.com/Marc-JB/MongoConnect/workflows/Node.js%20deployment/badge.svg)](https://github.com/Marc-JB/MongoConnect/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Marc-JB_MongoConnect&metric=alert_status)](https://sonarcloud.io/dashboard?id=Marc-JB_MongoConnect)
[![license](https://badgen.net/github/license/Marc-JB/MongoConnect?color=cyan)](https://github.com/Marc-JB/MongoConnect/blob/main/LICENSE)
[![npm](https://badgen.net/badge/icon/npm?icon=npm&color=cyan&label)](https://www.npmjs.com/package/@peregrine/mongo-connect)
![node version](https://badgen.net/npm/node/@peregrine/mongo-connect)
![types](https://badgen.net/npm/types/@peregrine/mongo-connect?icon=typescript)
# Mongo Connect
Very simple and minimal mongoose wrapper.

## Notes
* All objects internally have an `_id` field for the ID. Don't specify the primary ID in the Schema.
* When passing or retreiving an object, the `_id` field will be renamed to `id`

## Demo
```TypeScript
import { MongoDB, MutableRepository, required } from "@peregrine/mongo-connect"

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
const pets: MutableRepository<Pet> = db.getMutableRepository<Pet>("pets", {
    name: required(String),
    kind: required(String),
    dateOfBirth: Date
})

const maya: PetWithId = await pets.add({
    name: "Maya",
    kind: "Parrot"
})

const updatedMaya: Nullable<PetWithId> = await pets.update(maya.id, {
    name: maya.name,
    kind: "Macaw"
})
// OR
const patchedMaya: Nullable<PetWithId> = await pets.patch(maya.id, { kind: "Macaw" })
```
