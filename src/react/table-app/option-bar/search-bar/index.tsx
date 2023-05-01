import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import { setSearchText, toggleSearchBar } from "src/redux/global/global-slice";
import { useAppDispatch, useAppSelector } from "src/redux/global/hooks";

import "./styles.css";
import { IconType } from "src/shared/types";

export default function SearchBar() {
	const { searchText, isSearchBarVisible } = useAppSelector(
		(state) => state.global
	);
	const dispatch = useAppDispatch();

	return (
		<div className="NLT__search">
			<Stack spacing="lg">
				{isSearchBarVisible && (
					<input
						autoFocus
						type="text"
						placeholder="Type to search..."
						value={searchText}
						onChange={(e) =>
							dispatch(setSearchText(e.target.value))
						}
					/>
				)}
				<Button
					icon={<Icon type={IconType.SEARCH} />}
					ariaLabel="Search"
					onClick={() => dispatch(toggleSearchBar())}
				/>
			</Stack>
		</div>
	);
}
