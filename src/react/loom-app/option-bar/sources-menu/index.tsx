import React from "react";

import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import AddSourceSubmenu from "./add-source-submenu";
import BaseContent from "./base-content";

import { LoomMenuPosition } from "src/react/shared/menu/types";
import { SourcesMenuSubmenu } from "./constants";
import { Column, Source } from "src/shared/loom-state/types/loom-state";
import { SourceAddHandler } from "../../app/hooks/use-source/types";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	sources: Source[];
	columns: Column[];
	onSourceAdd: SourceAddHandler;
	onSourceDelete: (id: string) => void;
	onClose: () => void;
}

export default function SourcesMenu({
	id,
	isOpen,
	position,
	sources,
	onSourceAdd,
	onSourceDelete,
	onClose,
}: Props) {
	const [submenu, setSubmenu] = React.useState<SourcesMenuSubmenu | null>(
		sources.length === 0 ? SourcesMenuSubmenu.ADD : null
	);

	//Use layout effect to prevent flash
	React.useLayoutEffect(() => {
		if (sources.length === 0) {
			setSubmenu(SourcesMenuSubmenu.ADD);
		}
	}, [sources.length]);

	function handleAddSourceClick(source: Source) {
		onSourceAdd(source);
		setSubmenu(null);
		onClose();
	}

	return (
		<Menu
			id={id}
			openDirection="bottom-left"
			isOpen={isOpen}
			width={250}
			position={position}
		>
			<Padding px="lg" py="md">
				{submenu === null && (
					<BaseContent
						sources={sources}
						onAddClick={() => setSubmenu(SourcesMenuSubmenu.ADD)}
						onDeleteClick={onSourceDelete}
					/>
				)}
				{submenu === SourcesMenuSubmenu.ADD && (
					<AddSourceSubmenu
						sources={sources}
						onAddSourceClick={handleAddSourceClick}
						onBackClick={() => setSubmenu(null)}
					/>
				)}
			</Padding>
		</Menu>
	);
}
