import React from "react";

import ExternalEmbedInput from "./external-embed-input";
import InternalEmbedSuggest from "./internal-embed-suggest";

import { useCompare } from "src/shared/hooks";
import { MenuCloseRequest } from "src/shared/menu/types";
import Switch from "src/react/shared/switch";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import Divider from "src/react/shared/divider";

interface Props {
	menuCloseRequest: MenuCloseRequest | null;
	isExternalLink: boolean;
	value: string;
	onChange: (value: string) => void;
	onExternalLinkToggle: (value: boolean) => void;
	onMenuClose: () => void;
}

export default function EmbedCellEdit({
	menuCloseRequest,
	isExternalLink,
	value,
	onChange,
	onMenuClose,
	onExternalLinkToggle,
}: Props) {
	const [externalLink, setExternalLink] = React.useState(
		isExternalLink ? value : ""
	);

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			if (isExternalLink) {
				if (externalLink !== value) onChange(externalLink);
			}
			onMenuClose();
		}
	}, [
		isExternalLink,
		value,
		externalLink,
		hasCloseRequestTimeChanged,
		menuCloseRequest,
		onMenuClose,
		onChange,
	]);

	function handleSuggestChange(value: string) {
		onChange(value);
		onMenuClose();
	}

	return (
		<div className="Dashboards__embed-cell-edit">
			<Stack isVertical width="100%" spacing="lg">
				<Padding width="100%" px="md" pt="md">
					<Stack isVertical spacing="sm" width="100%">
						<label htmlFor="external-switch">External Link</label>
						<Switch
							id="external-switch"
							value={isExternalLink}
							onToggle={onExternalLinkToggle}
						/>
					</Stack>
				</Padding>
				<Divider />
				{isExternalLink && (
					<Padding width="100%" px="md" pb="md">
						<ExternalEmbedInput
							value={externalLink}
							onChange={setExternalLink}
						/>
					</Padding>
				)}
				{!isExternalLink && (
					<InternalEmbedSuggest onChange={handleSuggestChange} />
				)}
			</Stack>
		</div>
	);
}
