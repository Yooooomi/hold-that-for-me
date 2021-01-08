const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('body-parser').json());

const cors = process.env.CORS;
const allcors = (cors || '').split(',');

app.use((req, res, next) => {
    const origin = req.get('origin');
    let set = false;
    if (cors === 'all') {
        res.header('Access-Control-Allow-Origin', origin);
        set = true;
    } else if (allcors.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
        set = true;
    }
    if (set) {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, Content-Type, Authorization, '
            + 'x-id, Content-Length, X-Requested-With',
        );
        res.header('Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, OPTIONS');
    }
    return next();
});

let links = {};
const maxLength = process.env.MAX_LINKS || 128;

function clean() {
    const now = (new Date()).getTime();
    Object.entries(links).forEach(([key, value]) => {
        if (now > value.expiration) {
            delete links[key];
        }
    });
}

app.post('/link', async (req, res) => {
    const { link } = req.body;

    if (!link || !(typeof link === 'string') || link.length > 256 || link.length === 0) {
        return res.status(400).end();
    }
    let chosenKey = null;
    for (let i = 0; i < maxLength; i++) {
        if (!links[i]) {
            links[i] = { link, expiration: (new Date()).getTime() + (1000 * 60 * 60 * 24) };
            chosenKey = i;
            break;
        }
    }
    clean();
    return res.status(200).send({ key: chosenKey });
});

app.get('/:key', async (req, res) => {
    const { key } = req.params;

    clean();
    if (key in links) {
        const { link } = links[key];
        if (link.startsWith('http://') || link.startsWith('https://')) {
            return res.redirect(links[key]);
        }
        return res.status(200).send(link);
    }
    return res.status(404).send('This key doesnt exist');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;
