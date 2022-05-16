import React from "react";

const MenuContext = React.createContext({});

interface Props {
	children: React.ReactNode;
}

export default function MenuProvider({ children }: Props) {
	return <MenuContext.Provider value={{}}>{children}</MenuContext.Provider>;
}
