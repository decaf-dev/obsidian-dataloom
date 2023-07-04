import React from "react";

export default function Badges() {
	return (
		<div style={{ display: "flex", columnGap: "10px", margin: "10px 0px" }}>
			<img
				src="https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22notion-like-tables%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json"
				referrerPolicy="no-referrer"
				height="20"
			/>
			<a
				href="https://github.com/trey-wallis/obsidian-dashboards"
				target="_blank"
				rel="noopener"
			>
				<img
					src="https://img.shields.io/github/stars/trey-wallis/obsidian-dashboards?style=social"
					referrerPolicy="no-referrer"
					alt="Github stars"
				/>
			</a>
		</div>
	);
}
