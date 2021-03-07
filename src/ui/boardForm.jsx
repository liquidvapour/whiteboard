import React from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export class BoardForm extends React.Component {
    constructor(props) {
        super(props);
        this.onTxtBoardChange = this.onTxtBoardChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
            <Form onSubmit={this.onSubmit}>
                <Form.Group>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="board-id">
                                board id
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            type='text'
                            aria-describedby="board-id"
                            value={this.state.boardId}
                            onChange={this.onTxtBoardChange} >
                        </Form.Control>
                    </InputGroup>
                    <br/>
                    <Button variant="primary" type="submit">Go!</Button>
                </Form.Group>
            </Form>
        );
    }
}
BoardForm.propTypes = {
    boardId: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
};
