import { DashboardState } from "../types";
import DashboardStateCommand from "./dashboard-state-command";
import React from "react";
import { useLogger } from "../logger";
import RowSortCommand from "../commands/row-sort-command";
import { useMountState } from "src/react/dashboard-app/mount-provider";

interface Props {
	initialState: DashboardState;
	children: React.ReactNode;
	onSaveState: (appId: string, state: DashboardState) => void;
}

const DashboardStateContext = React.createContext<{
	searchText: string;
	isSearchBarVisible: boolean;
	resizingColumnId: string | null;
	dashboardState: DashboardState;
	setDashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
	toggleSearchBar: () => void;
	setResizingColumnId: React.Dispatch<React.SetStateAction<string | null>>;
	setSearchText: React.Dispatch<React.SetStateAction<string>>;
	doCommand: (command: DashboardStateCommand) => void;
	commandUndo: () => void;
	commandRedo: () => void;
} | null>(null);

export const useDashboardState = () => {
	const value = React.useContext(DashboardStateContext);
	if (value === null) {
		throw new Error(
			"useDashboardState() called without a <DashboardStateProvider /> in the tree."
		);
	}

	return value;
};

export default function DashboardStateProvider({
	initialState,
	onSaveState,
	children,
}: Props) {
	const [dashboardState, setDashboardState] = React.useState(initialState);
	const [searchText, setSearchText] = React.useState("");
	const [isSearchBarVisible, setSearchBarVisible] = React.useState(false);
	const [resizingColumnId, setResizingColumnId] = React.useState<
		string | null
	>(null);

	const [history, setHistory] = React.useState<
		(DashboardStateCommand | null)[]
	>([null]);
	const [position, setPosition] = React.useState(0);

	const logger = useLogger();
	const { appId } = useMountState();

	// React.useEffect(() => {
	// 	const jsonSizeInBytes = new TextEncoder().encode(
	// 		JSON.stringify(history)
	// 	).length;
	// 	console.log(`Size of data: ${jsonSizeInBytes / 1024} kb`);
	// 	console.log(`Size of data: ${jsonSizeInBytes / (1024 * 1024)} mb`);
	// }, [history]);

	//Whenever the table state is updated save it to disk
	const isMountedRef = React.useRef(false);
	React.useEffect(() => {
		if (!isMountedRef.current) {
			isMountedRef.current = true;
			return;
		}

		onSaveState(appId, dashboardState);
	}, [appId, dashboardState, onSaveState]);

	function handleToggleSearchBar() {
		setSearchBarVisible((prevState) => !prevState);
	}

	const undo = React.useCallback(() => {
		if (position > 0) {
			logger("handleUndoEvent");

			const currentPosition = position - 1;
			setPosition(currentPosition);

			const command = history[position];
			if (command !== null) {
				logger(command.constructor.name + ".undo");
				let newState = command.undo(dashboardState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setDashboardState(newState);
			}
		}
	}, [position, history, dashboardState, logger]);

	const redo = React.useCallback(() => {
		if (position < history.length - 1) {
			logger("handleRedoEvent");

			const currentPosition = position + 1;
			setPosition(currentPosition);

			const command = history[currentPosition];
			if (command !== null) {
				logger(command.constructor.name + ".redo");
				let newState = command.redo(dashboardState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setDashboardState(newState);
			}
		}
	}, [position, history, dashboardState, logger]);

	const doCommand = React.useCallback(
		(command: DashboardStateCommand) => {
			setHistory((prevState) => {
				//If the position is not at the end of the history, then we want to remove all the commands after the current position
				if (position < history.length - 1) {
					const newState = prevState.slice(0, position + 1);
					return [...newState, command];
				} else {
					return [...prevState, command];
				}
			});
			setPosition((prevState) => prevState + 1);

			//Execute command
			let newState = command.execute(dashboardState);
			if (command.shouldSortRows) {
				newState = new RowSortCommand().execute(newState);
			}
			setDashboardState(newState);
		},
		[position, history, dashboardState]
	);

	return (
		<DashboardStateContext.Provider
			value={{
				dashboardState,
				setDashboardState,
				doCommand,
				commandRedo: redo,
				commandUndo: undo,
				isSearchBarVisible,
				searchText,
				resizingColumnId,
				setResizingColumnId,
				toggleSearchBar: handleToggleSearchBar,
				setSearchText,
			}}
		>
			{children}
		</DashboardStateContext.Provider>
	);
}
