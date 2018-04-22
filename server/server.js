import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import './env';
import { connect } from './db';
import authRoutes from './routes/auth-routes';
import passportSetup from './config/passport-setup';

const app = express();

/*
 * Database-specific setup
 * - connect to MongoDB using mongoose
 * - register mongoose Schema
 */
connect();

//set up vidw engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));
//set up routes
app.use('/auth', authRoutes);
//create home route
app.get('/', function(req, res) {
  res.render('home');
});

app.listen(3000, function() {
  console.log('App listening on port 3000!');
});
