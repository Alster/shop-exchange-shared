import { ExchangeState } from "./helpers";

let staticExchange: ExchangeState = {};

const awaiters: ((argument: ExchangeState) => void)[] = [];

export function applyStaticExchange(exchange: ExchangeState) {
	staticExchange = exchange;
	for (const resolve of awaiters) resolve(exchange);
	awaiters.length = 0;
}

export async function getStaticExchange(): Promise<ExchangeState> {
	if (Object.keys(staticExchange).length > 0) {
		return staticExchange;
	}

	return new Promise((resolve) => {
		awaiters.push(resolve);
	});
}
