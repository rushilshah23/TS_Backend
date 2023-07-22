import { CookieOptions } from "express"
import { env_config } from "./env.config"
import { TokenExpiration } from "@/types/Payloads.interface"

export const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env_config.environment,
    sameSite: env_config.environment ? 'strict' : 'lax',
    domain: env_config.baseDomain,
    path: '/',
    signed: true
  }

  export const refreshTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Refresh * 1000,
  }

  export const  accessTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Access * 1000,
  }
