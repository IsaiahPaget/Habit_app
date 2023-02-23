import React, { useState, useEffect } from "react";
import { handleRemoveQuery } from "../App";
import "./Listings.css";

function Listings(props) {
	return (
		<section>
			{props.listings.map((listing) => {
				return (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleRemoveQuery(listing);
						}}
						className='listing-container'
					>
						<div className='listing-title'>{listing}</div>
						{props.isLoggedIn ? (
							<button className='listing-button'>
								<i className='fa-solid fa-xmark'></i>
							</button>
						) : null }
					</form>
				);
			})}
		</section>
	);
}

export default Listings;
