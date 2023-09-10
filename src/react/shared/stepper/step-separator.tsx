interface Props {
	hideBorder: boolean;
}

export default function StepSeparator({ hideBorder }: Props) {
	let className = "dataloom-step__separator";
	if (hideBorder) {
		className += " dataloom-step__separator--no-border";
	}
	return <div className={className}></div>;
}
