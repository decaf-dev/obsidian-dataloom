import Submenu from "../../shared/submenu";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";

interface Props {
	title: string;
	selectedKey: string | null;
	frontmatterKeys: {
		value: string;
		isSelectable: boolean;
	}[];
	onBackClick: () => void;
	onFrontmatterKeyChange: (key: string | null) => void;
}

export default function FrontmatterKeySubmenu({
	title,
	selectedKey,
	frontmatterKeys,
	onBackClick,
	onFrontmatterKeyChange,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding py="md">
				<Stack spacing="sm">
					{frontmatterKeys.map((key) => {
						const { value, isSelectable } = key;
						const isSelected = selectedKey === value;

						function handleClick() {
							if (isSelected) {
								onFrontmatterKeyChange(null);
								return;
							}
							onFrontmatterKeyChange(value);
						}

						return (
							<MenuItem
								key={value}
								isDisabled={!isSelectable}
								isSelected={isSelected}
								name={value}
								onClick={handleClick}
							/>
						);
					})}
				</Stack>
			</Padding>
		</Submenu>
	);
}
