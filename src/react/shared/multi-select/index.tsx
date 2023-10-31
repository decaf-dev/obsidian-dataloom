import Stack from "../stack";
import Text from "../text";

import "./styles.css";
import { MultiSelectOption } from "./types";
import Icon from "../icon";
import MultiSelectMenu from "./multi-select-menu";
import { useMenu } from "../menu-provider/hooks";
import { LoomMenuLevel } from "../menu-provider/types";
import MenuTrigger from "../menu-trigger";

interface Props {
	id: string;
	title: string;
	selectedOptionIds: string[];
	options: MultiSelectOption[];
	onChange: (keys: string[]) => void;
}

export default function MultiSelect({
	id,
	title,
	selectedOptionIds,
	options,
	onChange,
}: Props) {
	const COMPONENT_ID = `multi-select-${id}`;
	const menu = useMenu(COMPONENT_ID);

	return (
		<>
			<MenuTrigger
				variant="cell"
				menuId={menu.id}
				level={LoomMenuLevel.TWO}
				isFocused={menu.isTriggerFocused}
				onOpen={() => menu.onOpen(LoomMenuLevel.TWO)}
			>
				<div className="dataloom-multi-select" ref={menu.triggerRef}>
					<Stack isHorizontal height="100%" align="center">
						<Text value={`${selectedOptionIds.length} ${title}`} />
						<Icon lucideId="chevron-down" />
					</Stack>
				</div>
			</MenuTrigger>
			<MultiSelectMenu
				id={menu.id}
				isOpen={menu.isOpen}
				position={menu.position}
				options={options}
				selectedOptionIds={selectedOptionIds}
				onChange={onChange}
			/>
		</>
	);
}
