import express from 'express';
import cors from 'cors';
import socketio from 'socket.io';
import http from 'http';
import path from 'path';

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config/index.js';

// import routes
import authRoutes from './routes/api/auth.js';
import userRoutes from './routes/api/users.js';
import stockRoutes from './routes/api/stock.js';
import { Stock } from './models/Stock.js';



const { MONGO_URI, MONGO_DB_NAME } = config;

const app = express();
// CORS Middleware
app.use(cors());
// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const db = `${MONGO_URI}/${MONGO_DB_NAME}`;
// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use Routes
// app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);

// ADD THIS LINE
app.use(express.static( "./react-app/build"));

// If no API routes are hit, send the React app
app.use(function(req, res) {
  res.sendFile("./react-app/build/index.html");
});


const server = http.createServer(app);
const io = socketio(server);

function fetchLatestStockPricesForUser(socket, user_id) {
  // filter stocks for user
    let date = new Date()
    Stock.find({}).exec(function(err, items){
      socket.emit('message', { date, stocks: items, name: user_id });
    });
}

// Run when client connects
io.on('connection', socket => {
  console.log('connected', socket.id)

  socket.on('all-stocks', ({ id, name, email }) => {
    console.log(socket.rooms);
    console.log('all-stocks joined');
    socket.join('all-stocks');
  });

  socket.on('portfolio', ({ id, name, email }) => {
    console.log('portfolio joined');
    fetchLatestStockPricesForUser(socket, name);
  });

  socket.on('disconnect', function () {
    console.log('disconnect', socket.id)
    socket.leave('all-stocks');
  });
});


setInterval(function() {
  // console.log("Updating prices");
  let date = new Date()
  Stock.find({}).exec(function(err, items){
    io.to("all-stocks").emit( "message", { date, stocks: items });
    //  updating stock prices
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      // console.log(item);

      Stock.findOne({'_id': item._id}).then(doc => {
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        doc["price"] = Math.round((doc.price + (plusOrMinus * Math.random())) * 100)/100;
        doc.save();
        //sent respnse to client
      }).catch(err => {
        console.log('Oh! Dark')
      });
    }
  });
}, 3000);


export default server;