
//Encodes integers that goes up to 10000, into 3 alphabets

//  Base 62 digits
const digits = 'vwxyz01rsBCDEKLMNOPQFtu7cd8ghijk456abopqTlmnRS239AGHIJefUVWXYZ';
const base = digits.length;


/**
 * Encodes base 10 number IDs into base 62 sequence
 * 
 * @param {number} number The ID (base 10) number to be encoded into base 62 digit 
 * @returns Encoded base 62 digit
 */
function encode(number) {
    number = Number.parseInt(number);
    if (number === NaN || number < Number.parseInt(0) || number > 10000) 
        throw TypeError('Invalid integer to be encoded into base 62, length 3 string! It must be between 0 (inclusive) and (exclusive) inclusive!');

    let res = "";
    for (let i = 0; i < 3; ++i) {
        res += (digits.charAt( number % base ) );
        number /= Math.floor(base);
    }
    return res;
}


/**
 * Decodes from base 62 sequence back into base 10 ID
 * 
 * @param {string} base62Sequence Base 62 sequence to be decoded back into base 10 digit
 * @returns Decoded Base 10 ID
 */
function decode(base62Sequence) {
    if ( !/^[a-zA-Z0-9]{3}$/.test(base62Sequence) )
        throw TypeError("Invalid base 62 string to be decoded! It must satisfy the regexp /^[a-zA-Z0-9]{3}/!");

    let res = 0;
    for (let i = 2; i >= 0; --i) {
        res *= base;
        res += digits.indexOf( base62Sequence.charAt(i) );
    }
    return res;
}


//  Test Ran during First Module Import
for (let i = 0; i < 10000; ++i) {
    const enc = encode(i);
    const dec = decode(enc);
    if (i !== dec) throw `Error! Encoded value mismatch original: ${i} and ${dec}`;
}




module.exports = { encode, decode };
