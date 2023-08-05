import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";

import { css } from "@emotion/react";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { baseInputStyle } from "src/react/loom-app/shared-styles";

export default function SearchBar() {
	const { searchText, setSearchText, isSearchBarVisible, toggleSearchBar } =
		useLoomState();

	return (
		<div className="dataloom-search-bar">
			<Stack spacing="lg" isHorizontal>
				{isSearchBarVisible && (
					<input
						className="dataloom-focusable"
						css={css`
							${baseInputStyle}
						`}
						autoFocus
						type="text"
						placeholder="Type to search..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				)}
				<Button
					icon={<Icon lucideId="search" />}
					ariaLabel="Search"
					onClick={() => toggleSearchBar()}
				/>
			</Stack>
		</div>
	);
}
