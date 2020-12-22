import React from 'react';
import ReactDOM from 'react-dom';

import { start as startWhiteboard } from "./whiteboard";
import { BoardForm } from "./boardForm";

const navToBoard = (boardName, formHolder) => {
    window.history.pushState(
        {}, 
        boardName,
        window.location.origin + "/ui/" + boardName
    );
    formHolder.remove();
    startWhiteboard(document, boardName)
        .then(() => console.log("start done"))
        .catch(e => console.log(`error: ${e}`));
};

const uiBoardPathMatcher = new RegExp('/ui/(?<boardId>[0-9a-z-]+)');

const parseUrl = (pathname) => {
    const boardIdMatch = pathname.match(uiBoardPathMatcher);
    return boardIdMatch && boardIdMatch.groups && boardIdMatch.groups.boardId; 
}

const startUp = (document) => {

    const holder = document.createElement("div", { id: "appRoot"});
    document.body.append(holder);

    const boardId = parseUrl(window.location.pathname);

    if (boardId) {
        navToBoard(boardId, holder);
    } else {
        ReactDOM.render(
            <BoardForm onSubmit={boardId => navToBoard(boardId, holder)}/>, 
            holder);
    }
};

startUp(document);