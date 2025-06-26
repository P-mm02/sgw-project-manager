// Utility: Converts string[] to string, Date to string, for use in form input types
export type FormFriendly<T> = {
  [K in keyof T]: T[K] extends string[]
    ? string
    : T[K] extends Date
    ? string
    : T[K]
}
