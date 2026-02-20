import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
	origin:["https://localhost:2000", "https://10.123.58.132:2000"],
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};
