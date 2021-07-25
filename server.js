
require('dotenv').config();


const path = require('path');
const express = require('express');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

//  Utilities
const Logger = require('./utils/logger.js');

//  Routes
const shortURL_new_route = require( './routes/shorturl_new.js' );
const shortURL_visit_route = require( './routes/shorturl_visit.js' );

//============================
//  Rate Limiters
//============================
const apiRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,            // 5 Minutes, 300 seconds
    max: 600                            // Maximum of 900 requests in 5 minute
});
const staticRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,            // 5 Minutes, 300 seconds
    max: 300                            // Maximum of 300 requests in 5 minute
}); 


// HelmetJS for HTTP header security
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", 'unpkg.com'],
        }
    }
}));


//  FreeCodeCamp's CORS Configuration
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


//=======================
// ROUTES
//=======================
app.use('/api/shorturl/new', apiRateLimiter, shortURL_new_route);
app.use('/api/shorturl', apiRateLimiter, shortURL_visit_route);
app.use('/v', apiRateLimiter, shortURL_visit_route);
app.use('/public', staticRateLimiter, express.static( path.join(__dirname, 'public') ) );


app.get('/', apiRateLimiter, async (req,res)=> {
    res.sendFile( path.join(__dirname, 'views', 'index.html') );
    Logger.logOriginConnected(req.headers.origin, req.ip, "HOMEPAGE");
});


app.listen(process.env.PORT || 3000, ()=> {
    console.log("Url Shortener Microservice started at port " + (process.env.PORT || 3000) );
    console.log("Mode: " + process.env.NODE_ENV);
});