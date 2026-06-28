const apiUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !apiUrl) {
	throw new Error("Missing required environment variable: VITE_API_URL");
}

export const env = {
	apiUrl: apiUrl || "http://localhost:4001/api/",
};
