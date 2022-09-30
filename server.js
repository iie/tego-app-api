const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: '.env-local' });

const PORT_APP = process.env.PORT_APP || '3001';

const app = express();


/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Route
 */

const userRouter = require('./routes/user');
app.use('/', userRouter);

/**Start listening */
app.listen(PORT_APP, () => {
    console.log(`Listening for requests on port ${PORT_APP}`)
})