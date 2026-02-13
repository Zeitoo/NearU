import dotenv from "dotenv";

dotenv.config();

import startServer from "./server";
import { query } from "./utils/auth";
startServer();

setTimeout(() => {
    const response  = query("SHOW TABLES;").then(result => {
        console.log("Database connection successful:", result);
    }).catch(error => {
        console.error("Database connection failed:", error);
    }); 
}, 2000)