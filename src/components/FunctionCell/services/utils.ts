import { v5 as uuidv5 } from "uuid";

const NAMESPACE = "fa23ee5e-43ae-45e0-83ed-97c577913416";

export const hashString = (value: string) => {
	return uuidv5(value, NAMESPACE);
};
