import React from "react";

export default function SurveyButton(): JSX.Element {
	return (
		<a
			className="survey-button"
			href="https://forms.gle/aeomAB9YDrEv1GgbA"
			target="_blank"
			rel="noopener"
		>
			<button className="survey">Take the survey</button>
		</a>
	);
}
