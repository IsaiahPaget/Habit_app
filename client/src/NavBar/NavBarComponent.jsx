import React from "react";
import "./NavBar.css";
function NavBar(props) {
	return (
		<div className='navbar-container bg-gradient'>
			<a className='logo'>
				<i className='fa-solid fa-compass'></i>
				Price Compass
			</a>
			{!props.isLoggedIn ? (
				<a onClick={props.handleLogin} className='login-button'>
					<i className='fa-solid fa-arrow-right-to-bracket log'></i>
				</a>
			) : (
				<div className='nav-item'>
					<span>Hi, {props.user.displayName}</span>
					<i onClick={ props.handleLogOut } className='fa-solid fa-arrow-right-from-bracket log'></i>
				</div>
			)}
		</div>
	);
}

export default NavBar;
