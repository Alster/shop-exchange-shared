import * as assert from "assert";

import { CURRENCIES, CurrencyEnum } from "@/shop-shared/constants/exchange";

import { createExchangeKey, ExchangeState, parseExchange } from "./helpers";
import { redisClient } from "./redisConnection";
import { applyStaticExchange } from "./staticStore";

export async function loadExchangeState(): Promise<ExchangeState> {
	const exchangeState: ExchangeState = {};
	const currencies = CURRENCIES.filter((currency) => currency !== CurrencyEnum.UAH);

	try {
		const pipeline = redisClient.pipeline();

		for (const currency of currencies)
			pipeline.get(createExchangeKey(currency, CurrencyEnum.UAH));

		const response = await pipeline.exec();
		if (!response) {
			throw new Error(`Cannot get exchange rates from redis`);
		}

		for (const [index, currency] of currencies.entries()) {
			const responseEntry = response[index];
			assert.ok(responseEntry, `Cannot get exchange rate for ${currency}`);
			const [error, value] = responseEntry;
			if (error) {
				throw error;
			}
			const key = createExchangeKey(currency, CurrencyEnum.UAH);
			exchangeState[key] = parseExchange(value as string);
		}

		applyStaticExchange(exchangeState);

		return exchangeState;
	} catch (error) {
		console.error(`Cannot load exchange state: ${error}`);
		return exchangeState;
	}
}
