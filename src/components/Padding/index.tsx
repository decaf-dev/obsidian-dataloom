import { getSpacing } from "src/services/spacing";
import { SpacingSize } from "src/services/spacing/types";

interface Props {
	className?: string;
	px?: SpacingSize;
	py?: SpacingSize;
	p?: SpacingSize;
	children: React.ReactNode;
}

export default function Padding({
	className = "",
	px,
	py,
	p,
	children,
}: Props) {
	let style: Record<string, any> = {
		width: "100%",
	};

	if (p) {
		style = { ...style, padding: getSpacing(p) };
	} else {
		if (px) {
			const spacing = getSpacing(px);
			style = { ...style, paddingLeft: spacing, paddingRight: spacing };
		}
		if (py) {
			const spacing = getSpacing(py);
			style = {
				...style,
				paddingTop: spacing,
				paddingBottom: spacing,
			};
		}
	}

	return (
		<div style={style} className={className}>
			{children}
		</div>
	);
}
