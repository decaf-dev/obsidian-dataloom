import { IconType } from "src/react/shared/shared-icon/types";
import { Button } from "../../shared/shared-button";
import Icon from "../../shared/shared-icon";

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
