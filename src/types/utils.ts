// Converts string[] → string, Date → string, and recurses into nested objects
export type FormFriendly<T> = {
  [K in keyof T]: T[K] extends string[]
    ? string
    : T[K] extends Date
    ? string
    : T[K] extends object
    ? FormFriendly<T[K]> // recursive for nested objects
    : T[K]
}
