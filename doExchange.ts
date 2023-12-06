import * as assert from "assert";

import { CurrencyEnum } from "../shop-shared/constants/exchange";
import { MoneySmall } from "../shop-shared/dto/primitiveTypes";
import { createExchangeKey, ExchangeState } from "./helpers";

export const doExchange = <const From extends CurrencyEnum, const To extends CurrencyEnum>(
	currencyFrom: From,
	currencyTo: To,
	amount: MoneySmall,
	exchangeState: ExchangeState,
): MoneySmall => {
	if (`${currencyFrom}` === `${currencyTo}`) {
		return amount;
	}

	if (currencyTo === CurrencyEnum.UAH) {
		const key = createExchangeKey(currencyFrom, currencyTo);
		const exchange = exchangeState[key];
		assert.ok(exchange, `Cannot find exchange for ${key}`);
		return Math.floor((amount as number) * exchange.sell);
	} else if (currencyFrom === CurrencyEnum.UAH) {
		const key = createExchangeKey(currencyTo, currencyFrom);
		const exchange = exchangeState[key];
		assert.ok(exchange, `Cannot find exchange for ${key}`);
		return Math.floor((amount as number) / exchange.sell);
	}
	throw new Error(`Cannot exchange ${currencyFrom} to ${currencyTo}`);
};
