Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

class Carousel {
	constructor(element) {
		// bind methods usable for events
		this.jump = this.jump.bind(this)
		this.prev = this.prev.bind(this)
		this.next = this.next.bind(this)
		this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
		//this._ = this._.bind(this)

		this.DOMelement = element
		this._prev = this.DOMelement.querySelector(".navigation .prev")
		this._next = this.DOMelement.querySelector(".navigation .next")
		this._play = this.DOMelement.querySelector(".navigation .play")
		this._pause = this.DOMelement.querySelector(".navigation .pause")

		for (let pager of this.pagers) pager.addEventListener("click", this.jump)

		this._prev.addEventListener("click", this.prev)
		this._next.addEventListener("click", this.next)
		this._play.addEventListener("click", this.play)
		this._pause.addEventListener("click", this.pause)

		this.play()
		this.page = this.page
	}
	get slides() {
		return Array.from(this.DOMelement.querySelectorAll(".slides>*").values())
	}
	get pagers() {
		return Array.from(this.DOMelement.querySelectorAll(".navigation>.pager").values())
	}
	get length() {
		return this.slides.length
	}
	get page() {
		let current = this.DOMelement.querySelector(".slides .active") ||
			this.DOMelement.querySelector(".slides *")
		let _page = this.slides.indexOf(current)
		return _page
	}
	set page(index) {
		index = index.mod(this.length)
		this._page = index

		// set active page
		for (let slide of this.slides) slide.classList.remove("active")
		for (let pager of this.pagers) pager.classList.remove("active")
		this.slides[index].classList.add("active")
		this.pagers[index].classList.add("active")
	}
	next() {
		this.page++
	}

	prev() {
		this.page--
	}
	play() {
		this._play.classList.add("hidden")
		this._pause.classList.remove("hidden")
		this._interval = setInterval(this.next, 5000)
	}
	pause() {
		this._pause.classList.add("hidden")
		this._play.classList.remove("hidden")
		clearInterval(this._interval)
	}
	resettime() {
		clearInterval(this._interval)
		this._interval = setInterval(this.next, 5000)
	}
	jump(e) {
		this.page = this.pagers.indexOf(e.target)
		this.resettime()
	}

}
