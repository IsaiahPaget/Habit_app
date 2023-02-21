import React from "react";
import "./Listings.css";

function Listings(props) {
	return props.listings.map((listing)=> {
        return (
            <div className="listing-container">
                <div className="listing-title">{listing.query}</div>
                <button className="listing-button">yes</button>
                <button className="listing-button">no</button>
            </div>
        );
    })
}

export default Listings;
