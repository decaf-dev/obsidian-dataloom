import { randomUUID } from "crypto";
import { useState } from "react";

export const useId = (): string => {
	const [id] = useState(randomUUID());
	return id;
};
