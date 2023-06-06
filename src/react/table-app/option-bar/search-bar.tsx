import { Button } from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";

import { css } from "@emotion/react";
import { useTableState } from "src/shared/table-state/table-state-context";

export default function SearchBar() {
	const { searchText, setSearchText, isSearchBarVisible, toggleSearchBar } =
		useTableState();

	return (
		<Stack spacing="lg">
			{isSearchBarVisible && (
				<input
					css={css`
						transition: none !important;
						max-width: 200px;
						border: 1px solid var(--background-modifier-border) !important;
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
	);
}
