import Submenu from "../../shared/submenu";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import React from "react";
import Select from "src/react/shared/select";
import { getAcceptedFrontmatterTypes } from "src/shared/frontmatter/utils";
import Input from "src/react/shared/input";
import { CellType } from "src/shared/loom-state/types/loom-state";
import { LoomMenuCloseRequest } from "src/react/shared/menu-provider/types";
import Button from "src/react/shared/button";

interface Props {
	title: string;
	columnType: CellType;
	closeRequest: LoomMenuCloseRequest | null;
	onBackClick: () => void;
	onFrontmatterKeyChange: (key: string | null) => void;
	onResetSubmenu: () => void;
	onClose: () => void;
}

export default function NewFrontmatterKeySubmenu({
	title,
	closeRequest,
	columnType,
	onBackClick,
	onFrontmatterKeyChange,
	onResetSubmenu,
	onClose,
}: Props) {
	const keyNameId = React.useId();
	const keyTypeId = React.useId();
	// const { app, loomFile } = useAppMount();

	const [key, setKey] = React.useState("");
	const [keyType, setKeyType] = React.useState<ObsidianPropertyType | null>(
		null
	);

	const handleCreateClick = React.useCallback(async () => {
		// if (keyType === null) {
		// 	return;
		// }
		// //Create the new key
		// await app.fileManager.processFrontMatter(loomFile, (frontmatter) => {
		// 	frontmatter[key] = "";
		// });
		// await updateObsidianPropertyType(app, key, keyType);
		// onFrontmatterKeyChange(key);
		onResetSubmenu();
	}, []);

	React.useEffect(() => {
		if (closeRequest !== null) {
			handleCreateClick();
		}
	}, [onFrontmatterKeyChange, closeRequest, onClose, handleCreateClick]);

	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding px="lg" py="md">
				<Stack spacing="lg">
					<Stack spacing="sm">
						<label htmlFor={keyNameId}>Key Name</label>
						<Input id={keyNameId} value={key} onChange={setKey} />
					</Stack>
					<Stack spacing="sm">
						<label htmlFor={keyTypeId}>Key Type</label>
						<Select
							id={keyTypeId}
							value={keyType ?? ""}
							onChange={(value) =>
								setKeyType(
									(value as ObsidianPropertyType) || null
								)
							}
						>
							<option value="">Select an option</option>
							{getAcceptedFrontmatterTypes(columnType).map(
								(type) => (
									<option key={type} value={type}>
										{type}
									</option>
								)
							)}
						</Select>
					</Stack>
					<Button variant="default" onClick={handleCreateClick}>
						Create
					</Button>
				</Stack>
			</Padding>
		</Submenu>
	);
}
