import { CURRENCY } from "../shop-shared/constants/exchange";
import { MoneySmall } from "../shop-shared/dto/primitiveTypes";
import { createExchangeKey, ExchangeState } from "./helpers";

export const doExchange = (
	currencyFrom: CURRENCY,
	currencyTo: CURRENCY,
	amount: MoneySmall,
	exchangeState: ExchangeState,
): MoneySmall => {
	if (currencyFrom === currencyTo) {
		return amount;
	}

	if (currencyTo === CURRENCY.UAH) {
		const key = createExchangeKey(currencyFrom, currencyTo);
		const exchange = exchangeState[key];
		return Math.floor((amount as number) * exchange.sell);
	} else if (currencyFrom === CURRENCY.UAH) {
		const key = createExchangeKey(currencyTo, currencyFrom);
		const exchange = exchangeState[key];
		return Math.floor((amount as number) / exchange.sell);
	}
	throw new Error(`Cannot exchange ${currencyFrom} to ${currencyTo}`);
};
