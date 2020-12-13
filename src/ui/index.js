import { start } from "./whiteboard";

const navToBoard = (boardName, formHolder) => {
    window.history.pushState(
        {}, 
        boardName,
        window.location.origin + "/ui/" + boardName
    );
    formHolder.remove();
    start(document);
};

const startUp = (document) => {
    const holder = document.createElement("div", { id: "appRoot"});

    document.body.append(holder);

    const form = document.createElement("form");
    holder.append(form);

    const p1 = document.createElement("p");
    form.append(p1);

    const label = document.createElement("label");
    label.id = "lblBoard";
    label.for = "txtBoard";
    label.innerHTML = "board:";
    p1.append(label);

    const input = document.createElement("input");
    input.id = "txtBoard";
    input.type = "text";
    input.name = "board"
    p1.append(input)


    const sub = document.createElement("input");
    sub.type = "submit";
    form.append(sub);

    form.onsubmit = () => { 
        navToBoard(input.value, holder);
        return false;
    };

};

startUp(document);