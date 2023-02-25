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
							if (!props.loading) {
								handleRemoveQuery(listing);
							}
							props.setLoading(true);
						}}
						className='listing-container'
					>
						{props.loading ? (
							<div className='loading'>Loading ...</div>
						) : (
							<>
								<div className='listing-title'>{listing}</div>
								{props.isLoggedIn ? (
									<button className='listing-button'>
										<i className='fa-solid fa-xmark'></i>
									</button>
								) : null}
							</>
						)}
					</form>
				);
			})}
		</section>
	);
}

export default Listings;
