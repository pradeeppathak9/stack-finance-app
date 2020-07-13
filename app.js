import express from 'express';
import cors from 'cors';
import socketio from 'socket.io';
import http from 'http';
import path from 'path';

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './config';

// import routes
import authRoutes from './routes/api/auth';
import userRoutes from './routes/api/users';
import stockRoutes from './routes/api/stock';
import Stock from './models/Stock';


const { MONGO_URI, MONGO_DB_NAME } = config;

const app = express();
// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
// Bodyparser Middleware
app.use(bodyParser.json());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


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
app.use(express.static(path.join(__dirname, "react-app", 'build')));

// If no API routes are hit, send the React app
app.use(function(req, res) {
  res.sendFile(path.resolve(__dirname, "react-app", "build", "index.html"));
});


const server = http.createServer(app);
const io = socketio(server);

function fetchLatestStockPricesForUser(socket, user_id) {
    let date = new Date()
    Stock.find({}).exec(function(err, items){
      socket.emit(user_id, { date, stocks: items })
    });
}

// Run when client connects
io.on('connection', socket => {
  console.log('connected')
  socket.on('metainfo', ({id, name, email}) => {
    console.log(socket.id, id, name, email);

    var interval = setInterval(function () {
      fetchLatestStockPricesForUser(socket, id)
    }, 3000);
    
    socket.on('disconnect', function () {
      console.log('disconnected')
      clearInterval(interval);
    });
  });
});


setInterval(function() {
  // console.log("Updating prices");
  Stock.find({}).exec(function(err, items){
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