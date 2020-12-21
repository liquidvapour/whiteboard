import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

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
            <form onSubmit={e => this.onSubmit(e)}>
                <p>
                    <label id='lblBoard' htmlFor='txtBoard'>board id:</label>
                    <input 
                        id='txtBoard' 
                        type='text' 
                        name='boardId'
                        value={this.state.boardId}
                        onChange={e => this.onTxtBoardChange(e)} />
                    <input type='submit' value='Submit' />
                </p>
            </form>
        );
    }
}
BoardForm.propTypes = {
    boardId: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
};
