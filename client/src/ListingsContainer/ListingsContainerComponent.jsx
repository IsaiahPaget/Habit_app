import React, { useState } from "react";
import "./ListingsContainer.css";
import Listings from "../Listings/ListingsComponent";

function ListingContainer(props) {
	const [loading, setLoading] = useState(false);

	return (
		<div className='listings-container'>
			<header className='listing-header'>
				{props.isLoggedIn ? "Your Subscriptions" : "Featured"}
			</header>
			<Listings loading={loading} setLoading={setLoading} listings={props.listings} isLoggedIn={props.isLoggedIn} />
		</div>
	);
}

export default ListingContainer;
