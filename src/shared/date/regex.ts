export const YYYY_MM_DD_REGEX = new RegExp(
	/^(\d{4})\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2]\d|3[0-1])$/
);

export const MM_DD_YYYY_REGEX = new RegExp(
	/^(0[1-9]|1[0-2])\/(0[1-9]|[1-2]\d|3[0-1])\/(\d{4})$/
);

export const DD_MM_YYYY_REGEX = new RegExp(
	/^(0[1-9]|[1-2]\d|3[0-1])\/(0[1-9]|1[0-2])\/(\d{4})$/
);
