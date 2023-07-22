'use strict';

import {config} from "dotenv"


config();

const {
    SERVER_PORT,
    CLIENT_URL,
    CLIENT_PORT,
    MONGO_DB_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    ENVIRONMENT,
    BASEDOMAIN,
    COOKIE_PARSER_SECRET
} = process.env


export const env_config = {
    server_port : parseInt(SERVER_PORT!),
    client_port:parseInt(CLIENT_PORT!),
    client_url : CLIENT_URL!,
    mongo_db_url: MONGO_DB_URL!,
    jwt_access_token_secret : JWT_ACCESS_TOKEN_SECRET!,
    jwt_refresh_token_secret: JWT_REFRESH_TOKEN_SECRET!,
    environment: ENVIRONMENT! === 'DEVELOPMENT' ? false : true,
    // is_production:false,

    baseDomain:BASEDOMAIN!,
    cookie_parser_secret:COOKIE_PARSER_SECRET!

    

}