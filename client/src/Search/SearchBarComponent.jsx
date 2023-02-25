import React, { useState } from "react";
import { handlePostQuery } from "../App";
import "./SearchBar.css";

function SearchBar() {
	const [loading, setLoading] = useState(false);

	return (
		<form
			className='searchbar-container'
			onSubmit={(e) => {
				e.preventDefault();
				handlePostQuery(e.target["search"].value);
				setLoading(true);
			}}
		>
			{loading ? (
				<div className="loading">Loading ...</div>
			) : (
				<>
					<input
						type='text'
						name='search'
						placeholder='Add a subscription'
						className='searchbar-input'
					/>
					<button type='submit' className='searchbar-button'>
						<i className='fa-solid fa-plus'></i>
					</button>
				</>
			)}
		</form>
	);
}

export default SearchBar;
