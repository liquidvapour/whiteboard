import axios from 'axios';

export const populateStrokes = async (boardName) => {
    const response = await axios.get(`http://localhost:3000/board/${boardName}`)

    console.log(`response ${JSON.stringify(response.data)}`);
    return response.data.strokes;
};

export const postStroke = async (boardName, stroke) => {
    const response = await axios.post(
        `http://localhost:3000/board/${boardName}`,
        { strokes: [stroke]});

    return response.status === 200;
};