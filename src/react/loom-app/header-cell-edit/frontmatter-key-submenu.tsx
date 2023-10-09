import React from "react";

import Submenu from "../../shared/submenu";
import Input from "../../shared/input";
import Select from "src/react/shared/select";
import { LoomMenuCloseRequest } from "src/react/shared/menu/types";
import { FrontmatterKey } from "src/shared/loom-state/types/loom-state";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";

interface Props {
	title: string;
	frontmatterKey: FrontmatterKey | null;
	frontmatterKeys: string[];
	closeRequest: LoomMenuCloseRequest | null;
	onFrontMatterKeyChange: (value: FrontmatterKey | null) => void;
	onBackClick: () => void;
	onClose: () => void;
}

const USE_CUSTOM_INPUT_VALUE = "custom-key";

export default function FrontmatterKeySubmenu({
	title,
	frontmatterKey,
	frontmatterKeys,
	onFrontMatterKeyChange,
	onBackClick,
	closeRequest,
	onClose,
}: Props) {
	const { value = "", isCustom = false } = frontmatterKey ?? {};

	const [inputValue, setInputValue] = React.useState(value);

	React.useEffect(() => {
		if (closeRequest !== null) {
			if (isCustom) {
				onFrontMatterKeyChange({ value: inputValue, isCustom: true });
			}
			onClose();
		}
	}, [onFrontMatterKeyChange, inputValue, closeRequest, onClose, isCustom]);

	function handleValueChange(value: string) {
		if (value === USE_CUSTOM_INPUT_VALUE) {
			onFrontMatterKeyChange({
				value: "",
				isCustom: true,
			});
		} else if (value === "") {
			onFrontMatterKeyChange(null);
		} else {
			onFrontMatterKeyChange({
				value,
				isCustom: false,
			});
		}
	}

	let selectedValue = value;
	if (isCustom) {
		selectedValue = USE_CUSTOM_INPUT_VALUE;
	}

	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding px="lg" py="md">
				<Stack spacing="md">
					<Select value={selectedValue} onChange={handleValueChange}>
						<option value="">Select an option</option>
						{frontmatterKeys.map((key) => (
							<option key={key} value={key}>
								{key}
							</option>
						))}
						<option value={USE_CUSTOM_INPUT_VALUE}>Custom</option>
					</Select>
					{isCustom && (
						<Input value={inputValue} onChange={setInputValue} />
					)}
				</Stack>
			</Padding>
		</Submenu>
	);
}
