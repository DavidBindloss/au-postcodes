'use strict';
import  express  from "express";
import { readFileSync } from 'fs';
import hash from "object-hash";

const json = JSON.parse(readFileSync(new URL('./data/australian_postcodes.json', import.meta.url)));
const objHash = hash(json);

const app = express();

const PORT = process.env.PORT || 1337;

app.get('/', (req, res) => {
    res.send("Hello, World");
});

app.get('/hash', (_,res) => {
    res.send({md5Hash: objHash})
})

app.get('/postcodes/:postcode?', (req, res) => {
    if(req.params.postcode) {
        res.send(json.find(obj => obj.postcode === req.params.postcode));
    } else {
        res.send(json);
    }
    
});

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});