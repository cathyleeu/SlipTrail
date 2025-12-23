/**
 * snake_case → camelCase 변환 유틸리티
 * DB 스키마(snake_case)와 클라이언트(camelCase) 간 변환
 */

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${Lowercase<T>}_${CamelToSnakeCase<Uncapitalize<U>>}`
  : S

export type KeysToCamelCase<T> = {
  [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]: T[K] extends object
    ? T[K] extends Array<infer U>
      ? U extends object
        ? Array<KeysToCamelCase<U>>
        : T[K]
      : KeysToCamelCase<T[K]>
    : T[K]
}

export type KeysToSnakeCase<T> = {
  [K in keyof T as K extends string ? CamelToSnakeCase<K> : K]: T[K] extends object
    ? T[K] extends Array<infer U>
      ? U extends object
        ? Array<KeysToSnakeCase<U>>
        : T[K]
      : KeysToSnakeCase<T[K]>
    : T[K]
}

/**
 * 문자열을 snake_case → camelCase로 변환
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 문자열을 camelCase → snake_case로 변환
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * 객체의 모든 키를 snake_case → camelCase로 변환 (shallow)
 */
export function keysToCamelCase<T extends Record<string, unknown>>(obj: T): KeysToCamelCase<T> {
  const result: Record<string, unknown> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = toCamelCase(key)
      const value = obj[key]

      // 배열 처리
      if (Array.isArray(value)) {
        result[camelKey] = value.map((item) =>
          typeof item === 'object' && item !== null
            ? keysToCamelCase(item as Record<string, unknown>)
            : item
        )
      }
      // 중첩 객체 처리
      else if (value && typeof value === 'object' && !(value instanceof Date)) {
        result[camelKey] = keysToCamelCase(value as Record<string, unknown>)
      }
      // 원시값
      else {
        result[camelKey] = value
      }
    }
  }

  return result as KeysToCamelCase<T>
}

/**
 * 객체의 모든 키를 camelCase → snake_case로 변환 (shallow)
 */
export function keysToSnakeCase<T extends Record<string, unknown>>(obj: T): KeysToSnakeCase<T> {
  const result: Record<string, unknown> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = toSnakeCase(key)
      const value = obj[key]

      // 배열 처리
      if (Array.isArray(value)) {
        result[snakeKey] = value.map((item) =>
          typeof item === 'object' && item !== null
            ? keysToSnakeCase(item as Record<string, unknown>)
            : item
        )
      }
      // 중첩 객체 처리
      else if (value && typeof value === 'object' && !(value instanceof Date)) {
        result[snakeKey] = keysToSnakeCase(value as Record<string, unknown>)
      }
      // 원시값
      else {
        result[snakeKey] = value
      }
    }
  }

  return result as KeysToSnakeCase<T>
}
