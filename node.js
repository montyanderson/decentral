const fs = require("fs");
const http = require("http");
const dgram = require("dgram");
const socketio = require("socket.io");
const PeerList = require("./lib/PeerList");

const socket = dgram.createSocket("udp4");
const directoryAddress = process.argv[2];
const directoryPort = 6111;
const peers = new PeerList();

const directoryUpdate = () => {
	socket.send("", directoryPort, directoryAddress);
};

directoryUpdate();

setInterval(directoryUpdate, 60000 * 3);

socket.on("message", (msg, sender) => {
	if(sender.address == directoryAddress && sender.port == directoryPort) {
		// from directory
		const addressSplit = msg.toString().split(":");

		const peer = {
			address: addressSplit[0],
			port: +addressSplit[1]
		};

		console.log(`Directory sent peer ${peer.address}:${peer.port}`);

		socket.send("hi!", peer.port, peer.address);
	} else {
		// from peer
		peers.received(sender);

		console.log(`Peer ${sender.address}:${sender.port} sent ${msg}`);
	}
});

// HTTP Server and UI

const server = http.createServer((req, res) => {
	fs.readFile(__dirname + "/public/index.html", (err, data) => {
		if(err) {
			throw err;
		}

		res.end(data.toString());
	});
});

const io = socketio(server);

peers.on("peer", peer => {
	console.log("emitted");
	io.emit("peer", peer);
});

try {
	server.listen(3070);
} catch(err) {
	console.log(err);
}
