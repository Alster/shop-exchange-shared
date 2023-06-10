import { CURRENCY } from '../shop-shared/constants/exchange';
import { createExchangeKey, ExchangeState } from './helpers';
import { MoneySmall } from '../shop-shared/dto/primitiveTypes';

export const doExchange = (
  currencyFrom: CURRENCY,
  currencyTo: CURRENCY,
  amount: MoneySmall,
  exchangeState: ExchangeState,
): MoneySmall => {
  if (currencyFrom === currencyTo) {
    return amount;
  }

  console.log('doExchange', currencyFrom, currencyTo, amount, exchangeState);

  if (currencyTo === CURRENCY.UAH) {
    const key = createExchangeKey(currencyFrom, currencyTo);
    const exchange = exchangeState[key];
    console.log('Got exchange:', key, exchange);
    return Math.floor((amount as number) * exchange.sell);
  } else if (currencyFrom === CURRENCY.UAH) {
    const key = createExchangeKey(currencyTo, currencyFrom);
    const exchange = exchangeState[key];
    console.log('Got exchange:', key, exchange);
    return Math.floor((amount as number) / exchange.sell);
  } else {
    throw new Error(`Cannot exchange ${currencyFrom} to ${currencyTo}`);
  }
};
