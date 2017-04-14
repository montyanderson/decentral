const EventEmitter = require("events");

class PeerList extends EventEmitter {
	constructor() {
		super();
		this.peers = {};
	}

	forEach(fn) {
		for(let key in this.peers) {
			const peer = this.peers[key];

			if(peer != undefined) {
				if(peer && peer.lastRecieved + 600000 < Date.now()) {
					this.peers[key] = undefined;
				} else {
					fn(this.peers[key]);
				}
			}
		}
	}

	received(peer) {
		const { address, family, port } = peer;
		const key = `${address}:${port}`;

		console.log(`new peer ${address}:${port}`);
		if(!this.peers[key]) {
			this.peers[key] = { address, port, family };
		}

		this.peers[key].lastRecieved = Date.now();

		this.emit("peer", this.peers[key]);
	}

	send(socket, msg, exclude) {
		this.forEach(peer => {
			if(exclude && peer.address == exclude.address && peer.port == exclude.port) {
				return;
			}

			socket.send(msg, peer.port, peer.address);
		});
	}
}

module.exports = PeerList;
