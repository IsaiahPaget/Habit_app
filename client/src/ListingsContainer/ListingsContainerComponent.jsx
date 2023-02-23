import React from "react";
import "./ListingsContainer.css";
import Listings from "../Listings/ListingsComponent";

function ListingContainer(props) {
	return (
		<div className='listings-container bg-gradient'>
			<header className='listing-header'>{props.isLoggedIn ? 'Your Subscriptions' : 'Featured'}</header>
			<Listings listings={props.listings} isLoggedIn={ props.isLoggedIn }/>
		</div>
	);
}

export default ListingContainer;
