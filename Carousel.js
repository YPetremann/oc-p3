Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

class Carousel {
	constructor(element) {
		this.DOMelement = element
		// bind methods usable for events to prevent object dissociation
		for (let listener of ["jump", "prev", "next", "play", "pause"])
			this[listener] = this[listener].bind(this)
		// capture DOMelement instance in object

		this._prev = this.DOMelement.querySelector(".navigation .prev")
		this._next = this.DOMelement.querySelector(".navigation .next")
		this._play = this.DOMelement.querySelector(".navigation .play")
		this._pause = this.DOMelement.querySelector(".navigation .pause")

		// attach event to DOMelements
		for (let pager of this.pagers) pager.addEventListener("click", this.jump)
		this._prev.addEventListener("click", this.prev)
		this._next.addEventListener("click", this.next)
		this._play.addEventListener("click", this.play)
		this._pause.addEventListener("click", this.pause)

		// Start carousel
		this.refresh()
		this.play()
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
		return this.slides.indexOf(
			this.DOMelement.querySelector(".slides .active") ||
			this.DOMelement.querySelector(".slides *")
		)
	}
	set page(index) {
		this.refresh(index)
	}
	refresh(index = null) {
		if (index === null) index = this.page
		index = index.mod(this.length)
		for (let slide of this.slides) slide.classList.remove("active")
		for (let pager of this.pagers) pager.classList.remove("active")
		this.slides[index].classList.add("active")
		this.pagers[index].classList.add("active")
		this.resettime()
	}
	jump(e) {
		this.page = this.pagers.indexOf(e.target)
	}
	prev() {
		this.page--
	}
	next() {
		this.page++
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
		this._interval = null
	}
	resettime() {
		if (this._interval) {
			clearInterval(this._interval)
			this._interval = setInterval(this.next, 5000)
		}
	}
}
