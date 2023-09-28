import Menu from "src/react/shared/menu";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import Padding from "src/react/shared/padding";
import { SourcesMenuSubmenu } from "./constants";
import React from "react";
import AddSourceSubmenu from "./add-source-submenu";
import BaseContent from "./base-content";
import { Source, SourceType } from "src/shared/loom-state/types/loom-state";

interface Props {
	id: string;
	isOpen: boolean;
	triggerPosition: Position;
	sources: Source[];
	onAdd: (type: SourceType, name: string) => void;
	onDelete: (id: string) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function SourcesMenu({
	id,
	isOpen,
	triggerPosition,
	sources,
	onAdd,
	onDelete,
	onRequestClose,
	onClose,
}: Props) {
	const [submenu, setSubmenu] = React.useState<SourcesMenuSubmenu | null>(
		null
	);

	function handleAddSourceClick(type: SourceType, name: string) {
		onAdd(type, name);
		setSubmenu(null);
		onClose();
	}

	return (
		<Menu
			id={id}
			openDirection="bottom-left"
			isOpen={isOpen}
			width={225}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<Padding px="lg" py="md">
				{submenu === null && (
					<BaseContent
						sources={sources}
						onAddClick={() => setSubmenu(SourcesMenuSubmenu.ADD)}
						onDeleteClick={onDelete}
					/>
				)}
				{submenu === SourcesMenuSubmenu.ADD && (
					<AddSourceSubmenu
						onBackClick={() => setSubmenu(null)}
						onAddSourceClick={handleAddSourceClick}
					/>
				)}
			</Padding>
		</Menu>
	);
}
