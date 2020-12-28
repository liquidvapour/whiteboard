import axios from 'axios';
const root = '/back/board';

axios.defaults.validateStatus = status => status < 500;

export const populateStrokes = async (boardName) => {
    console.log(`populateStrokes ${boardName}`);
    const response = await axios.get(`${root}/${boardName}`);

    console.log(`response ${JSON.stringify(response.data)}`);
    return response.data.strokes || [];
};

export const postStroke = async (boardName, stroke) => {
    const response = await axios.post(
        `${root}/${boardName}`,
        { strokes: [stroke]});

    return response.status === 200;
};