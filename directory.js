const dgram = require("dgram");
const PeerList = require("./lib/PeerList");

const server = dgram.createSocket("udp4");
const pl = new PeerList();

server.on("message", function(msg, sender) {
	console.log(msg, sender);
	pl.received(sender);
	pl.send(server, `${sender.address}:${sender.port}`, sender);

	pl.forEach(peer => {
		if(peer.address == sender.address && peer.port == sender.port) {
			return;
		}

		server.send(`${peer.address}:${peer.port}`, sender.port, sender.address);
	});
});

server.bind(6111);
