import React from "react";

import ExternalEmbedInput from "./external-embed-input";
import InternalEmbedSuggest from "./internal-embed-suggest";

import Divider from "src/react/shared/divider";
import { type LoomMenuCloseRequest } from "src/react/shared/menu-provider/types";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Switch from "src/react/shared/switch";

interface Props {
	closeRequest: LoomMenuCloseRequest | null;
	isExternalLink: boolean;
	value: string;
	onChange: (value: string) => void;
	onExternalLinkToggle: (value: boolean) => void;
	onClose: () => void;
}

export default function EmbedCellEdit({
	closeRequest,
	isExternalLink,
	value,
	onChange,
	onClose,
	onExternalLinkToggle,
}: Props) {
	const [externalLink, setExternalLink] = React.useState(
		isExternalLink ? value : ""
	);

	React.useEffect(() => {
		if (closeRequest !== null) {
			if (isExternalLink) {
				if (externalLink !== value) onChange(externalLink);
			}
			onClose();
		}
	}, [isExternalLink, value, externalLink, closeRequest, onClose, onChange]);

	function handleSuggestChange(value: string) {
		onChange(value);
		onClose();
	}

	return (
		<div className="dataloom-embed-cell-edit">
			<Padding width="100%" p="md">
				<Stack spacing="sm" width="100%">
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
				<Padding width="100%" p="md">
					<ExternalEmbedInput
						value={externalLink}
						onChange={setExternalLink}
					/>
				</Padding>
			)}
			{!isExternalLink && (
				<InternalEmbedSuggest onChange={handleSuggestChange} />
			)}
		</div>
	);
}
