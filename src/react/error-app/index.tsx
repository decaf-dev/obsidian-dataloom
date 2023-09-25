import Text from "src/react/shared/text";
import Padding from "../shared/padding";
import Stack from "../shared/stack";

import "./styles.css";
import "src/react/global.css";
import { ValidationError } from "runtypes";
import { Notice } from "obsidian";
import Divider from "../shared/divider";

interface Props {
	error: unknown;
}

export default function ErrorApp({ error }: Props) {
	async function handleCopyClick(value: string) {
		await navigator.clipboard.writeText(value);
		new Notice("Copied error to clipboard");
	}

	let errorMessage = "";
	if (error instanceof ValidationError) {
		errorMessage = JSON.stringify(error.details, null, 2);
	} else {
		errorMessage = (error as Error).message;
	}

	return (
		<div className="dataloom-error-app">
			<Padding p="xl">
				<Stack spacing="xl">
					<Stack spacing="lg">
						<Text variant="semibold" size="xl" value="Opps" />
						<Text
							variant="semibold"
							size="md"
							value="DataLoom cannot render this file"
						/>
						<Stack spacing="sm">
							<Text value="For help fixing this error please visit:" />
							<a href="https://dataloom.xyz/other/loom-file">
								https://dataloom.xyz/other/loom-file
							</a>
						</Stack>
					</Stack>
					<Divider />
					<Text variant="semibold" size="sm" value="Error message:" />
					<div className="dataloom-error-app__message">
						<Text value={errorMessage} whiteSpace="pre-wrap" />
					</div>
					<Divider />
					<button
						className="dataloom-copy-button"
						onClick={() => handleCopyClick(errorMessage)}
					>
						Copy to clipboard
					</button>
				</Stack>
			</Padding>
		</div>
	);
}
