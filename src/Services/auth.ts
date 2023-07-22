import { AccessToken, AccessTokenPayload, RefreshToken, RefreshTokenPayload, TokenExpiration } from "@/types/Payloads.interface";
import UserInterface from "@/types/User.interface";
import jwt from "jsonwebtoken";
import { env_config } from "@/config/env.config";
import { Response } from "express";
import { Cookies } from "@/types/Cookies.enum";
import { accessTokenCookieOptions, defaultCookieOptions, refreshTokenCookieOptions } from "@/config/cookie.config";


class Auth {



  public verifyRefreshToken(token: string) {
    try {
    // FIND THE USER OF THE REFRESH TOKEN FROM DATABASE AND WETHER IT MATCHES WIT 
     return jwt.verify(token, env_config.jwt_refresh_token_secret) as RefreshToken

     
    } catch (error) {
      console.log(error)
    }
  }


  public verifyAccessToken = (token: string) => {
    try {
      return jwt.verify(token, env_config.jwt_access_token_secret) as AccessToken
    } catch (error) {
      console.log(error)
     }
  }


  public signAccessToken = async (accessTokenPayload: AccessTokenPayload) => {
    return jwt.sign(accessTokenPayload, env_config.jwt_access_token_secret, { expiresIn: TokenExpiration.Access })
  }

  public signRefreshToken = async (refreshTokenPayload: RefreshTokenPayload) => {
    return jwt.sign(refreshTokenPayload, env_config.jwt_refresh_token_secret, { expiresIn: TokenExpiration.Refresh })
  }

  public createRefreshAccessTokens = async (user: UserInterface) => {

    const accessPayload: AccessTokenPayload = { userId: user.userId,emailId:user.emailId }
    const refreshPayload: RefreshTokenPayload = { userId: user.userId, emailId:user.emailId, versionId: user.authentication.tokenVersion }

    const accessToken = await this.signAccessToken(accessPayload)
    const refreshToken = refreshPayload && await this.signRefreshToken(refreshPayload)
    return { accessToken, refreshToken }
  }

  public  setCookie = async(res:Response, accessToken: string, refreshToken?:string ) => {
    res.cookie(Cookies.ACCESSTOKEN, accessToken, accessTokenCookieOptions);
    refreshToken && res.cookie(Cookies.REFRESHTOKEN,refreshToken, refreshTokenCookieOptions);

  }
  public clearCookie  = async(res:Response)=>{
    res.cookie(Cookies.ACCESSTOKEN, '', {...defaultCookieOptions, maxAge: 0})
    res.cookie(Cookies.REFRESHTOKEN, '', {...defaultCookieOptions, maxAge: 0})
  }
}

export { Auth }