import { createExchangeKey, ExchangeState, parseExchange } from './helpers';
import { CURRENCIES, CURRENCY } from '../shop-shared/constants/exchange';
import { redisClient } from './redisConnection';
import { applyStaticExchange } from './staticStore';

export async function loadExchangeState() {
  const exchangeState: ExchangeState = {};

  const keys = await redisClient.keys('*');

  const currencies = CURRENCIES.filter((currency) => currency !== CURRENCY.UAH);
  const pipeline = redisClient.pipeline();
  currencies.forEach((currency) =>
    pipeline.get(createExchangeKey(currency, CURRENCY.UAH)),
  );
  const res = await pipeline.exec();
  if (!res) {
    throw new Error(`Cannot get exchange rates from redis`);
  }

  currencies.forEach((currency, index) => {
    const [error, value] = res[index];
    if (error) {
      throw error;
    }
    const key = createExchangeKey(currency, CURRENCY.UAH);
    exchangeState[key] = parseExchange(value as string);
  });

  applyStaticExchange(exchangeState);

  return exchangeState;
}
