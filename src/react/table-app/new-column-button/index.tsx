import { IconType } from "src/shared/types";
import Button from "../../shared/button";
import Icon from "../../shared/icon";

import "./styles.css";

interface Props {
	onClick: () => void;
}

export default function NewColumnButton({ onClick }: Props) {
	return (
		<div className="NLT__new-column">
			<Button
				icon={<Icon type={IconType.ADD} />}
				ariaLabel="New column"
				onClick={() => onClick()}
			/>
		</div>
	);
}
