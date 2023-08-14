import "./styles.css";

interface Props {
	width?: string;
	height?: string;
	isVertical?: boolean;
}

export default function Divider({
	isVertical = false,
	width = "100%",
	height = "100%",
}: Props) {
	return (
		<hr
			className="dataloom-hr"
			style={{
				width: !isVertical ? width : undefined,
				height: isVertical === true ? height : undefined,
				borderTop:
					isVertical === false
						? "1px solid var(--hr-color)"
						: undefined,
				borderLeft:
					isVertical === true
						? "1px var(--hr-color) solid"
						: undefined,
			}}
		/>
	);
}
