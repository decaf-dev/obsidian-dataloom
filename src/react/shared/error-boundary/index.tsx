import React from "react";
import "./styles.css";
import ErrorDisplay from "../error-display";

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	errorMessage?: string;
	errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState({
			hasError: true,
			errorInfo,
			errorMessage: error.message,
		});
	}

	render() {
		let copyErrorMessage = "";
		if (this.state.hasError) {
			copyErrorMessage = `Error message: ${this.state.errorMessage}\nError info: ${this.state.errorInfo?.componentStack}`;
			return (
				<ErrorDisplay
					title="DataLoom experienced an error"
					errorMessage={this.state.errorMessage ?? ""}
					copyErrorMessage={copyErrorMessage}
					helpMessage="For help fixing this error please post in the bugs channel on the Discord:"
					helpURL="https://discord.gg/QaFbepMdN4"
				/>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
