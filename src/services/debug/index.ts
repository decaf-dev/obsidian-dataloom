export const logFunc = (
	shouldDebug: boolean,
	fileName: string,
	functionName: string,
	args = {}
) => {
	if (shouldDebug) {
		console.log("");
		console.log(`[${fileName}]: ${functionName}`);
		if (args) console.log(args);
	}
};

export const logVar = (
	shouldDebug: boolean,
	fileName: string,
	functionName: string,
	description: string,
	variable: any
) => {
	if (shouldDebug) {
		console.log("");
		console.log(`[${fileName}]: ${functionName}`);
		console.log(`${description}:`);
		console.log(variable);
	}
};
