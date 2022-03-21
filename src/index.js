import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App.tsx";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

//This is for testing with react-scripts (npm run start)
ReactDOM.render(
	<React.StrictMode>
		<div className="theme-light">
			<div className="markdown-reading-view">
				<div className="markdown-preview-view">
					<App />
				</div>
			</div>
		</div>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
