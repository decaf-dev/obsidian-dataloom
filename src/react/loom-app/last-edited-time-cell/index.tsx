interface Props {
	value: string;
}

export default function LastEditedTimeCell({ value }: Props) {
	return <div className="dataloom-last-edited-time-cell">{value}</div>;
}
