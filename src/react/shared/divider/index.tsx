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
				width: !isVertical ? width : "unset",
				height: isVertical === true ? height : "unset",
				borderTop:
					isVertical === false
						? "1px solid var(--hr-color)"
						: "unset",
				borderLeft:
					isVertical === true ? "1px var(--hr-color) solid" : "unset",
			}}
		/>
	);
}
