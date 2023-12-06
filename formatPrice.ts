import { CURRENCY_TO_SYMBOL, CurrencyEnum } from "../shop-shared/constants/exchange";
import { MoneyBig } from "../shop-shared/dto/primitiveTypes";

export function formatPrice<
	const Price extends number & MoneyBig,
	const TargetCurrency extends CurrencyEnum,
>(price: Price, currency: TargetCurrency): string {
	let priceString = price.toFixed(2);
	if (priceString.endsWith(".00")) {
		priceString = priceString.slice(0, -3);
	}

	const symbol = CURRENCY_TO_SYMBOL[currency];

	if (currency === CurrencyEnum.UAH) {
		return `${priceString} ${symbol}` as const;
	}
	return `${symbol}${priceString}` as const;
}
