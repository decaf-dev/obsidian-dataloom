export const logFunc = (
	shouldDebug: boolean,
	fileName: string,
	functionName: string,
	args = {}
) => {
	if (shouldDebug) {
		console.log(`[${fileName}] ${functionName}`);
		if (Object.keys(args).length !== 0) console.log(args);
	}
};
