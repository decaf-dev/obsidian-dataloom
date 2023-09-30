import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import ExportModal from "src/obsidian/modal/export-modal";
import { useAppMount } from "../../app-mount-provider";
import { isSmallScreenSize } from "src/shared/render/utils";
import ImportModal from "src/obsidian/modal/import-modal";
import { useLoomState } from "../../loom-state-provider";

interface Props {
	onClose: () => void;
	onSettingsClick: () => void;
	onToggleColumnClick: () => void;
	onFilterClick: () => void;
	onSourcesClick: () => void;
}

export default function BaseContent({
	onToggleColumnClick,
	onFilterClick,
	onSettingsClick,
	onSourcesClick,
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
					name="Sources"
					onClick={onSourcesClick}
				/>
			)}
			{isSmallScreen && (
				<MenuItem
					lucideId="filter"
					name="Filter"
					onClick={onFilterClick}
				/>
			)}
			<MenuItem
				lucideId="eye-off"
				name="Toggle"
				onClick={onToggleColumnClick}
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
				lucideId="wrench"
				name="Settings"
				onClick={onSettingsClick}
			/>
		</Padding>
	);
}
