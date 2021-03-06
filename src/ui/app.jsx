import React from 'react';
import { PropTypes } from 'prop-types';
import Container from 'react-bootstrap/Container';


export const App = ({children}) => (
    <Container>
        {children}
    </Container>
);
App.propTypes = {
    children: PropTypes.node
};
