
const { encode, decode } = require('./base62codec.js');

/**
 * Logs validation success message
 * 
 * @param {string} url the original url that the client wants to shorten
 * @param {string} address the IP address for the domain that the url points to 
 */
function logValidated(url, address) {
    console.log(`${Date()} - [Validation] Request to shorten ${url} is validated. Address: ${address}`);
}


/**
 * Logs insertion success message
 * 
 * @param {string} url the original url that the client wants to shorten
 * @param {number} generatedId the inserted ID in the database for the shortened url. Not yet encoded. 
 *  Should be in range [0, DATABASE_ROW_LIMIT] (environment variable)
 */
function logInserted(url, generatedId) {
    console.log(`${Date()} - [Insert] Request to shorten ${url} is successful. Inserted at ID: ${generatedId}, encoded: ${encode(generatedId)}`);
}


/**
 * Logs replacing database row success message
 * 
 * @param {string} url the original url that the client wants to shorten
 * @param {number} generatedId  the inserted ID in the database for the shortened url. Not yet encoded. 
 * @param {string} oldUrl the old url in the same `generatedId` in database that was replaced by hew `url` 
 */
function logReplaced(url, generatedId, oldUrl) {
    console.log(`${Date()} - [Insert & Replace] Request to shorten ${url} is successful. Replaced ID: ${generatedId} encoded: ${encode(generatedId)}. Old URL: ${oldUrl}`);
}


/**
 * Logs a failed attempt to insert a shortened url into database, mainly due to occupied entry
 * 
 * @param {number} attemptNo Attempt number. Starts from 1, 2, 3 and so on until attempt limit.
 * @param {string} url the original url that the client wants to shorten
 * @param {number} attemptId the randomly generated ID for the shortened url. Not yet encoded. 
 */
function logAttempted( attemptNo, url, attemptId) {
    console.log(`${Date()} - [Attempt #${attemptNo}] Request to shorten ${url} is unsuccessful. ID: ${generatedId} is occupied.`);
}


/**
 * Logs a redirect success message when client make a request on /api/shorturl/{short_url}
 * 
 * @param {string} short_url the shortened url that the client sent to be redirected to
 * @param {string} url the url url that the client was redirected to
 */
function logRedirected(short_url, url) {
    console.log(`${Date()} - [Redirect] Redirect from ${short_url} (Decoded ID: ${decode(short_url)}) to ${url} is successful`);
}


/**
 * Logs a last_accessed date update success message when client make a request on /api/shorturl/{short_url}
 * 
 * @param {string} short_url the shortened url that the client wants to be redirected to
 */
function logUpdatedDate(short_url) {
    console.log(`${Date()} - [Update Date] Updating Last accessed for ${short_url} (Decoded ID: ${decode(short_url)}) is successful`);
}


/**
 * Logs origin
 * 
 * @param {string} origin The origin where the request comes from 
 * @param {string} ip The ip address of the client
 */
function logOriginConnected(origin, ip, url) {
    console.log(`${Date()} - [Connected] Request made from ${origin} (IP: ${ip}) to ${url}`);
}


/** 
 *  Logs Error Message
 * 
 *  @param {string} err error message
 */
function logError(err) {
    console.log(`${Date()} - [Error] ${err}`);
}




module.exports = {
    logValidated, logInserted, logReplaced, logAttempted, logRedirected, logUpdatedDate, logError, logOriginConnected
};