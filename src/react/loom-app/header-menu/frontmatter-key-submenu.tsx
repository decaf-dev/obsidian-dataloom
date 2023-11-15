import Submenu from "../../shared/submenu";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import Select from "src/react/shared/select";

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
	function handleKeyChange(value: string) {
		if (value === "") {
			onFrontmatterKeyChange(null);
		} else {
			onFrontmatterKeyChange(value);
		}
	}

	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding px="lg" py="md">
				<Stack spacing="md">
					<Select
						value={selectedKey ?? ""}
						onChange={(value) => handleKeyChange(value)}
					>
						<option value="">Select an option</option>
						{frontmatterKeys.map((key) => (
							<option key={key} value={key}>
								{key}
							</option>
						))}
					</Select>
				</Stack>
			</Padding>
		</Submenu>
	);
}
