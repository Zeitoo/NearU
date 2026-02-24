import dotenv from "dotenv";

dotenv.config();
import {
	loadPermissionsToCache,
} from "./models/location.model";
import startServer from "./server";
startServer();

setTimeout(() => {
	loadPermissionsToCache();
}, 2000);

