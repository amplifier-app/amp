import React, { useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import "./Profile.css";

import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";

const Profile = () => {
	const [isOpen, setIsOpen] = useState(false);
	const userInfo = useSelector((globalState) => globalState.userProfile);

	const toggle = () => setIsOpen(!isOpen);

	const logoutWithRedirect = () =>
		logout({
			returnTo: window.location.origin,
		});

	return (
		<div>
			<Navbar expand="md" className="testStyle1">
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav navbar></Nav>
					<Nav navbar>
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav caret id="profileDropDown" className="arrow">
								{/* <Avatar id="profile-image" src={userInfo.picture} alt="Profile" /> */}
								<img id="profile-image" src={userInfo.picture} alt="Profile" width="60" className="profile-dropdown" />
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem header>{userInfo.name}</DropdownItem>
								<DropdownItem id="qsLogoutBtn" href="/api/v1/auth/logout">
									{/* <FontAwesomeIcon icon="power-off" /> Log
                      out */}
									Logout
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	);
};

export default Profile;

// import React from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// const Profile = () => {
// 	const { user, isAuthenticated, isLoading } = useAuth0();
// 	const isLoading = false;
// 	const isAuthenticated = false;

// 	if (isLoading) {
// 		return <div>Loading ...</div>;
// 	}

// 	return null;
// 	isAuthenticated && (
// 	  <div>
// 	    <img src={user.picture} alt={user.name} />
// 	    <h2>{user.name}</h2>
// 	    <p>{user.email}</p>
// 	  </div>
// 	)
// };

// export default Profile;
