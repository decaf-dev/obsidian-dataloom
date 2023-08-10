import { v4 as uuidv4 } from "uuid";

export const createAppId = () => {
	return "a" + uuidv4();
};
