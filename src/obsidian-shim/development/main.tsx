import ReactDOM from "react-dom/client";
import NotionLikeTable from "./notion-like-table";
import { store } from "../../redux/global/store";

import { v4 as uuidv4 } from "uuid";
import { createTableState } from "../../data/table-state-factory";

import { setDarkMode, setDebugMode } from "src/redux/global/global-slice";
import "./app.css";

const appId = uuidv4();
const tableState = createTableState(2, 2);

store.dispatch(setDarkMode(true));
store.dispatch(setDebugMode(true));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	//<React.StrictMode>
	<NotionLikeTable
		isMarkdownView={false}
		appId={appId}
		tableState={tableState}
		onSaveState={() => {
			console.log("main onSaveState");
		}}
		store={store}
	/>
	//</React.StrictMode>
);
