import { CURRENCY_TO_ISO_4217, CurrencyEnum } from "../shop-shared/constants/exchange";

export type ExchangeType = {
	buy: number;
	sell: number;
};

export type ExchangeState = Record<string, ExchangeType>;

export const createExchangeKey = (currencyFrom: CurrencyEnum, currencyTo: CurrencyEnum): string => {
	return `${CURRENCY_TO_ISO_4217[currencyFrom]}_${CURRENCY_TO_ISO_4217[currencyTo]}`;
};

export const parseExchange = (value: string): ExchangeType => {
	const [buyString, sellString] = value.split("_");
	return {
		buy: Number.parseFloat(buyString),
		sell: Number.parseFloat(sellString),
	};
};
