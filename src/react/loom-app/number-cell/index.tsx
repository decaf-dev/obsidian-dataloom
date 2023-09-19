import { useOverflow } from "src/shared/spacing/hooks";

import { isNumber } from "src/shared/match";
import "./styles.css";

interface Props {
	value: string;
	prefix?: string;
	suffix?: string;
	separator?: string;
}

const addCustomThousandsSeparator = (num: string, separator: string) => {
	const regex = /\B(?=(\d{3})+(?!\d))/g;
	return num.replace(regex, separator);
};

export default function NumberCell({
	value,
	prefix,
	suffix,
	separator,
}: Props) {
	const overflowClassName = useOverflow(false);

	let valueString = "";
	if (isNumber(value)) valueString = value;
	if (separator && valueString.length > 0)
		valueString = addCustomThousandsSeparator(valueString, separator);
	if (prefix && valueString.length > 0)
		valueString = `${prefix} ${valueString}`;
	if (suffix && valueString.length > 0)
		valueString = `${valueString} ${suffix}`;

	let className = "dataloom-number-cell";
	className += " " + overflowClassName;

	return <div className={className}>{valueString}</div>;
}
