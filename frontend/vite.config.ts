import { defineConfig } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: true,
		port: 2000,
		allowedHosts: ["840b-41-220-200-200.ngrok-free.app"],
		https: {
			key: fs.readFileSync("../localhost+3-key.pem"),
			cert: fs.readFileSync("../localhost+3.pem"),
		},
	},
});

