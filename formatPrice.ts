import { CURRENCY, CURRENCY_TO_SYMBOL } from "../shop-shared/constants/exchange";
import { MoneyBig } from "../shop-shared/dto/primitiveTypes";

export function formatPrice(price: number | MoneyBig, currency: CURRENCY): string {
	let priceString = (price as number).toFixed(2);
	if (priceString.endsWith(".00")) {
		priceString = priceString.slice(0, -3);
	}

	const symbol = CURRENCY_TO_SYMBOL[currency];

	if (currency === CURRENCY.UAH) {
		return `${priceString} ${symbol}`;
	}
	return `${symbol}${priceString}`;
}
