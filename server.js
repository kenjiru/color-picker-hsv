/**
 * Small http static server.
 */

var connect = require('connect'),
    port = process.env.PORT || 8080;

console.log("Listening on " + port);

connect.createServer(
    connect.static(__dirname)
).listen(port);