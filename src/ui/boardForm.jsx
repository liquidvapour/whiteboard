import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export class BoardForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardId: props.boardId || ''
        };
    }

    onTxtBoardChange(e) {
        this.setState({ boardId: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.boardId);
    }

    render() {
        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <Form.Group>
                    <Form.Label>board id</Form.Label>
                    <Form.Control 
                        type='text' 
                        value={this.state.boardId}
                        onChange={e => this.onTxtBoardChange(e)} >
                    </Form.Control>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form.Group>
            </Form>
        );
    }
}
BoardForm.propTypes = {
    boardId: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
};
