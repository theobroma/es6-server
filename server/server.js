import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import flash from 'connect-flash';
const MongoStore = connectMongo(session);

import './env';
import { connect } from './db';
import authRoutes from './routes/auth-routes';
import passportSetup from './config/passport-setup';

const app = express();
app.set('port', process.env.PORT || 8080);
/*
 * Database-specific setup
 * - connect to MongoDB using mongoose
 * - register mongoose Schema
 */
connect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'supersecret',
    key: 'SID',
    cookie: { path: '/', httpOnly: true, maxAge: null },
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());

//set up vidw engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));

app.use((req, res, next) => {
  //console.log(req.get('Cookie'));
  // console.log(req.method);
  // console.log(req.query);
  // console.log(req.protocol);
  // console.log(req.secure);
  // console.log(req.headers);
  console.log(req.session);
  //console.log(req.headers['cookie']);
  // console.log(res.locals);
  // req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
  // res.send('Visits:' + req.session.numberOfVisits);
  next();
});

//set up routes
app.use('/auth', authRoutes);
//create home route
app.get('/', function(req, res) {
  res.render('home');
});

app.get('/user', function(req, res) {
  res.send('Hello from user');
});

app.listen(app.get('port'), () =>
  console.log(`Server is now running on http://localhost:${app.get('port')}`)
);
