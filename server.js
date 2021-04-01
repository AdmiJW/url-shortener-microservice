
require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();

//  Utilities
const Logger = require('./utils/logger.js');

//  Routes
const shortURL_new_route = require( './routes/shorturl_new.js' );
const shortURL_visit_route = require( './routes/shorturl_visit.js' );


//  CORS
//  Resolve CORS issue if the request is from some place
//  If the environment file does not have DISABLE XORIGIN specified
if (!process.env.DISABLE_XORIGIN) {
    //  Apply the origin allowing middleware
    app.use(function(req, res, next) {    
      var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];   //  Universal allowed origin
      var origin = req.headers.origin || '*';                                                   //  Use headers origin, or * otherwise
      if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {                  //  if environment does not specify XORIG_RESTRICT, or origin is indeed in universal allowed origin
           res.setHeader('Access-Control-Allow-Origin', origin);
           res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      }
      next();
    });
}


app.use('/api/shorturl/new', shortURL_new_route);
app.use('/api/shorturl', shortURL_visit_route);
app.use('/v', shortURL_visit_route);
app.use('/public', express.static( path.join(__dirname, 'public') ) );




//  Front end page
app.get('/', async (req,res)=> {
    res.sendFile( path.join(__dirname, 'views', 'index.html') );
    Logger.logOriginConnected(req.headers.origin, req.ip, "HOMEPAGE");
});


app.listen(process.env.PORT || 3000, ()=> {
    console.log("Url Shortener Microservice started at port " + (process.env.PORT || 3000) );
});