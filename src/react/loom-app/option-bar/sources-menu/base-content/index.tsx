import React from "react";
import SourcesHeader from "../sources-header";
import { Source } from "src/shared/loom-state/types/loom-state";
import SourceItem from "../dataloom-source";
import Stack from "src/react/shared/stack";

import "./styles.css";

interface Props {
	sources: Source[];
	onAddClick: () => void;
	onDeleteClick: (id: string) => void;
}

export default function BaseContent({
	sources,
	onAddClick,
	onDeleteClick,
}: Props) {
	const [isEditing, setIsEditing] = React.useState(false);
	return (
		<Stack spacing="md">
			<SourcesHeader
				onAddClick={onAddClick}
				onEditClick={() => setIsEditing((prevState) => !prevState)}
			/>
			<div className="dataloom-source-container">
				{sources.map((source) => {
					const { id, content, type } = source;
					return (
						<SourceItem
							key={id}
							id={id}
							content={content}
							type={type}
							isEditing={isEditing}
							onDelete={onDeleteClick}
						/>
					);
				})}
			</div>
		</Stack>
	);
}
