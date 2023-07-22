import UserSchema from "../Models/UserSchema"
import mongoose from "mongoose"
import bcrypt from "bcrypt";

export const getUsersByEmailId = (emailId: string) =>{
    const user = UserSchema.findOne({emailId:emailId});
    return  user;
}

export const createLocalUser = async(emailid:string, password:string)=>{
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    try {
        UserSchema.create({emailId:emailid, authentication :{password:hashedPassword, tokenVersion:0}});    
    } catch (error:any) {
        throw Error(error!)
    }
}


 