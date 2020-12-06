export type ObjectType = { [key: string]: any }
export type ReplaceValueForKey<T, K extends keyof T, V> = { [P in keyof T]: P extends K ? V : T[P] }
export type KeyWithSpecifiedValueType<T extends ObjectType, V> = {[P in keyof T]: T[P] extends V ? P : never}[keyof T]