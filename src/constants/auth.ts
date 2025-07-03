export const TOKEN_TYPES = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  ID: 'id_token',
} as const;

export const TOKEN_TYPE = 'Bearer';

export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: 15 * 60, // 15 minutes in seconds
  REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days in seconds
  SESSION: 30 * 24 * 60 * 60, // 30 days in seconds
} as const;

export type TokenType = typeof TOKEN_TYPES[keyof typeof TOKEN_TYPES]; 