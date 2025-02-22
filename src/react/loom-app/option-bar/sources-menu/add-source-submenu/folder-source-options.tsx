import Input from "src/react/shared/input";
import Stack from "src/react/shared/stack";
import Switch from "src/react/shared/switch";

import { type AddSourceError } from "./types";

interface Props {
	pathInputId: string;
	includeSubfoldersInputId: string;
	includeSubfolders: boolean;
	path: string;
	error: AddSourceError | null;
	onIncludeSubfoldersToggle: (value: boolean) => void;
	onPathChange: (value: string) => void;
}

export default function FolderSourceOptions({
	pathInputId,
	includeSubfoldersInputId,
	error,
	includeSubfolders,
	path,
	onIncludeSubfoldersToggle,
	onPathChange,
}: Props) {
	return (
		<>
			<Stack spacing="sm">
				<label htmlFor={pathInputId}>Path</label>
				<Input
					id={pathInputId}
					autoFocus={false}
					hasError={error?.inputId === pathInputId}
					value={path}
					onChange={(value) => onPathChange(value)}
				/>
			</Stack>
			<Stack spacing="sm">
				<label htmlFor={includeSubfoldersInputId}>
					Include subfolders
				</label>
				<Switch
					value={includeSubfolders}
					onToggle={onIncludeSubfoldersToggle}
				/>
			</Stack>
		</>
	);
}
