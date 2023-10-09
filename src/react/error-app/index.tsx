import Text from "src/react/shared/text";
import Stack from "../shared/stack";
import Divider from "../shared/divider";
import DeserializationError from "src/data/deserialization-error";
import ErrorDisplay from "../shared/error-display";

import "src/react/global.css";

interface Props {
	error: DeserializationError;
	isEmbeddedApp?: boolean;
}

export default function ErrorApp({ error, isEmbeddedApp = false }: Props) {
	const { fileVersion, pluginVersion, failedMigration, message } = error;

	const copyErrorMessage = `Plugin version: ${pluginVersion}\nFile version: ${fileVersion}\nFailed migration: ${failedMigration}\nError message: ${message}`;

	return (
		<ErrorDisplay
			title="DataLoom cannot render file"
			errorMessage={message}
			copyErrorMessage={copyErrorMessage}
			isEmbeddedApp={isEmbeddedApp}
			helpMessage="For help fixing this error please visit:"
			helpURL="https://dataloom.xyz/other/loom-file"
			infoSection={
				<>
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
				</>
			}
		/>
	);
}
