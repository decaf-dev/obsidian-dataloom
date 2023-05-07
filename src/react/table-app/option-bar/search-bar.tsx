import { Button } from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import { setSearchText, toggleSearchBar } from "src/redux/global/global-slice";
import { useAppDispatch, useAppSelector } from "src/redux/global/hooks";

import { IconType } from "src/react/shared/icon/types";
import { css } from "@emotion/react";

export default function SearchBar() {
	const { searchText, isSearchBarVisible } = useAppSelector(
		(state) => state.global
	);
	const dispatch = useAppDispatch();

	return (
		<Stack spacing="lg">
			{isSearchBarVisible && (
				<input
					css={css`
						width: 175px;
						border-top: 0 !important;
						border-left: 0 !important;
						border-right: 0 !important;
						border-bottom: 1px solid
							var(--background-modifier-border) !important;
					`}
					autoFocus
					type="text"
					placeholder="Type to search..."
					value={searchText}
					onChange={(e) => dispatch(setSearchText(e.target.value))}
				/>
			)}
			<Button
				icon={<Icon type={IconType.SEARCH} />}
				ariaLabel="Search"
				onClick={() => dispatch(toggleSearchBar())}
			/>
		</Stack>
	);
}
