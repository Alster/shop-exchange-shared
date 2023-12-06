import * as assert from "assert";

import { CURRENCY_TO_ISO_4217, CurrencyEnum } from "../shop-shared/constants/exchange";

export type ExchangeType = {
	buy: number;
	sell: number;
};

export type ExchangeState = Record<ReturnType<typeof createExchangeKey>, ExchangeType>;

export const createExchangeKey = <const From extends CurrencyEnum, const To extends CurrencyEnum>(
	currencyFrom: From,
	currencyTo: To,
): `${(typeof CURRENCY_TO_ISO_4217)[From]}_${(typeof CURRENCY_TO_ISO_4217)[To]}` => {
	return `${CURRENCY_TO_ISO_4217[currencyFrom]}_${CURRENCY_TO_ISO_4217[currencyTo]}`;
};

export const parseExchange = (value: string): ExchangeType => {
	const [buyString, sellString] = value.split("_");

	assert.ok(buyString, `Cannot parse buy from ${value}`);
	assert.ok(sellString, `Cannot parse sell from ${value}`);

	return {
		buy: Number.parseFloat(buyString),
		sell: Number.parseFloat(sellString),
	};
};
