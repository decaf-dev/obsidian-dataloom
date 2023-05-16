import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";

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
					lucideId="trash-2"
					name="Delete"
					onClick={() => onDeleteClick(rowId)}
				/>
			</div>
		</Menu>
	);
}
