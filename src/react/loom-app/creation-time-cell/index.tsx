interface Props {
	value: string;
}

export default function CreationTimeCell({ value }: Props) {
	return <div className="dataloom-creation-time-cell">{value}</div>;
}
