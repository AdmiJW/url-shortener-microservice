
//  Modules
const dns = require('dns');
const express = require('express');

//  Utilities
const { encode } = require('../utils/base62codec.js');
const Logger = require('../utils/logger.js');

//  Database Models
const URL_DB = require( '../models/Url_DB.js' );

//  Routes
const route = express.Router();

//  Environment Variable - Row limit
const DB_ROW_LIMIT = Number.parseInt( process.env.DATABASE_ROW_LIMIT );
if (DB_ROW_LIMIT === NaN) throw `Invalid Environment Variable: DB_ROW_LIMIT; Value: ${DB_ROW_LIMIT}`;



//  Parse body requests (Supposed to be URL to shorten) as text. 
route.use( express.text() );

route.post('/', async (req,res)=> {
    Logger.logOriginConnected(req.headers.origin, req.ip, "NEW_SHORTURL");
    let url = req.body, hostname;

    try {
        //  Parses the URL and retrieve the hostname. We use 'domain' module to test if the domain exists
        try {
            url = new URL(url);
        } catch (err) {
            throw `invalid url`;
        }
        hostname = url.hostname;

        const validateResult = await new Promise((resolve, reject)=> {
            dns.lookup(hostname, (err, address, family)=> {
                if (err) reject(`No such domain found: ${err}`);
                resolve({ address, family });
            });
        });

        Logger.logValidated(url, validateResult.address);


        //  Generate ID via random numbers. If collision happens, will retry up to 5 times
        for (let attempt = 0; attempt < 5; ++attempt) {
            const generatedId = Math.floor( Math.random() * DB_ROW_LIMIT );
            const searchExists = await URL_DB.search(generatedId);
            if (searchExists.err) throw searchExists.err;


            //  The random ID is Vacant. Directly insert into database
            if (!searchExists.length) {
                const inserted = await URL_DB.insert(generatedId, url.toString() );
                if (inserted.err) throw inserted.err;

                res.json({ 'original_url': url, 'short_url': encode(generatedId) } );
                Logger.logInserted(url, generatedId);
                return;
            } 

            //  Otherwise, the id is occupied. Check if the Date is expired and we can replace it or not?
            const searchResult = searchExists[0];

            //  It is indeed over 3 days old without accessed. Therefore replace it in the database and call it a day
            if (searchResult.time_passed?.days >= 3) {
                const inserted = await URL_DB.replace(generatedId, url.toString() );
                if (inserted.err) throw inserted.err;

                res.status(201).json({ 'original_url': url, 'short_url': encode(generatedId) } );
                Logger.logReplaced(url, generatedId, searchResult.url);
                return;
            }
            //  Old ID not expired, so we cannot replace. We iterate once again to generate a random id again, up until 5 times
            Logger.logAttempted(attempt+1, url, generatedId);
        }

        //  Ran out of attempts. Return unable to shorten the url.
        throw `Request to shorten ${url} failed. Attempts exceeded - Unable to generate suitable ID`;
    } catch (err) {
        res.status(400).json({ error: `${err}` });
        Logger.logError(err);
    }
});


module.exports = route;
