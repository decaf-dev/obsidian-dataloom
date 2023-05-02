import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import { IconType } from "src/react/shared/icon/types";

interface Props {
	id: string;
	rowId: string;
	isOpen: boolean;
	top: number;
	left: number;
	onDeleteClick: (id: string) => void;
}
export default function RowMenu({
	id,
	rowId,
	isOpen,
	top,
	left,
	onDeleteClick,
}: Props) {
	return (
		<Menu id={id} isOpen={isOpen} top={top} left={left}>
			<div className="NLT__row-menu">
				<MenuItem
					iconType={IconType.DELETE}
					name="Delete"
					onClick={() => onDeleteClick(rowId)}
				/>
			</div>
		</Menu>
	);
}
