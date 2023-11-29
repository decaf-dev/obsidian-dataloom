import React from "react";

import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import AddSourceSubmenu from "./add-source-submenu";
import BaseContent from "./base-content";

import { LoomMenuPosition } from "src/react/shared/menu/types";
import { SourcesMenuSubmenu } from "./constants";
import {
	Column,
	FilterCondition,
	Source,
} from "src/shared/loom-state/types/loom-state";
import { SourceAddHandler } from "../../app/hooks/use-source/types";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	sources: Source[];
	columns: Column[];
	onSourceAdd: SourceAddHandler;
	onSourceDelete: (id: string) => void;
	onSourceFilterConditionChange: (id: string, value: FilterCondition) => void;
	onSourceFilterTextChange: (id: string, value: string) => void;
	onClose: () => void;
}

export default function SourcesMenu({
	id,
	isOpen,
	position,
	sources,
	onSourceAdd,
	onSourceDelete,
	onSourceFilterConditionChange,
	onSourceFilterTextChange,
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
	}

	return (
		<Menu
			id={id}
			openDirection="bottom-left"
			isOpen={isOpen}
			position={position}
			maxHeight={255}
		>
			<Padding px="lg" py="md">
				{submenu === null && (
					<BaseContent
						sources={sources}
						onSourceAdd={() => setSubmenu(SourcesMenuSubmenu.ADD)}
						onSourceDelete={onSourceDelete}
						onSourceFilterConditionChange={
							onSourceFilterConditionChange
						}
						onSourceFilterTextChange={onSourceFilterTextChange}
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
