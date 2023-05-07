import Stack from "src/react/shared/stack";
import FilterRowDropdown from "./filter-row-dropdown";
import Icon from "src/react/shared/icon";
import { IconType } from "src/react/shared/icon/types";
import { Button } from "src/react/shared/button";
import Switch from "src/react/shared/switch";

export default function FilterRow({}) {
	return (
		<Stack>
			<Switch isChecked={true} onToggle={() => {}} />
			<input type="text" />
			<FilterRowDropdown />
			<input type="text" />
			<Button
				icon={<Icon type={IconType.DELETE} />}
				ariaLabel="Delete filter rule"
				onClick={() => {}}
			/>
		</Stack>
	);
}
