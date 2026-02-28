import Express from "express";
import routes from "./routes";
import cors from "cors";
import { corsOptions } from "./configs/cors.config";
import passport from "./configs/passport.config";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Configuração do rate limiter
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutos
	max: 100, // 100 requisições por IP
	standardHeaders: true, // informa limites no cabeçalho
	legacyHeaders: false, // desativa cabeçalhos antigos
	handler: (req, res) => {
		req.socket.destroy();
	},
});

export default function createApp() {
	const app = Express();
	app.use(Express.json());
	app.use(cors(corsOptions));
	app.use(cookieParser());

	app.use(passport.initialize());

	app.use(limiter);

	app.use((error: any, _req: any, res: any, _next: any) => {
		console.log("Erro não tratado:", error);
		res.status(500).json({
			message: "Erro interno do servidor",
			error:
				process.env.NODE_ENV === "development"
					? error.message
					: undefined,
		});
	});
	app.use("/api", routes);

	app.get("/", (req, res) => {
		res.status(200).json({ message: "Server working..." });
	});

	return app;
}
