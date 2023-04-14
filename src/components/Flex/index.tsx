interface Props {
	className?: string;
	flexDir?: "column" | "row";
	align?: "flex-start" | "center" | "flex-end";
	justify?: "flex-start" | "center" | "flex-end" | "space-between";
	children: React.ReactNode;
}

export default function Flex({
	flexDir = "row",
	justify = "flex-start",
	align = "flex-start",
	className = "",
	children,
}: Props) {
	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				flexDirection: flexDir,
				justifyContent: justify,
				alignItems: align,
				flexWrap: "wrap",
			}}
			className={className}
		>
			{children}
		</div>
	);
}
