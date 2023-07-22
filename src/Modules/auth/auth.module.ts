import { ModuleInterface } from "@/types/Module.interface";
import { NextFunction, Request, Response, Router } from "express";

import { LocalModule } from "@/modules/auth/local/local.module";
import { Cookies } from "@/types/Cookies.enum";
import { Auth } from "@/services/auth";
import { TokenExpiration } from "@/types/Payloads.interface";
import UserInterface from "@/types/User.interface";


class AuthModule implements ModuleInterface{
    public path: string;
    public router: Router;
    private authService: Auth;
    constructor(path:string){
        this.path = path;
        this.router = Router();
        this.authService = new Auth();
        this.initializeModule()

    }

    private authenticate = async(req:Request,res:Response) => {
        
        const accessTokenPayload =  this.authService.verifyAccessToken(req.signedCookies[Cookies.ACCESSTOKEN]);
        if(accessTokenPayload){
            return res.status(200).json(accessTokenPayload)
            
        }
        if(!accessTokenPayload){
            const refreshTokenPayload = this.authService.verifyRefreshToken(req.signedCookies[Cookies.REFRESHTOKEN])
            console.log(refreshTokenPayload)
            if(refreshTokenPayload){
                let user :UserInterface;
                const expiration = new Date(refreshTokenPayload.exp * 1000)
                const now = new Date()
                const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000
              
                if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
             
                    user = {
                        authentication:{tokenVersion: refreshTokenPayload.versionId},
                        emailId:refreshTokenPayload.emailId,
                        userId:refreshTokenPayload.userId
                    }

                    const newTokens = await this.authService.createRefreshAccessTokens(user)
                    await  this.authService.setCookie(res,newTokens.accessToken,newTokens.refreshToken)
                    return res.status(200).json("Both tokens refreshed "+ user);
                }
                const accessToken = await this.authService.signAccessToken({emailId:refreshTokenPayload.emailId,userId:refreshTokenPayload.userId});
                this.authService.setCookie(res,accessToken)
                return res.status(200).json("Access Token refreshed "+ refreshTokenPayload)

            }else{
                return res.status(400).json("Unauthenticated");
            }
        }


    }
    private initializeModule(){
        this.router.post(`${this.path}/authenticate`,this.authenticate);
        this.router.use(this.path, new LocalModule("/local").router); 

    }
}


export {AuthModule}


