import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: true,
		port: 2000,
		https: {
			key: fs.readFileSync("../localhost+3-key.pem"),
			cert:fs.readFileSync("../localhost+3.pem") ,
		}

	},
});
