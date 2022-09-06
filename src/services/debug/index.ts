export const logFunc = (
	componentName: string,
	functionName: string,
	args = {}
) => {
	console.log(
		`[${componentName}]: ${functionName}(${Object.keys(args).join(", ")})`
	);
	if (Object.keys(args).length !== 0) console.log(args);
};
