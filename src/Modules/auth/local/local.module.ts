import { ModuleInterface } from "@/types/Module.interface"
import { createLocalUser, getUsersByEmailId } from "@/utils/auth.utils"
import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { Auth } from "@/services/auth";



class LocalModule  implements ModuleInterface{
    public path: string;
    public router: Router;
    private authService: Auth;

    constructor(path:string){
        this.path = path;
        this.router = Router();
        this.authService = new Auth();
        this.initializeModule()

    }

    private register = async(req:Request,res:Response) => {
        const {emailId, password, confirmPassword} = req.body.localRegisterForm;
        if(!emailId || !password || !confirmPassword){
            return res.status(404).json("Missing info");
        }
        if(await getUsersByEmailId(emailId)){
            return res.status(401).json("User already exists")
        }
        await createLocalUser(emailId, password).then(()=>{
            return res.status(200).json("User created successfully")
        })

    }
    private login  = async(req:Request,res:Response) => {
        const {emailId,password} = req.body.localLoginForm;
        if(!emailId || !password){
            return res.status(400).json("Missing credentials");
        }
        try {
            const user = await getUsersByEmailId(emailId).select('+authentication.password +authentication.tokenVersion');
            if(!user){
                return res.status(400).json("User with emailId "+emailId+" doen't exists !")
            }
            const passwordMatched = await bcrypt.compare(password, user!.authentication?.password!)
            if(!passwordMatched){
                return res.status(400).json("Incorrect User password");
            }
            const tokens = await this.authService.createRefreshAccessTokens({emailId:user.emailId, userId:user.id, authentication:{password:user.authentication?.password!,tokenVersion:user.authentication?.tokenVersion!}})
            this.authService.setCookie(res, tokens.accessToken,tokens.refreshToken);
            return res.status(200).json(tokens);
        } catch (error) {
            return res.status(500).json("Internal server error");
        }
    }
    private initializeModule(){
            this.router.post(`${this.path}/register`,this.register);
            this.router.post(`${this.path}/login`,this.login);
               
    }
}


export {LocalModule}


