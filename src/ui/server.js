import axios from 'axios';
const root = '/back/board';

console.log(`app root url: `)

export const populateStrokes = async (boardName) => {
    const response = await axios.get(`${root}/${boardName}`)

    console.log(`response ${JSON.stringify(response.data)}`);
    return response.data.strokes;
};

export const postStroke = async (boardName, stroke) => {
    const response = await axios.post(
        `${root}/${boardName}`,
        { strokes: [stroke]});

    return response.status === 200;
};