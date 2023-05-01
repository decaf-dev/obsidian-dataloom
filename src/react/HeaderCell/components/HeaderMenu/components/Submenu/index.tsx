import Button from "src/react/shared/Button";
import Divider from "src/react/shared/Divider";
import Icon from "src/react/shared/Icon";
import Padding from "src/react/shared/Padding";
import Stack from "src/react/shared/Stack";

import { IconType } from "src/services/icon/types";

interface Props {
	title: string;
	children: React.ReactNode;
	onBackClick: () => void;
}

export default function Submenu({ title, children, onBackClick }: Props) {
	return (
		<>
			<Padding p="md">
				<Stack spacing="md" isVertical>
					<Stack>
						<Button
							icon={<Icon type={IconType.KEYBOARD_BACKSPACE} />}
							onClick={() => onBackClick()}
						/>
						{title}
					</Stack>
					<Divider />
				</Stack>
			</Padding>
			<div>{children}</div>
		</>
	);
}
