import React from "react";
import "./Disclaimer.css";
function Disclaimer() {
	return (
		<section className='disclaimer-container'>
			<article className='disclaimer-body'>
				<header className='disclaimer-header'>Welcome to Price Compass!</header>
				<p className='disclaimer-paragraph'>
					This app monitors Google Shopping to find the best deals for you. By signing up,
					you consent to receiving emails about the lowest prices for all the products you
					are subscribed to. 
				</p>
                <p className="disclaimer-paragraph">Sign up by clicking the icon at the top right!</p>
			</article>
		</section>
	);
}

export default Disclaimer;
