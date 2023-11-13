import React from "react";

import Submenu from "../../shared/submenu";
import Select from "src/react/shared/select";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";

import {
	CellType,
	FrontmatterKey,
} from "src/shared/loom-state/types/loom-state";
import { LoomMenuCloseRequest } from "src/react/shared/menu-provider/types";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import { getAcceptedFrontmatterTypes } from "src/shared/frontmatter/utils";

interface Props {
	title: string;
	columnType: CellType;
	frontmatterKey: FrontmatterKey | null;
	frontmatterKeys: string[];
	closeRequest: LoomMenuCloseRequest | null;
	onFrontMatterKeyChange: (value: FrontmatterKey | null) => void;
	onBackClick: () => void;
	onClose: () => void;
}

const CUSTOM_KEY = "custom-key";

export default function FrontmatterKeySubmenu({
	title,
	columnType,
	frontmatterKey,
	frontmatterKeys,
	onFrontMatterKeyChange,
	onBackClick,
	closeRequest,
	onClose,
}: Props) {
	const {
		key = "",
		customType: initialKeyType = null,
		isCustom = false,
	} = frontmatterKey ?? {};

	// const [key, setKey] = React.useState(initialKey);

	const [keyType, setKeyType] = React.useState<ObsidianPropertyType | null>(
		initialKeyType
	);

	// React.useEffect(() => {
	// 	if (closeRequest !== null) {
	// 		if (isCustom) {
	// 			onFrontMatterKeyChange({
	// 				key,
	// 				isCustom: true,
	// 				customType: keyType,
	// 			});
	// 		}
	// 		onClose();
	// 	}
	// }, [onFrontMatterKeyChange, key, keyType, closeRequest, onClose, isCustom]);

	function handleSelectValueChange(value: string) {
		if (value === CUSTOM_KEY) {
			onFrontMatterKeyChange({
				key: "",
				isCustom: true,
				customType: keyType,
			});
		} else if (value === "") {
			onFrontMatterKeyChange(null);
		} else {
			onFrontMatterKeyChange({
				key: value,
				isCustom: false,
				customType: keyType,
			});
		}
	}

	let selectedKey = key;
	if (isCustom) {
		selectedKey = CUSTOM_KEY;
	}

	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding px="lg" py="md">
				<Stack spacing="md">
					<Select
						value={selectedKey}
						onChange={handleSelectValueChange}
					>
						<option value="">Select an option</option>
						{frontmatterKeys.map((key) => (
							<option key={key} value={key}>
								{key}
							</option>
						))}
						<option value={CUSTOM_KEY}>Custom</option>
					</Select>
					{isCustom && (
						<>
							{/* <Input value={key} onChange={setKey} /> */}
							{columnType !== CellType.DATE && (
								<Select
									value={keyType ?? ""}
									onChange={(value) =>
										setKeyType(
											(value as ObsidianPropertyType) ||
												null
										)
									}
								>
									<option value="">Select an option</option>
									{getAcceptedFrontmatterTypes(
										columnType
									).map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</Select>
							)}
						</>
					)}
				</Stack>
			</Padding>
		</Submenu>
	);
}
