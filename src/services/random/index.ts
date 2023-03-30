import { COLOR } from "../../constants";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(COLOR).length);
	return Object.values(COLOR)[index];
};

// export const randomId = (numChars: number) => {
// 	const chars =
// 		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345679";
// 	let result = "";
// 	for (let i = 0; i < numChars; i++) {
// 		result += chars[Math.floor(Math.random() * chars.length)];
// 	}
// 	return result;
// };
