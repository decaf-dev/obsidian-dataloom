import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import ExportModal from "src/obsidian/modal/export-modal";
import { useMountState } from "../../mount-provider";
import { useAppSelector } from "src/redux/hooks";

interface Props {
	onExportClick: () => void;
	onFreezeColumnsClick: () => void;
}

export default function BaseContent({
	onFreezeColumnsClick,
	onExportClick,
}: Props) {
	const { app, loomFile } = useMountState();
	const { manifestPluginVersion } = useAppSelector((state) => state.global);
	return (
		<Padding p="sm">
			<MenuItem
				lucideId="snowflake"
				name="Freeze columns"
				onClick={onFreezeColumnsClick}
			/>
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
