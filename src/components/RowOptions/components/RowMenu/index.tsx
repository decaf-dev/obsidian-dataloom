import Menu from "src/components/Menu";
import MenuItem from "src/components/MenuItem";
import { IconType } from "src/services/icon/types";

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
