import { getSpacing } from "src/shared/spacing";
import { SpacingSize } from "src/shared/spacing/types";

interface Props {
	className?: string;
	px?: SpacingSize;
	py?: SpacingSize;
	pt?: SpacingSize;
	pb?: SpacingSize;
	p?: SpacingSize;
	children: React.ReactNode;
}

export default function Padding({
	className = "",
	px,
	py,
	pt,
	pb,
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
		} else {
			if (pb) {
				const spacing = getSpacing(pb);
				style = {
					...style,
					paddingBottom: spacing,
				};
			}
			if (pt) {
				const spacing = getSpacing(pt);
				style = {
					...style,
					paddingTop: spacing,
				};
			}
		}
	}

	return (
		<div style={style} className={className}>
			{children}
		</div>
	);
}
