import dotenv from "dotenv";

dotenv.config();
import {
	loadPermissionsToCache,
} from "./models/location.model";
import startServer from "./server";
import { query } from "./utils/auth";
startServer();

setTimeout(() => {
	query("SHOW TABLES;")
		.then((result) => {
			console.log("Database connection successful:", result);
		})
		.catch((error) => {
			console.error("Database connection failed:", error);
		});
}, 2000);

setTimeout(() => {
	loadPermissionsToCache();
}, 2000);

