import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";

interface Props {
	id: string;
	rowId: string;
	isOpen: boolean;
	isReady: boolean;
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
	isReady,
	onDeleteClick,
}: Props) {
	return (
		<Menu id={id} isOpen={isOpen} top={top} left={left} isReady={isReady}>
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
