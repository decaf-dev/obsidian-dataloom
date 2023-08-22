import React from "react";
import Submenu from "../../shared/submenu";
import Flex from "../../shared/flex";
import Button from "../../shared/button";
import Input from "../../shared/input";
import Icon from "../../shared/icon";

interface Props {
	title: string;
	value: string;
	onValueChange: (value: string) => void;
	onBackClick: () => void;
}

export default function TextInputSubmenu({
	title,
	value,
	onValueChange,
	onBackClick,
}: Props) {
	const [textValue, setTextValue] = React.useState(value || '')

	const submitValue = () => {
		onValueChange(textValue)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			onValueChange(textValue)
		}
	};

	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Flex>
				<Input value={textValue} onChange={setTextValue} onKeyDown={handleKeyDown}/>
				<Button onClick={submitValue}><Icon lucideId="check"/></Button>
			</Flex>
		</Submenu>
	);
}
