var apiKey = "2ac5382f413686e3d4abf62a926b20ff88b74dd5"
var baseUrl = "https://api.jcdecaux.com/vls/v1"

var contract = {}

var els = {}

async function highlightStation(e) {
	//fetch station data
	els.detail_name.textContent = "..."
	els.detail_address.textContent = "..."
	els.detail_size.textContent = "..."
	els.detail_current.textContent = "..."
	els.detail_number.value = "..."

	var station = JSON.parse(await ajaxGET(baseUrl + "/stations/" + e.target.number + "?contract=" + contract.name + "&apiKey=" + apiKey))

	//display station data & open pane
	els.details.classList.toggle("open")
	els.detail_name.textContent = station.name
	els.detail_address.textContent = station.address
	els.detail_size.textContent = station.bike_stands
	els.detail_current.textContent = station.available_bikes
	els.detail_city.value = contract.name
	els.detail_number.value = station.number
}

function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	return {
		x: x - bbox.left * (canvas.width / bbox.width),
		y: y - bbox.top * (canvas.height / bbox.height)
	};
}

var mouseDown = false;

function signCreate(e) {
	els.ctx = e.target.getContext("2d");
	els.ctx.beginPath();
}

function docSignMouseDown() {
	els.ctx.beginPath();
	mouseDown = true;
}

function docSignMouseUp() {
	mouseDown = false;
}

function signMouseMove(e) {
	if (mouseDown) {
		var loc = windowToCanvas(els.sign, e.clientX, e.clientY);
		els.ctx.lineTo(loc.x, loc.y);
		els.ctx.stroke();
	}
}

function clusterIcon(cluster) {
	let bike_available = 0
	let station_available = cluster.getChildCount()
	for (station of cluster.getAllChildMarkers()) {
		bike_available += station.available
	}
	let average = bike_available / station_available
	return L.divIcon({
		iconSize: [25, 25],
		className: average < 2 ? "group0" : average < 4 ? "group25" : average < 6 ? "group50" : average < 8 ? "group75" : "group100",
		html: `<b>${bike_available}</b>`
	});
	return
}

function bookSubmit(e) {
	e.preventDefault()
	let form = e.target
	localStorage.setItem("name", form.name.value)
	localStorage.setItem("surname", form.surname.value)

	sessionStorage.setItem("name", form.name.value)
	sessionStorage.setItem("surname", form.surname.value)
	sessionStorage.setItem("city", form.city.value)
	sessionStorage.setItem("number", form.number.value)
	sessionStorage.setItem("booktime", new Date())

	reloadBooking();
	els.details.classList.remove("open")
	els.bookingsPage.scrollIntoView({
		behavior: 'smooth'
	});
}

async function reloadMap(city) {
	//try {
	// get information about contracts
	contract.name = city
	var contracts = JSON.parse(await ajaxGET(baseUrl + "/contracts?&apiKey=" + apiKey))
	els.cities.innerHTML = ""
	// complete current contract from contract name
	for (tmpContract of contracts) {
		els.cities.appendChild(_(`option[value="${tmpContract.name}"]`, `${tmpContract.name} : ${tmpContract.commercial_name}`))
		if (tmpContract.name == contract.name) {
			els.cities.value = tmpContract.name
			contract = tmpContract
		}
	}

	// complete presentation from contract infos
	els.welcome_title.textContent = `${contract.commercial_name}`
	els.welcome_sentence.textContent = `Bienvenu sur le site de réservation de vélo pour ${contract.name}`

	// get station list from contract name
	var stations = JSON.parse(await ajaxGET(baseUrl + "/stations?contract=" + contract.name + "&apiKey=" + apiKey))

	// initialise map
	oldmap = els.map
	oldmap.parentNode.replaceChild(els.map = _('#mapid'), oldmap)
	var mymap = L.map(els.map, {
		maxBoundsViscosity: 0.5,
		bounceAtZoomLimits: false,
		zoomSnap: 0,
		scrollWheelZoom: false,
		maxZoom: 18
	});
	coords = [
		[Infinity, Infinity],
		[-Infinity, -Infinity]
	]

	var markerscluster = L.markerClusterGroup({
		iconCreateFunction: clusterIcon
	})
	for (station of stations) {
		coords[0][0] = Math.min(coords[0][0], station.position.lat)
		coords[0][1] = Math.min(coords[0][1], station.position.lng)
		coords[1][0] = Math.max(coords[1][0], station.position.lat)
		coords[1][1] = Math.max(coords[1][1], station.position.lng)

		let marker = L.marker([station.position.lat, station.position.lng])

		marker.available = station.available_bikes
		marker.options.icon = L.divIcon({
			iconSize: [25, 25],
			className: marker.available < 2 ? "station0" : marker.available < 4 ? "station25" : marker.available < 6 ? "station50" : marker.available < 8 ? "station75" : "station100",
			html: `<b>${marker.available}</b>`
		});
		marker.options.riseOnHover = true
		marker.number = station.number
		marker.on({
			click: highlightStation
		})
		markers.push(sel.substring(1))
		markerscluster.addLayer(marker)
		//marker.addTo(mymap)
	}

	coords[0][0] = coords[0][0] - (coords[1][0] - coords[0][0]) * 0.1
	coords[0][1] = coords[0][1] - (coords[1][1] - coords[0][1]) * 0.1
	coords[1][0] = coords[1][0] + (coords[1][0] - coords[0][0]) * 0.1
	coords[1][1] = coords[1][1] + (coords[1][1] - coords[0][1]) * 0.1

	mymap.options.minZoom = mymap.getBoundsZoom(coords, false) - 0.5
	mymap.setMaxBounds(coords)
	mymap.fitBounds(coords)
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);
	markerscluster.addTo(mymap)
	/*
	} catch (err) {
		els.welcome_title.textContent = `Erreur`
		els.welcome_sentence.textContent = `${err}`
	}
	*/
}
async function reloadBooking() {
	els.bookings.innerHTML = ''
	var station = JSON.parse(await ajaxGET(`${baseUrl}/stations/${sessionStorage.getItem("number")}?contract=${sessionStorage.getItem("city")}&apiKey=${apiKey}`))
	els.bookings.appendChild(
		_(".book",
			`Vélo réservé à la station ${station.name} par ${sessionStorage.getItem("name")} ${sessionStorage.getItem("surname")}`,
			_(".time",sessionStorage.getItem("booktime"))
		)
	)
}
var markers = []
var error = []
async function main() {
	// prepare document body
	document.body.appendChild(
		els.pager = _('.pager', {
				events: {
					mousedown: docSignMouseDown,
					mouseup: docSignMouseUp,
				}
			},
			_('section#carousel.page',
				_('header.multibar',
					_('h2.left', 'Présentation'),
					_('a.right.fas.fa-map-marked-alt[href="#map"]'),
					_('a.right.fas.fa-ticket-alt[href="#booking"]')
				),
				_('.carousel',
					_('.slides',
						_('#slide1.slide',
							els.welcome_title = _('h3', `JCDecaux`),
							els.welcome_sentence = _('p', `Bienvenu sur le site de réservation de vélo.`)
						),
						_('#slide2.slide',
							_('h3', 'Trouvez votre vélo'),
							_('p', 'Aidez-vous de la carte afin de trouver la station de vélos la plus proche, cliquez sur le marqueur pour voir les details'),
							_('a[href="#map"]', 'Voir la Carte')
						),
						_('#slide3.slide',
							_('h3', 'Réservez le !'),
							_('p', 'Mettez les details de la reservations dans le formulaire et signez !')
						),
						_('#slide4.slide',
							_('h3', 'Vérifiez votre réservation'),
							_('p', 'Votre reservation est effectué, vous pouvez à tout moment voir le détail de vos reservations, (une seule reservation est acceptée pour le moment)'),
							_('a[href="#booking"]', 'Voir vos réservations')
						)
					),
					_('ul.navigation',
						_('li.prev.fas.fa-caret-left'),
						_('li[data-jump="#slide1"].fas.fa-circle'),
						_('li[data-jump="#slide2"].fas.fa-circle'),
						_('li[data-jump="#slide3"].fas.fa-circle'),
						_('li[data-jump="#slide4"].fas.fa-circle'),
						_('li.play.fas.fa-play'),
						_('li.pause.fas.fa-pause'),
						_('li.next.fas.fa-caret-right')
					)
				)
			),
			_('section#map.page', {
					events: {
						click: function() {
							els.details.classList.remove("open")
						}
					}
				},
				_('header.multibar',
					_('h2.left', 'Carte'),
					els.cities = _('select.right', {
						events: {
							change: function() {
								reloadMap(els.cities.value)
							}
						}
					}, _('option[value]', `(Ville)`)),
					_('a.right.fas.fa-ticket-alt[href="#booking"]'),
					_('a.right.fas.fa-book[href="#carousel"]')
				),
				els.map = _('#mapid'),
			),
			els.details = _('section#details.page',
				_('header', _('h2.multibar',
					_('.left', 'Details'),
					_('a.right.fas.fa-times', {
						events: {
							click: function() {
								els.details.classList.remove("open")
							}
						}
					})
				)),
				els.detail_name = _('p', '...'),
				_('p', 'Adresse : ', els.detail_address = _("span", "...")),
				_('p', els.detail_size = _("span", "..."), " places"),
				_('p', els.detail_current = _("span", "..."), " vélos disponibles"),
				els.detail_form = _('form', {
						events: {
							submit: bookSubmit
						}
					},
					els.detail_city = _('input[name="city" type="hidden"]'),
					els.detail_number = _('input[name="number" type="hidden"]'),
					_("p", _('label[for="name"]', 'Nom :'), els.name = _('input#name[name="name" type="text"]')),
					_("p", _('label[for="surname"]', 'Prénom :'), els.surname = _('input#surname[name="surname" type="text"]')),
					_('input[name="sign" type="hidden"]'),
					_("p", _('label[for="sign"]', 'Signature :'), els.sign = _('canvas#sign', {
						events: {
							create: signCreate,
							mousemove: signMouseMove
						}
					})),
					_('input[value="Réserver" type="submit"]')
				)
			),
			els.bookingsPage = _('section#booking.page',
				_('header.multibar',
					_('h2.hidden', 'Reservations'),
					_('a.right.fas.fa-book[href="#carousel"]'),
					_('a.right.fas.fa-map-marked-alt[href="#map"]')
				),
				els.bookings = _('div')
			)
		)
	)
	if (localStorage.getItem("name")) els.name.value = localStorage.getItem("name");
	if (localStorage.getItem("surname")) els.surname.value = localStorage.getItem("surname");
	await reloadBooking()
	await reloadMap("Lyon")

	var anchoreds = document.querySelectorAll("a[href*='#']:not([href='#'])");
	for (anchored of anchoreds) {
		anchored.addEventListener("click", function(e) {
			e.preventDefault()
			if (
				location.hostname == this.hostname &&
				this.pathname.replace(/^\//, "") == location.pathname.replace(/^\//, "")
			) {
				var anchor = document.getElementById(this.hash.slice(1));
				anchor.scrollIntoView({
					behavior: 'smooth'
				});
			}
		})
	}
}
window.addEventListener("load", main);
