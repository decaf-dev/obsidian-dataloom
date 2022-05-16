import React, { forwardRef } from "react";

import { findIcon } from "src/app/services/icon";
import Button from "../Button";
interface Props {
	id?: string;
	icon: string;
	onClick: (e: React.MouseEvent) => void;
}

export default function IconButton({ id, icon, onClick }: Props) {
	return (
		<Button id={id} onClick={onClick} noPadding={true}>
			{findIcon(icon, "NLT__icon--md")}
		</Button>
	);
}
