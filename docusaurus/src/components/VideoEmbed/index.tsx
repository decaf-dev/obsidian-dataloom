import React from "react";

interface Props {
	url: string;
}

export default function VideoEmbed({ url }: Props): JSX.Element {
	return (
		<video width="1280" controls>
			<source src={url} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}
