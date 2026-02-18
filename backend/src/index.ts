import dotenv from "dotenv";

dotenv.config();
import {
	getPermissions,
	loadPermissionsToCache,
} from "./models/location.model";
import startServer from "./server";
import { query } from "./utils/auth";
import { permissions } from "./state/onLineUsers";
startServer();

setTimeout(() => {
	const response = query("SHOW TABLES;")
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

setTimeout(() => {
	getPermissions(17).then((res) => console.log(res));
}, 3000);
