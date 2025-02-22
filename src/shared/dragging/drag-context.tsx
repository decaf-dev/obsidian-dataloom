import React from "react";
import { type DragData } from "./types";

type DropZone = {
	id: string;
	top: number;
	bottom: number;
	left: number;
	right: number;
};

interface ContextProps {
	dragData: DragData | null;
	touchDropZone: DropZone | null;
	setDragData: React.Dispatch<React.SetStateAction<DragData | null>>;
	setTouchDropZone: React.Dispatch<React.SetStateAction<DropZone | null>>;
}

const DragContext = React.createContext<ContextProps | null>(null);

export const useDragContext = () => {
	const value = React.useContext(DragContext);
	if (value === null) {
		throw new Error(
			"useDragContext() called without a <DragProvider /> in the tree."
		);
	}

	return value;
};

interface Props {
	children: React.ReactNode;
}

export default function DragProvider({ children }: Props) {
	const [dragData, setDragData] = React.useState<DragData | null>(null);
	const [touchDropZone, setTouchDropZone] = React.useState<DropZone | null>(
		null
	);
	return (
		<DragContext.Provider
			value={{ dragData, touchDropZone, setDragData, setTouchDropZone }}
		>
			{children}
		</DragContext.Provider>
	);
}
