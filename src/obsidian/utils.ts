import { generateUuid } from "src/shared/uuid";

export const createAppId = () => {
	return "a" + generateUuid();
};
