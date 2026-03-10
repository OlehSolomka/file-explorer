export type AutocompleteString = string & {};

export type ObjectValues<T extends Record<string, unknown>> = T[keyof T];
export type ObjectKeys<T extends Record<string, unknown>> = keyof T;
