import React from 'react';
import { PropTypes } from 'prop-types';

export const App = ({children}) => (
    <div className="d-flex flex-wrap justify-content-center position-absolute w-100 h-100 align-items-center align-content-center">
        <span className="h1 mb-4 w-100 text-center">White Board</span>
        <div >
            {children}
        </div>
    </div>
);
App.propTypes = {
    children: PropTypes.node
};
