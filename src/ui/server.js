import axios from 'axios';
const root = '/back/board';

console.log(`app root url: `)

export const populateStrokes = async (boardName) => {
    console.log(`populateStrokes ${boardName}`);
    const response = await axios.get(
        `${root}/${boardName}`, {
            validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
            }
        });

    console.log(`response ${JSON.stringify(response.data)}`);
    return response.data.strokes || [];
};

export const postStroke = async (boardName, stroke) => {
    const response = await axios.post(
        `${root}/${boardName}`,
        { strokes: [stroke]});

    return response.status === 200;
};