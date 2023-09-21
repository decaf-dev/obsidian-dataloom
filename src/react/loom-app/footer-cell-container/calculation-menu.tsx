import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import {
	getAriaLabelForCalculation,
	getAriaLabelForNumberCalculation,
	getDisplayNameForCalculation,
	getDisplayNameForNumberCalculation,
} from "src/shared/loom-state/type-display-names";
import {
	GeneralCalculation,
	CalculationType,
	CellType,
	NumberCalculation,
} from "src/shared/loom-state/types/loom-state";

interface Props {
	id: string;
	value: CalculationType;
	cellType: CellType;
	isOpen: boolean;
	triggerPosition: Position;
	onClick: (value: CalculationType) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}
export default function CalculationMenu({
	id,
	value,
	cellType,
	isOpen,
	triggerPosition,
	onClick,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<Menu
			id={id}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<div className="dataloom-function-menu">
				{Object.values(GeneralCalculation).map((type) => (
					<MenuItem
						key={type}
						name={getDisplayNameForCalculation(type)}
						ariaLabel={getAriaLabelForCalculation(type)}
						onClick={() => onClick(type)}
						isSelected={type === value}
					/>
				))}
				{cellType === CellType.NUMBER &&
					Object.values(NumberCalculation).map((type) => (
						<MenuItem
							key={type}
							ariaLabel={getAriaLabelForNumberCalculation(type)}
							name={getDisplayNameForNumberCalculation(type)}
							onClick={() => onClick(type)}
							isSelected={type === value}
						/>
					))}
			</div>
		</Menu>
	);
}
