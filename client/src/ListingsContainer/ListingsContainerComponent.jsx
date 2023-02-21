import React from "react";
import './ListingsContainer.css'
import Listings from "../Listings/ListingsComponent";

function ListingContainer(props) {
	return (
		<div className="listings-container bg-gradient">
			<Listings listings={ props.listings }/>
		</div>
	);
}

export default ListingContainer;
