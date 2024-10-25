const http=require('http');
const express = require('express');
const cookieParser=require('cookie-parser');
const path = require('path');


const serverApp=express();
serverApp.use(express.json());
serverApp.use(cookieParser());
serverApp.use(express.static(path.join(__dirname, 'react-app', 'dist')));

const port = 100;

const server = http.createServer((req, res) => {
    serverApp(req,res);
});

server.listen(port, 'localhost',() => {
    console.log(`Server running at localhost://80`);
});

module.exports = {serverApp, path};