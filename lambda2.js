exports.handler = function (event, context) {
    // TODO implement
var https = require('https');
var queryString = require('querystring');

    //calling twilio with response from mapquest   
 console.log('Loading twilio event');
// Twilio Credentials 
var accountSid = '';
var authToken = '';
var fromNumber = '+';

    console.log('Running event');

    // The SMS message to send
    var message = {
        To: '+', 
        From: '+',
        Body: 'testingat2am'
    };

    var messageString = queryString.stringify(message);

    // Options and headers for the HTTP request   
    var options = {
        host: 'api.twilio.com',
        port: 443,
        path: '/2010-04-01/Accounts//Messages.json/',
        method: 'POST',
        headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(messageString),
                    'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64')
                 }
    };

console.log(options);
    var responsebodyfromtwilio;


    // Setup the HTTP request
    var req = https.request(options, function (res) {

        res.setEncoding('utf-8');
        responsebodyfromtwilio=res.body;
        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });

        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
            //completedCallback('API request sent successfully.');
        });
        console.log(responsebodyfromtwilio);
    });

    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
        //completedCallback('API request completed with error(s).');
    });

    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('Twilio API call made');
    req.write('test');
    req.end();

  //context.succeed(output);
    //callback(null, 'Hello from Lambda');
};
