//  Modules
const express = require('express');
const route = express.Router();

//  Database Models
const URL_DB = require( '../models/Url_DB.js' );

//  Utilities
const { decode } = require( '../utils/base62codec.js' );
const Logger = require('../utils/logger.js');




route.get('/:short_url', async (req,res)=> {
    Logger.logOriginConnected(req.headers.origin, req.ip, "VISIT_URL");
    let { short_url } = req.params;
    let result, decoded;

    try {
        decoded = decode(short_url);
        result = await URL_DB.search(decoded);

        //  If there is no such shortened url
        if (!result.length )
            throw `invalid url`;            //  Don't change this. This is required by FreeCodeCamp Test

        //  Success. Redirect client to the long url
        res.redirect(301, result[0].url);
        Logger.logRedirected(short_url, result[0].url);

        //  After redirect, update the last_accessed column in the database so it won't expire
        const _ = await URL_DB.updateDate(decoded);
        Logger.logUpdatedDate(short_url);
    } catch (err) {
        res.status(400).json({ error: `${err}`});
        Logger.logError(err);
    }
});



module.exports = route;