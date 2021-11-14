import React from "react";

const LoginButton = () => {
  // const { loginWithRedirect, isAuthenticated } = useAuth0();
  const isAuthenticated = true;

  return (
    !isAuthenticated &&
  
    <button className="login-button nav-two" onClick={() => loginWithRedirect()}>
      Log In!</button>);
    
};

export default LoginButton;