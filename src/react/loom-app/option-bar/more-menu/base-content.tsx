import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import ExportModal from "src/obsidian/modal/export-modal";
import { useMountState } from "../../mount-provider";
import { useAppSelector } from "src/redux/hooks";
import { isSmallScreenSize } from "src/shared/render/utils";

interface Props {
	onExportClick: () => void;
	onFreezeColumnsClick: () => void;
	onToggleColumnClick: () => void;
	onFilterClick: () => void;
}

export default function BaseContent({
	onFreezeColumnsClick,
	onExportClick,
	onToggleColumnClick,
	onFilterClick,
}: Props) {
	const { app, loomFile } = useMountState();
	const { manifestPluginVersion } = useAppSelector((state) => state.global);

	const isSmallScreen = isSmallScreenSize();
	return (
		<Padding p="sm">
			<MenuItem
				lucideId="snowflake"
				name="Freeze"
				onClick={onFreezeColumnsClick}
			/>
			{isSmallScreen && (
				<MenuItem
					lucideId="eye-off"
					name="Toggle"
					onClick={onToggleColumnClick}
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
				lucideId="download"
				name="Export"
				onClick={() => {
					onExportClick();
					new ExportModal(
						app,
						loomFile,
						manifestPluginVersion
					).open();
				}}
			/>
		</Padding>
	);
}
