import React from 'react';
import ReactDOM from 'react-dom';

import { start } from "./whiteboard";
import { BoardForm } from "./boardForm";

const navToBoard = (boardName, formHolder) => {
    window.history.pushState(
        {}, 
        boardName,
        window.location.origin + "/ui/" + boardName
    );
    formHolder.remove();
    start(document, boardName)
        .then(() => console.log("start done"))
        .catch(e => console.log(`error: ${e}`));
};

const uiBoardPathMatcher = new RegExp('/ui/(?<boardId>[0-9a-z-]+)');

const startUp = (document) => {

    const holder = document.createElement("div", { id: "appRoot"});

    const boardIdMatch = window.location.pathname.match(uiBoardPathMatcher);

    if (boardIdMatch && boardIdMatch.groups && boardIdMatch.groups.boardId) {
        navToBoard(boardIdMatch.groups.boardId, holder);
        return false;
    }

    document.body.append(holder);

    ReactDOM.render(
        <BoardForm 
            boardId='123' 
            onSubmit={boardId => navToBoard(boardId, holder)} 
        />, 
        holder);
};

startUp(document);