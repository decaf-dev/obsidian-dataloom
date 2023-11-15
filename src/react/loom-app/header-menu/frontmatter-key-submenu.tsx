import Submenu from "../../shared/submenu";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";

interface Props {
	title: string;
	selectedKey: string | null;
	frontmatterKeys: string[];
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
					{frontmatterKeys.map((key) => (
						<MenuItem
							key={key}
							isSelected={selectedKey === key}
							name={key}
							onClick={() => onFrontmatterKeyChange(key)}
						/>
					))}
				</Stack>
			</Padding>
		</Submenu>
	);
}
