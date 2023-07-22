import express, { Application, Router } from "express";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { env_config } from "@/config/env.config";
import { RootModule } from "@/modules/root.module";
import { MongoDbConnection } from "@/services/db";
import cookieParser from "cookie-parser";
import { Auth } from "@/services/auth";

class HttpServer {
    public app: Application;
    public port: number;

    private allowedOrigins: string[] = [`${env_config.client_url}:${env_config.client_port}`];
    private corsOptions: CorsOptions = {
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        origin: this.allowedOrigins,

    }
    constructor(port_number: number) {
        
        this.port = port_number;
        this.app = express();
        this.preStartServer().then(() => {
            this.startServer();
        })
    }
    private initializeMiddleware(): void {
        this.app.use(helmet());
        this.app.use(cors(this.corsOptions));
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
        this.app.use(cookieParser(env_config.cookie_parser_secret))

        console.log("Middlewares initialized !")
    }
    private async initializeDatabaseConnections(): Promise<void> {
        // await mongoose.connect(constants.mongo_db_url).then(() => {
        //     console.log("Connected to Mongo DB!")
        // })
        await new MongoDbConnection().connectDb();
        
    }
    private initializeModules():void{
        this.app.use(new RootModule("/").router);
        // this.app.use(new AuthModule("/auth").router);

    }
    private async preStartServer(): Promise<void> {
        this.initializeMiddleware();
        await this.initializeDatabaseConnections()
        this.initializeModules();
    }
    private startServer(): void {
        this.app.listen(this.port, () => {
            console.log("Server started at " + this.port)
        })
    }

}

export default HttpServer;