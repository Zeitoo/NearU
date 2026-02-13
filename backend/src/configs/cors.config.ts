import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
	origin: process.env.LAN_ADDRESS,
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};
