import { SuggestList } from "src/react/shared/suggest-list";

import { LOOM_EXTENSION } from "src/data/constants";

interface Props {
	onChange: (value: string) => void;
}

export default function InternalEmbedSuggest({ onChange }: Props) {
	return (
		<SuggestList
			showInput
			hiddenExtensions={["md", LOOM_EXTENSION]}
			onItemClick={(item) => onChange(item?.path ?? "")}
		/>
	);
}
