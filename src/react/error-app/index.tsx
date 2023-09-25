import Text from "src/react/shared/text";
import Padding from "../shared/padding";
import Stack from "../shared/stack";

import "./styles.css";
import "src/react/global.css";

import { Notice } from "obsidian";
import Divider from "../shared/divider";
import DeserializationError from "src/data/deserialization-error";

interface Props {
	error: DeserializationError;
	isEmbeddedApp?: boolean;
}

export default function ErrorApp({ error, isEmbeddedApp = false }: Props) {
	async function handleCopyClick(
		message: string,
		pluginVersion: string,
		fileVersion: string,
		failedMigration: string
	) {
		const value = `Plugin version: ${pluginVersion}\nFile version: ${fileVersion}\nFailed migration: ${failedMigration}\nError message: ${message}`;
		await navigator.clipboard.writeText(value);
		new Notice("Copied error to clipboard");
	}

	const { fileVersion, pluginVersion, failedMigration, message } = error;

	let className = "dataloom-error-app";
	if (isEmbeddedApp) className += " dataloom-error-app--embedded";

	return (
		<div className={className}>
			<Padding p="2xl">
				<Stack spacing="xl">
					<Stack>
						<Text variant="semibold" size="xl" value="Opps" />
						<Text
							variant="semibold"
							size="md"
							value="DataLoom cannot render file"
						/>
					</Stack>
					<Divider />
					<Stack>
						<Text
							variant="semibold"
							size="sm"
							value="Error message:"
						/>
						<div className="dataloom-error-app__message">
							<Text value={message} whiteSpace="pre-wrap" />
						</div>
					</Stack>
					<Divider />
					<Stack isHorizontal spacing="xl">
						<Stack>
							<Text variant="semibold" value="Plugin version" />
							<Text value={pluginVersion} />
						</Stack>
						<Divider isVertical height="60px" />
						<Stack>
							<Text variant="semibold" value="File version" />
							<Text value={fileVersion} />
						</Stack>
						<Divider isVertical height="60px" />
						<Stack>
							<Text variant="semibold" value="Failed migration" />
							<Text value={failedMigration ?? "None"} />
						</Stack>
					</Stack>
					<Divider />
					<Stack spacing="sm">
						<Text value="For help fixing this error please visit:" />
						<a href="https://dataloom.xyz/other/loom-file">
							https://dataloom.xyz/other/loom-file
						</a>
					</Stack>
					<Stack isHorizontal>
						<button
							className="dataloom-copy-button"
							onClick={() =>
								handleCopyClick(
									message,
									pluginVersion,
									fileVersion,
									failedMigration ?? "None"
								)
							}
						>
							Copy error details
						</button>
					</Stack>
				</Stack>
			</Padding>
		</div>
	);
}
