import Stack from "../stack";
import Text from "../text";
import Icon from "../icon";

import MultiSelectMenu from "./multi-select-menu";
import { useMenu } from "../menu-provider/hooks";
import { LoomMenuLevel } from "../menu-provider/types";
import MenuTrigger from "../menu-trigger";
import { MultiSelectOptionType } from "./types";

import "./styles.css";

interface Props {
	id: string;
	title: string;
	selectedOptionIds: string[];
	options: MultiSelectOptionType[];
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
					<Stack
						isHorizontal
						justify="space-between"
						align="center"
						height="100%"
					>
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
