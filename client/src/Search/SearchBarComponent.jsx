import React from "react";
import { handlePostQuery } from "../App";
import "./SearchBar.css";

function SearchBar() {
	return (
		<form
			className='searchbar-container bg-gradient'
			onSubmit={(e) => {
				e.preventDefault();
				handlePostQuery(e.target['search'].value);
			}}
		>
			<input type='text' name='search' className='searchbar-input' />
			<button type='submit' className='searchbar-button'>
				O
			</button>
		</form>
	);
}

export default SearchBar;
