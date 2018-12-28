class SignCanvas {
	constructor(element) {
		for (let listener of ["signMove", "signStart", "signEnd"])
			this[listener] = this[listener].bind(this)

		this.mouseDown = false
		this.DOMelement = element
		this.DOMelement.addEventListener("mousemove", this.signMove);
		this.ctx = this.DOMelement.getContext("2d");
		this.ctx.beginPath();
		document.addEventListener("mousedown", this.signStart);
		document.addEventListener("mouseup", this.signEnd);
	}
	signMove(e) {
		if (this.mouseDown) {
			var loc = this.getLocation(e);
			this.ctx.lineTo(loc.x, loc.y);
			this.ctx.stroke();
		}
	}
	getLocation(e) {
		let canvas = this.DOMelement
		var bbox = canvas.getBoundingClientRect();
		return {
			x: e.clientX - bbox.left * (canvas.width / bbox.width),
			y: e.clientY - bbox.top * (canvas.height / bbox.height)
		};
	}
	signStart() {
		this.ctx.beginPath();
		this.mouseDown = true;
	}
	signEnd() {
		this.mouseDown = false;
	}
}
