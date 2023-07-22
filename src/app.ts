import express from "express";
import { env_config } from "@/config/env.config";
import HttpServer from "./Servers/httpServer";

console.log(env_config)
const app1 = new HttpServer(env_config.server_port);

