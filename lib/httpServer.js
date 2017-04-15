const fs = require("fs");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer((req, res) => {
	fs.readFile(__dirname + "/../public/index.html", (err, data) => {
		if(err) {
			throw err;
		}

		res.end(data.toString());
	});
});

const io = socketio(server);

if(process.argv[3]) {
	server.listen(+process.argv[3]);
}

module.exports = {
	server, io
};
