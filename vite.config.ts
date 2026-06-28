import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const enableReactCompiler = process.env.VITE_ENABLE_REACT_COMPILER === "true";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: enableReactCompiler
				? {
						plugins: [["babel-plugin-react-compiler"]],
					}
				: undefined,
		}),
		tailwindcss(),
		tsconfigPaths(),
		Unfonts({
			google: {
				families: ["IBM Plex Sans"],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					animation: ["framer-motion"],
					query: ["react-query"],
					router: ["react-router-dom"],
					ui: ["@radix-ui/react-label", "@radix-ui/react-slot", "lucide-react", "next-themes", "sonner"],
				},
			},
		},
	},
});
