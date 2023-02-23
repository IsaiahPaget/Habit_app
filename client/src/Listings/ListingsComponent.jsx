import React from "react";
import "./Listings.css";

function Listings(props) {
	return (
		<section>
            <header className="listing-header">Most Subscribed</header>
			{props.listings.map((listing) => {
				return (
					<div className='listing-container'>
						<div className='listing-title'>{listing.query}</div>
						<button className='listing-button'>
							<i className='fa-solid fa-check'></i>
						</button>
						<button className='listing-button'>
							<i className='fa-solid fa-xmark'></i>
						</button>
					</div>
				);
			})}
		</section>
	);
}

export default Listings;
