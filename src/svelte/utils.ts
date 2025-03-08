import { v4 as uuidv4 } from "uuid";

export function generateUuid() {
	return uuidv4();
}

export const getCurrentDateTime = () => {
	return new Date().toISOString();
};
