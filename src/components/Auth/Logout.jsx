import React from "react";

const LogoutButton = () => {
	// const { logout, isAuthenticated } = useAuth0();
	const isAuthenticated = false;

	return isAuthenticated && <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>;
};

export default LogoutButton;
