import React from "react";
import Submenu from "../../shared/submenu";
import Input from "../../shared/input";
import { LoomMenuCloseRequest } from "src/react/shared/menu/types";

interface Props {
	title: string;
	value: string;
	onValueChange: (value: string) => void;
	onBackClick: () => void;
	closeRequest: LoomMenuCloseRequest | null;
	onClose: () => void;
}

export default function TextInputSubmenu({
	title,
	value,
	onValueChange,
	onBackClick,
	closeRequest,
	onClose,
}: Props) {
	const [textValue, setTextValue] = React.useState(value);

	React.useEffect(() => {
		if (closeRequest !== null) {
			onValueChange(textValue);
			onClose();
		}
	}, [onValueChange, textValue, closeRequest, onClose]);

	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Input value={textValue} onChange={setTextValue} />
		</Submenu>
	);
}
