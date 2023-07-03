import { SuggestList } from "src/react/shared/suggest-list";

import { PREVIOUS_FILE_EXTENSION } from "src/data/constants";

interface Props {
	onChange: (value: string) => void;
}

export default function InternalEmbedSuggest({ onChange }: Props) {
	return (
		<SuggestList
			showInput
			hiddenExtensions={["md", PREVIOUS_FILE_EXTENSION]}
			onItemClick={(item) => onChange(item?.path ?? "")}
		/>
	);
}
