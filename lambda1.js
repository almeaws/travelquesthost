

// Lambda function:
exports.handler = function (event, context) {
console.log('Loading function');

    var body = event.body;
    console.log(body);
    var output = '<?xml version="1.0" encoding="UTF-8"?><Response><Pause length="2"/><Say>Hello Amazon, this is Twilio powered by Lambda</Say></Response>';

//calling mapquest with payload from event.body
console.log('Loading mapquest event');

var https = require('https');
var queryString = require('querystring');
    console.log('Running event');
    
    // Options and headers for the HTTP request   
    var options1 = {
        hostname: 'mapquestapi.com',
        port: 443,
        path: '/directions/v2/route?key=UShjaMayAC4UkuBJ5nu5rqFuraxzEOQU&from=grand%20central%20station%2C%20new%20york%2C%20ny&to=W%2049th%20St%20%2526%205th%20Ave%2C%20New%20York%2C%20NY%2010020',
        method: 'GET'
    };
    
    var responsebodyfrommapquest;
    
    // Setup the HTTP request
    var req1 = https.request('https://www.mapquestapi.com/directions/v2/route?key=UShjaMayAC4UkuBJ5nu5rqFuraxzEOQU&from=grand%20central%20station%2C%20new%20york%2C%20ny&to=W%2049th%20St%20%2526%205th%20Ave%2C%20New%20York%2C%20NY%2010020', function (res1) {
        console.log('getting into the request 1');
        responsebodyfrommapquest=res1.body;
        res1.setEncoding('utf-8');
        console.log('getting into the request');
        // Collect response data as it comes back.
        var responseString1 = '';
        res1.on('data', function (data) {
            responseString1 += data;
        });
        
        // Log the response received from mapquest.
        res1.on('end', function () {
            console.log('Mapquest Response: ' + responseString1);
            //completedCallback('API request sent successfully.');
        });
        console.log(responsebodyfrommapquest);
    });
    
    // Handler for HTTP request errors.
    req1.on('error', function (e1) {
        console.error('HTTP error: ' + e1.message);
        //completedCallback('API request completed with error(s).');
    });
    
    // Send the HTTP request to the Mapquest API.
    // Log the message we are sending to Mapquest.
    console.log('Mapquest API call: ');
    //req1.write('test');
    req1.end();

var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-west-2' //change to your region
});

lambda.invoke({
  FunctionName: 'smstwilio',
  Payload: JSON.stringify(responsebodyfrommapquest, null, 2) // pass params
}, function(error, data) {
  if (error) {
    context.done('error', error);
  }
  if(data.Payload){
   context.succeed(data.Payload)
  }
});


};

// Twilio sends requests with content type application/x-www-form-urlencoded
// To enable API gateway to parse them you need to go to Integration Request
// Under Integration Request go to Mapping Templates and set content type to
// application/x-www-form-urlencoded and select Mapping Template of type Empty
// Save your mapping template
// Screenshot of complete config: http://cl.ly/image/450F321o1X2O

// By default lambda will try to render the response as JSON which will break TwiML
// To override you need to go to Integration Response then Mapping Templates
// Create a new Mapping Template with the following code
// #set($inputRoot = $input.path('$'))
// $inputRoot
// Save this new mapping
// Screenshot of complete config: http://cl.ly/image/363O3p1V2s3t

// Lastly you need to make sure the respnse is returned in XML instead of JSON
// To configure this go to Method Response, expand the 200 tab and add a new
// Response Models for 200 entry. Set content type to application/xml and save
// Screenshot of complete config: http://cl.ly/image/1v1E3u2d3i1m