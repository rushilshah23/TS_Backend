import { Db, MongoClient } from "mongodb";
// import { constants } from "../../config";

import mongoose from "mongoose";
import { env_config } from "@/config/env.config";



// const client = new MongoClient(constants.mongo_db_url);



// let db :Db;
// const connectDb = async()=>{
//     try {
//         client.connect();
//         db = client.db("globemania");
//     } catch (error) {
//         console.log(error)
//     }
// }
// connectDb();
// export default  db;


class MongoDbConnection{
    private mongodb_uri:string;


    constructor(){
        this.mongodb_uri = env_config.mongo_db_url;
        // this.connectDb();
    }
    public async connectDb(){
        try {
             await mongoose.connect(this.mongodb_uri).then(()=>{
                console.log("Connection Successful to Mongo DB")
             })
            
        } catch (error) {
            console.log(error);
        }
    }


}

export  {MongoDbConnection};