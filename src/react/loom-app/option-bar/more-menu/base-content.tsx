import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import ExportModal from "src/obsidian/modal/export-modal";
import { useAppMount } from "../../app-mount-provider";
import { useAppSelector } from "src/redux/hooks";
import { isSmallScreenSize } from "src/shared/render/utils";
import ImportModal from "src/obsidian/modal/import-modal";

interface Props {
	onClose: () => void;
	onFreezeColumnsClick: () => void;
	onToggleColumnClick: () => void;
	onFilterClick: () => void;
}

export default function BaseContent({
	onFreezeColumnsClick,
	onToggleColumnClick,
	onFilterClick,
	onClose,
}: Props) {
	const { app, loomFile } = useAppMount();
	const { pluginVersion } = useAppSelector((state) => state.global);

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
					new ImportModal(app, loomFile, pluginVersion).open();
				}}
			/>
			<MenuItem
				lucideId="download"
				name="Export"
				onClick={() => {
					onClose();
					new ExportModal(app, loomFile, pluginVersion).open();
				}}
			/>
		</Padding>
	);
}
