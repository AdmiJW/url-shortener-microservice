
const { Client } = require('pg');


class Url_DB {
    constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
        this.establishConnection();
    }

    /**
     * Inserts a new row (INSERT INTO...) into urls table of database
     * 
     * @param {number} id The numeric ID to insert. Should be in range [0, DATABASE_ROW_LIMIT) (Environment Variable)
     * @param {string} url The original, long url represented by the shortened ID
     * @returns Javascript Object representing the row inserted.
     */
    async insert(id, url) {
        const query = 'INSERT INTO urls(id, url, last_accessed) VALUES ($1, $2, NOW()) RETURNING *';
        const values = [id, url];

        try {
            return (await this.client.query(query, values) ).rows;
        } catch (err) {
            return { error : err };
        }
    }


    /**
     * Searches for a specific ID (short_url) in the urls table in database
     * 
     * @param {number} id The numeric ID to search. Should be in range [0, DATABASE_ROW_LIMIT) (Environment Variable)
     * @returns An array of search result
     */
    async search(id) {
        const query = 'SELECT id, url, NOW() - last_accessed AS time_passed FROM urls WHERE id = $1';
        const values = [id];

        try {
            return (await this.client.query(query, values) ).rows;
        } catch (err) {
            return { error : err };
        }
    }


    /**
     * Updates the `last_accessed` column with current database time in the urls table of database. 
     * 
     * @param {number} id The numeric ID to have date updated. Should be in range [0, DATABASE_ROW_LIMIT) (Environment Variable)
     * @returns Javascript Object representing the updated row
     */
    async updateDate(id) {
        const query = 'UPDATE urls SET last_accessed = NOW() WHERE id = $1 RETURNING *';
        const values = [id];

        try {
            return (await this.client.query(query, values) ).rows;
        } catch (err) {
            return { error : err };
        }
    }


    /**
     * Overwrites an existing database row with ID, with the new long url
     * 
     * @param {number} id The numeric ID to have url replaced. Should be in range [0, DATABASE_ROW_LIMIT) (Environment Variable)
     * @param {string} url The new url to replace the old url in database
     * @returns Javascript Object representing the updated row
     */
    async replace(id, url) {
        const query = 'UPDATE urls SET url = $2, last_accessed = NOW() WHERE id = $1 RETURNING *';
        const values = [id, url];

        try {
            return (await this.client.query(query, values) ).rows;
        } catch (err) {
            return { error : err };
        }
    }


    async establishConnection() {
        console.log("Connecting to Database...");
        try {
            await this.client.connect();
            console.log("Connection to Database Established");
        } catch (err) {
            throw err;
        }
    }

    
    async closeConnection(){
        console.log("Closing connection to Databse...");
        try {
            await this.client.end();
            console.log("Connection to Database Closed");
        } catch (err) {
            throw err;
        }
    }
    
}


module.exports = new Url_DB();