import { Notice } from "obsidian";
import Divider from "../divider";
import Padding from "../padding";
import Stack from "../stack";
import Text from "../text";

import "./styles.css";

interface Props {
	title: string;
	errorMessage: string;
	copyErrorMessage: string;
	infoSection?: React.ReactNode;
	isEmbeddedApp?: boolean;
	helpMessage: string;
	helpURL: string;
}

export default function ErrorDisplay({
	title,
	copyErrorMessage,
	errorMessage,
	isEmbeddedApp,
	infoSection,
	helpMessage,
	helpURL,
}: Props) {
	function handleCopyClick() {
		navigator.clipboard.writeText(copyErrorMessage);
		new Notice("Copied error to clipboard");
	}

	let className = "dataloom-error";
	if (isEmbeddedApp) className += " dataloom-error--embedded-app";

	return (
		<div className={className}>
			<Padding p="2xl">
				<Stack spacing="xl">
					<Stack>
						<Text variant="semibold" size="xl" value="Opps" />
						<Text variant="semibold" size="md" value={title} />
					</Stack>
					<Divider />
					<Stack>
						<Text
							variant="semibold"
							size="md"
							value="Error message"
						/>
						<div className="dataloom-error__message">
							<Text value={errorMessage} whiteSpace="pre-wrap" />
						</div>
					</Stack>
					<Divider />
					{infoSection}
					<Stack spacing="sm">
						<Text value={helpMessage} />
						<a href={helpURL}>{helpURL}</a>
					</Stack>
					<Stack isHorizontal>
						<button
							className="dataloom-copy-button"
							onClick={() => handleCopyClick()}
						>
							Copy to clipboard
						</button>
					</Stack>
				</Stack>
			</Padding>
		</div>
	);
}
