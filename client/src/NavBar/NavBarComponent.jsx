import React from "react";
import { handleGetQueriesNow } from "../App";
import "./NavBar.css";
function NavBar(props) {
	return (
		<div className='navbar-container bg-gradient'>
			<a className='logo' onClick={ handleGetQueriesNow }>Price Compass</a>
			{!props.isLoggedIn ? (
				<a onClick={props.handleLogin} className='login-button'>
					Login
				</a>
			) : (
				<div className='logo'>Hi!</div>
			)}
		</div>
	);
}

export default NavBar;
