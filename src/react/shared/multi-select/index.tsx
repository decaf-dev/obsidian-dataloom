import Icon from "../icon";
import Stack from "../stack";
import Text from "../text";

import { useMenu } from "../menu-provider/hooks";
import { LoomMenuLevel } from "../menu-provider/types";
import MenuTrigger from "../menu-trigger";
import MultiSelectMenu from "./multi-select-menu";
import type { MultiSelectOptionType } from "./types";

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

	function openMenu() {
		menu.onOpen(LoomMenuLevel.TWO);
	}

	return (
		<>
			<MenuTrigger
				ref={menu.triggerRef}
				variant="cell"
				menuId={menu.id}
				level={LoomMenuLevel.TWO}
				isFocused={menu.isTriggerFocused}
				onOpen={() => openMenu()}
			>
				<div className="dataloom-multi-select">
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
