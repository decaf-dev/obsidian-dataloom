import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export const useId = (): string => {
	const [id] = useState(uuidv4());
	return id;
};
