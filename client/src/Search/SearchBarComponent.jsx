import React from "react";
import { handlePostQuery } from "../App";
import "./SearchBar.css";

function SearchBar() {
	return (
		<form
			className='searchbar-container bg-gradient'
			onSubmit={(e) => {
				e.preventDefault();
				handlePostQuery(e.target["search"].value);
			}}
		>
			<input type='text' name='search' placeholder="Add a subscription" className='searchbar-input' />
			<button type='submit' className='searchbar-button'>
				<i className='fa-solid fa-plus'></i>
			</button>
		</form>
	);
}

export default SearchBar;
