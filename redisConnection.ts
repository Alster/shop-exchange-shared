import Redis from "ioredis";

export const redisClient =
	process.env["EXCHANGE_MOCK"] === "true"
		? null
		: new Redis({
				host: process.env["REDIS_HOST"],
				port: Number.parseInt(process.env["REDIS_PORT"] || "6379"),
			});

redisClient?.on("error", (error: unknown) => {
	console.error("[Redis]", error);
});
