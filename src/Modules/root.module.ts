import { ModuleInterface } from "@/types/Module.interface";
import {  Router } from "express";
import { AuthModule } from "@/modules/auth/auth.module";

class RootModule implements ModuleInterface{
    public path: string;
    public router: Router;
  
    constructor(path:string){
        this.path = path;

        this.router = Router();
      
        this.initializeModule()

    }


    private initializeModule(){
        this.router.use(this.path,new AuthModule("/auth").router);     
    }
}


export {RootModule}


