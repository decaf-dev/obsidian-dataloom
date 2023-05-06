import { Button } from "src/react/shared/button";
import Divider from "src/react/shared/divider";
import Icon from "src/react/shared/icon";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { IconType } from "src/react/shared/icon/types";

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
							onClick={() => {
								onBackClick();
							}}
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