import React from "react";

interface Props {
	content: React.ReactNode;
	addTopMargin: boolean;
}

export default function StepContent({ content, addTopMargin }: Props) {
	let className = "dataloom-step__content";
	if (addTopMargin) {
		className += " dataloom-step__content--margin-top";
	}
	return <div className={className}>{content}</div>;
}
