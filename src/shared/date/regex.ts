export const YYYY_MM_DD_REGEX = new RegExp(
	/^(?<year>\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[1-2]\d|3[0-1])(?: +(?:(0\d|1[0-2]):([0-5]\d)\s(AM|PM)|([0-1]\d|2[0-4]):([0-5]\d)))?$/
);

export const MM_DD_YYYY_REGEX = new RegExp(
	/^(?<month>0[1-9]|1[0-2])\/(?<day>0[1-9]|[1-2]\d|3[0-1])\/(?<year>\d{4})(?: +(?:(0\d|1[0-2]):([0-5]\d)\s(AM|PM)|([0-1]\d|2[0-4]):([0-5]\d)))?$/
);

export const DD_MM_YYYY_REGEX = new RegExp(
	/^(?<day>0[1-9]|[1-2]\d|3[0-1])\.(?<month>0[1-9]|1[0-2])\.(?<year>\d{4})(?: +(?:(0\d|1[0-2]):([0-5]\d)\s(AM|PM)|([0-1]\d|2[0-4]):([0-5]\d)))?$/
);
