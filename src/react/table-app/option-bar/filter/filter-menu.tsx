import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ToggleColumn } from "../types";
import Icon from "src/react/shared/icon";
import { IconType } from "src/react/shared/icon/types";
import { Button } from "src/react/shared/button";
import FilterRow from "./filter-row";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	columns: ToggleColumn[];
}

export default function FilterMenu({ id, top, left, isOpen, columns }: Props) {
	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left}>
			<div className="NLT__filter-menu">
				<Padding p="md">
					<Stack spacing="md" isVertical>
						<FilterRow />
					</Stack>
					<Button
						icon={<Icon type={IconType.ADD} />}
						ariaLabel="Add filter rule"
						onClick={() => {}}
					/>
				</Padding>
			</div>
		</Menu>
	);
}
