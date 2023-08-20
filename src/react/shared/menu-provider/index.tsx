import React from "react";
import { LoomMenu, LoomMenuCloseRequest } from "../menu/types";

interface ContextProps {
	openMenus: LoomMenu[];
	closeRequests: LoomMenuCloseRequest[];
	setOpenMenus: React.Dispatch<React.SetStateAction<LoomMenu[]>>;
	setCloseRequests: React.Dispatch<
		React.SetStateAction<LoomMenuCloseRequest[]>
	>;
}

const MenuContext = React.createContext<ContextProps | null>(null);

export const useMenuContext = () => {
	const value = React.useContext(MenuContext);
	if (value === null) {
		throw new Error(
			"useMenuContext() called without a <MenuProvider /> in the tree."
		);
	}
	return value;
};

interface Props {
	children: React.ReactNode;
}

export default function MenuProvider({ children }: Props) {
	const [openMenus, setOpenMenus] = React.useState<LoomMenu[]>([]);
	const [closeRequests, setCloseRequests] = React.useState<
		LoomMenuCloseRequest[]
	>([]);
	return (
		<MenuContext.Provider
			value={{ openMenus, closeRequests, setOpenMenus, setCloseRequests }}
		>
			{children}
		</MenuContext.Provider>
	);
}
