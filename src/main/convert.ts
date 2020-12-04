import { MongoObject, WithId } from "./repositories/Repository"

export function isReferencedObject(obj: any): boolean {
    return obj !== undefined && obj !== null && typeof obj === "object" && !Array.isArray(obj) 
        && "_id" in obj && ("__v" in obj || !("_bsontype" in obj))
}

export function convert<T extends Object>(object: MongoObject<T>): WithId<T> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, __v, ...t } = object
    for (const prop in t) {
        const value = (t as { [key: string]: any })[prop]
        if (value !== undefined && value !== null && typeof value === "object") {
            if (Array.isArray(value)) {
                if (value.every(it => isReferencedObject(it))) {
                    (t as { [key: string]: any })[prop] = value.map(it => convert(it))
                }
            } else if (isReferencedObject(value)) {
                (t as { [key: string]: any })[prop] = convert(value)
            }
        }
    }
    return { id: _id, ...(t as unknown as T) }
}
