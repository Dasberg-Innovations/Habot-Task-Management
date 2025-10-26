import express from 'express'
import { PORT } from './config.js';


const app = express();

app.listen(PORT, () => {
    console.log(`Server is being hosted on localhost: ${PORT}`);
});