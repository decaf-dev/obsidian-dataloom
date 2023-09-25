import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import ExportModal from "src/obsidian/modal/export-modal";
import { useAppMount } from "../../app-mount-provider";
import { isSmallScreenSize } from "src/shared/render/utils";
import ImportModal from "src/obsidian/modal/import-modal";
import { useLoomState } from "../../loom-state-provider";

interface Props {
	onClose: () => void;
	onFreezeColumnsClick: () => void;
	onSettingsClick: () => void;
	onToggleColumnClick: () => void;
	onFilterClick: () => void;
}

export default function BaseContent({
	onFreezeColumnsClick,
	onToggleColumnClick,
	onFilterClick,
	onSettingsClick,
	onClose,
}: Props) {
	const { app, loomFile } = useAppMount();
	const { loomState } = useLoomState();

	const isSmallScreen = isSmallScreenSize();
	return (
		<Padding p="sm">
			{isSmallScreen && (
				<MenuItem
					lucideId="filter"
					name="Filter"
					onClick={onFilterClick}
				/>
			)}
			{isSmallScreen && (
				<MenuItem
					lucideId="eye-off"
					name="Toggle"
					onClick={onToggleColumnClick}
				/>
			)}
			<MenuItem
				lucideId="snowflake"
				name="Freeze"
				onClick={onFreezeColumnsClick}
			/>
			<MenuItem
				lucideId="import"
				name="Import"
				onClick={() => {
					onClose();
					new ImportModal(app, loomFile, loomState).open();
				}}
			/>
			<MenuItem
				lucideId="download"
				name="Export"
				onClick={() => {
					onClose();
					new ExportModal(app, loomFile, loomState).open();
				}}
			/>
			<MenuItem
				lucideId="gear"
				name="Settings"
				onClick={onSettingsClick}
			/>
		</Padding>
	);
}
