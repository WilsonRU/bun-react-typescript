import ky from "ky";

import { env } from "@/config/env";
import { userStore } from "@/utils/store/user-store";

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

export class HttpClient {
	private api = ky.create({
		prefixUrl: env.apiUrl,
		headers: {
			Accept: "application/json",
		},
		hooks: {
			beforeRequest: [
				(request) => {
					const { token } = userStore.getState();

					if (token) {
						request.headers.set("Authorization", `Bearer ${token}`);
					}
				},
			],
			afterResponse: [
				(_request, _options, response) => {
					if (response.status === 401) {
						userStore.getState().clear();
						window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
					}
				},
			],
		},
	});

	get = async <TResponse = unknown>(route: string): Promise<TResponse> => {
		return await this.api.get(route).json<TResponse>();
	};

	post = async <TResponse = unknown>(route: string, body: unknown): Promise<TResponse> => {
		return await this.api.post(route, { json: body }).json<TResponse>();
	};

	put = async <TResponse = unknown>(route: string, body: unknown): Promise<TResponse> => {
		return await this.api.put(route, { json: body }).json<TResponse>();
	};

	patch = async <TResponse = unknown>(route: string, body: unknown): Promise<TResponse> => {
		return await this.api.patch(route, { json: body }).json<TResponse>();
	};

	delete = async <TResponse = unknown>(route: string): Promise<TResponse> => {
		return await this.api.delete(route).json<TResponse>();
	};
}
