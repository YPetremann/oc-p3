var apiKey = "2ac5382f413686e3d4abf62a926b20ff88b74dd5"
var baseUrl = "https://api.jcdecaux.com/vls/v1"

var contract = {
	name: "Lyon"
}
//var contract = {name:"Paris"}

async function highlightStation(e) {
	var station = JSON.parse(await ajaxGET(baseUrl + "/stations/"+e.target.number+"?contract=" + contract.name + "&apiKey=" + apiKey))
	var details = document.getElementById("details")
	details.classList.toggle("open")
	document.getElementById("dname").textContent    = station.name
	document.getElementById("daddress").textContent = station.address
	document.getElementById("dsize").textContent    = station.available_bikes
	document.getElementById("dcurrent").textContent = station.bike_stands
	document.getElementById("dnumber").value        = station.number
}

async function main() {
	/*
	document.body.appendChild(
		_('header',
			_('a[href="#carousel"]', 'Présentation'),
			_('a[href="#map"]', 'Carte'),
			_('a[href="#booking"]', 'Réservations')
		)
	)
	*/
	var pager = _('.pager')
	document.body.appendChild(pager)
	// get information about current contract
	contract.name = (new URL(window.location.href)).searchParams.get("city") || "Lyon"
	var contracts = JSON.parse(await ajaxGET(baseUrl + "/contracts?&apiKey=" + apiKey))

	for (tmpContract of contracts) {
		if (tmpContract.name == contract.name) {
			contract = tmpContract
			break;
		}
	}

	try {
		var stations = JSON.parse(await ajaxGET(baseUrl + "/stations?contract=" + contract.name + "&apiKey=" + apiKey))

		pager.appendChild(
			_('section#carousel.page',
				_('header', _('h2', 'Présentation')),
				_('.carousel',
					_('.slides',
						_('#slide1.slide',
							_('h3', `${contract.commercial_name}`),
							_('p', `Bienvenu sur le site de réservation de vélo pour ${contract.name}`)
						),
						_('#slide2.slide',
							_('h3', 'Trouvez votre vélo'),
							_('p', 'Aidez-vous de la carte afin de trouver la station de vélos la plus proche, cliquez sur le marqueur pour voir les details')
						),
						_('#slide3.slide',
							_('h3', 'Réservez le !'),
							_('p', 'Mettez les details de la reservations dans le formulaire et signez !')
						),
						_('#slide4.slide',
							_('h3', 'Vérifiez votre réservation'),
							_('p', 'Votre reservation est effectué, vous pouvez à tout moment voir le détail de vos reservations, (une seule reservation est acceptée pour le moment)')
						)
					),
					_('ul.navigation',
						_('li.prev.fas.fa-chevron-left'),
						_('li[data-jump="#slide1"].far.fa-circle'),
						_('li[data-jump="#slide2"].far.fa-circle'),
						_('li[data-jump="#slide3"].far.fa-circle'),
						_('li[data-jump="#slide4"].far.fa-circle'),
						_('li.next.fas.fa-chevron-right')
					)
				)
			)
		)
		var map = _('#mapid')
		pager.appendChild(
			_('section#map.page',
				_('header', _('h2', 'Carte')),
				map,
			)
		)
		pager.appendChild(
			_('section#details.page',
				_('header', _('h2.hidden', 'Details')),
				_('p#dname', '...'),
				_('p', 'Adresse : ',_("span #daddress","...")),
				_('p',_("span#dsize","...")," places"),
				_('p',_("span#dcurrent","...")," vélos disponibles"),
				_('form',
					_('input[name="id" id="dnumber" type="hidden"]'),
					_("p",_('label[for="name"]','Nom :'),_('input[name="name" id="name" type="text"]')),
					_("p",_('label[for="surname"]','Prénom :'),_('input[name="surname" id="surname" type="text"]')),
					_('input[name="sign" type="hidden"]'),
					_('input[value="Réserver" type="submit"]')
				)
			)
		)
		var icon_100 = L.icon({
			iconUrl: 'velo-100.png',
			iconSize: [25, 41],
			iconAnchor: [13, 41],
			popupAnchor: [0, -28],
			shadowUrl: 'velo-shadow.png',
			shadowSize: [41, 41],
			shadowAnchor: [13, 41]
		});
		var icon_75 = L.icon({
			iconUrl: 'velo-75.png',
			iconSize: [25, 41],
			iconAnchor: [13, 41],
			popupAnchor: [0, -28],
			shadowUrl: 'velo-shadow.png',
			shadowSize: [41, 41],
			shadowAnchor: [13, 41]
		});
		var icon_50 = L.icon({
			iconUrl: 'velo-50.png',
			iconSize: [25, 41],
			iconAnchor: [13, 41],
			popupAnchor: [0, -28],
			shadowUrl: 'velo-shadow.png',
			shadowSize: [41, 41],
			shadowAnchor: [13, 41]
		});
		var icon_25 = L.icon({
			iconUrl: 'velo-25.png',
			iconSize: [25, 41],
			iconAnchor: [13, 41],
			popupAnchor: [0, -28],
			shadowUrl: 'velo-shadow.png',
			shadowSize: [41, 41],
			shadowAnchor: [13, 41]
		});
		var icon_0 = L.icon({
			iconUrl: 'velo-0.png',
			iconSize: [25, 41],
			iconAnchor: [13, 41],
			popupAnchor: [0, -28],
			shadowUrl: 'velo-shadow.png',
			shadowSize: [41, 41],
			shadowAnchor: [13, 41]
		});

		var mymap = L.map(map, {
			maxBoundsViscosity: 0.5,
			bounceAtZoomLimits: false,
			zoomSnap: 0,
			scrollWheelZoom: false
		});

		coords = [
			[Infinity, Infinity],
			[-Infinity, -Infinity]
		]
		for (i in stations) {
			let station = stations[i]
			coords[0][0] = Math.min(coords[0][0], station.position.lat)
			coords[0][1] = Math.min(coords[0][1], station.position.lng)
			coords[1][0] = Math.max(coords[1][0], station.position.lat)
			coords[1][1] = Math.max(coords[1][1], station.position.lng)

			let marker = L.marker([station.position.lat, station.position.lng])
			p = station.available_bikes
			marker.options.icon = p < 2 ? icon_0 : p < 4 ? icon_25 : p < 6 ? icon_50 : p < 8 ? icon_75 : icon_100
			marker.options.riseOnHover = true
			marker.number = station.number
			marker.on({
				click: highlightStation
			})
			marker.addTo(mymap)
		}

		coords[0][0] = coords[0][0] - (coords[1][0] - coords[0][0]) * 0.1
		coords[0][1] = coords[0][1] - (coords[1][1] - coords[0][1]) * 0.1
		coords[1][0] = coords[1][0] + (coords[1][0] - coords[0][0]) * 0.1
		coords[1][1] = coords[1][1] + (coords[1][1] - coords[0][1]) * 0.1

		mymap.options.minZoom = mymap.getBoundsZoom(coords, false) - 0.5
		mymap.setMaxBounds(coords)
		mymap.fitBounds(coords)
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

		pager.appendChild(
			_('section#booking.page',
				_('header', _('h2.hidden', 'Reservations'))
			)
		)
	} catch (e) {
		pager.appendChild(
			_('section#carousel.page',
				_('header', _('h2', 'Présentation')),
				_('.carousel',
					_('.slides',
						_('#slide1.slide',
							_('h3', `Erreur`),
							_('p', `${e}`)
						)
					),
					_('ul.navigation',
						_('li.prev.fas.fa-chevron-left'),
						_('li[data-jump="#slide1"].far.fa-circle'),
						_('li.next.fas.fa-chevron-right')
					)
				)
			)
		)
	}
	/*

	var form = _("form", [
		_("p", []),
		_("p", [
			_('label[for="nom"]', "Votre nom"),
			_('input[type="text" name="nom" id="nom" required]'),
		]),
		_("input", {
			type: "submit",
			value: "Votez"
		}),
	])
	form.addEventListener("submit", async function(e) {
		e.preventDefault()
		var data = new FormData(form)

		console.log("Commande envoyée au serveur")
	})
	document.body.appendChild(form)
	*/
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
