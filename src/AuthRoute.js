import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthRoute = ({ children, ...rest }) => {
    const isLogged = useSelector(state => state.loggedIn);

    return (
        <Route
            {...rest}
            render={() => {
                if (isLogged) {

                    return children;
                }

                return <Redirect to="/manage-via" />;
            }}
        />
    );
};

export default AuthRoute;
