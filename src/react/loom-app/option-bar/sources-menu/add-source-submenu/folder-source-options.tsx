import Input from "src/react/shared/input";
import Stack from "src/react/shared/stack";
import Switch from "src/react/shared/switch";

import { AddSourceError } from "./types";

interface Props {
	pathInputId: string;
	showNestedToggleId: string;
	showMarkdownOnlyToggleId: string;
	showMarkdownOnly: boolean;
	showNested: boolean;
	path: string;
	error: AddSourceError | null;
	onShowMarkdownToggle: (value: boolean) => void;
	onShowNestedToggle: (value: boolean) => void;
	onPathChange: (value: string) => void;
}

export default function FolderSourceOptions({
	pathInputId,
	showNestedToggleId,
	showMarkdownOnlyToggleId,
	error,
	showMarkdownOnly,
	showNested,
	path,
	onShowMarkdownToggle,
	onShowNestedToggle,
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
				<label htmlFor={showNestedToggleId}>Show nested</label>
				<Switch value={showNested} onToggle={onShowNestedToggle} />
			</Stack>
			<Stack spacing="sm">
				<label htmlFor={showMarkdownOnlyToggleId}>
					Show markdown only
				</label>
				<Switch
					value={showMarkdownOnly}
					onToggle={onShowMarkdownToggle}
				/>
			</Stack>
		</>
	);
}
