import Button from "src/components/Button";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";
import { setSearchText, toggleSearchBar } from "src/services/redux/globalSlice";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";

import "./styles.css";

export default function SearchBar() {
	const { searchText, isSearchBarVisible } = useAppSelector(
		(state) => state.global
	);
	const dispatch = useAppDispatch();

	return (
		<div className="NLT__search">
			<Stack spacing="lg">
				<Button
					icon={<Icon type={IconType.SEARCH} />}
					onClick={() => dispatch(toggleSearchBar())}
				/>
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
			</Stack>
		</div>
	);
}
