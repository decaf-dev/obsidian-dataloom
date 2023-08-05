import "./styles.css";

interface Props {
	numActive: number;
}

export default function ActiveFilterBubble({ numActive }: Props) {
	if (numActive === 0) return <></>;
	return (
		<div className="dataloom-active-filter-bubble">
			{numActive} active filter{numActive > 1 ? "s" : ""}
		</div>
	);
}
