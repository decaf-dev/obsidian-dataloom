export const getButtonClassName = (options?: {
	isSimple?: boolean;
	isLink?: boolean;
	hasIcon?: boolean;
}) => {
	const { isSimple = false, isLink = false, hasIcon = false } = options || {};
	let className = "NLT__button";
	if (hasIcon) className += " NLT__button--icon";
	if (isSimple) className += " NLT__button--simple";
	if (isLink) className += " NLT__button--link";
	return className;
};
