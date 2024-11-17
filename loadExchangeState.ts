import * as assert from "assert";

import { CURRENCIES, CurrencyEnum } from "@/shop-shared/constants/exchange";
import { getErrorWithStack } from "@/shop-shared/utils/getErrorWithStack";

import { createExchangeKey, ExchangeState, parseExchange } from "./helpers";
import { redisClient } from "./redisConnection";
import { applyStaticExchange } from "./staticStore";

const exchangeState: ExchangeState = {};

export async function loadExchangeState(): Promise<ExchangeState> {
	if (Object.keys(exchangeState).length > 0) {
		applyStaticExchange(exchangeState);
		return exchangeState;
	}
	const currencies = CURRENCIES.filter((currency) => currency !== CurrencyEnum.UAH);

	if (process.env["EXCHANGE_MOCK"] === "true") {
		applyStaticExchange(exchangeState);
		return exchangeState;
	}

	try {
		assert.ok(redisClient);
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
		console.error(...getErrorWithStack(error, "Cannot load exchange state"));
		return exchangeState;
	}
}
