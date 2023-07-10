import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";

import { css } from "@emotion/react";
import { useTableState } from "src/shared/dashboard-state/dashboard-state-context";
import { baseInputStyle } from "src/react/dashboard-app/shared-styles";

export default function SearchBar() {
	const { searchText, setSearchText, isSearchBarVisible, toggleSearchBar } =
		useTableState();

	return (
		<Stack spacing="lg" isHorizontal>
			{isSearchBarVisible && (
				<input
					className="Dashboards__focusable"
					css={css`
						${baseInputStyle}
						max-width: 200px;
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
