import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
const __dirname = path.resolve();

import authRouter from './routes/auth.mjs'
import postRouter from './routes/post.mjs'
import cookieParser from 'cookie-parser'
import { decode } from 'punycode';

const app = express();
app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser

app.use("/api/v1", authRouter)
app.use(express.static(path.join(__dirname, 'web/build')))

app.use((req, res, next) => {
    console.log("cookies: ", req.cookies);

    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("decoded: ", decoded);

        req.body.decoded = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
        };

        next();

    } catch (err) {
        res.status(401).send(`not authenticated`)
    }

})

app.use("/api/v1", postRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})