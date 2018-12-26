/*
 * Bibliotheque de création rapide d'élément en utilisant une syntaxe proche des selecteurs CSS
 */

function isArray(value) {
	return value && typeof value === 'object' && value.constructor === Array;
}

function isObject(value) {
	return value && typeof value === 'object' && value.constructor === Object;
}

function isString(value) {
	return value && (typeof elmt === 'string' || elmt instanceof String)
}

function flatten(arr) {
	return arr.reduce(function(flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	}, []);
}

function findAttr(sel) {
	let attr
	let attrs = sel.substring(1, sel.length - 1)
	let ret = {}
	let re = /(\w+)(="([^"]*)")?/g
	do {
		attr = re.exec(attrs)
		if (attr) ret[attr[1]] = attr[3] ? attr[3] : ""
	} while (attr)
	return ret
}

function _(selector, ...args) {
	let static = {
		tag: "div",
		id: null,
		class: [],
		attrs: {},
		elmts: []
	}
	let dynamic = {}

	// search for arguments type
	for (arg of args) {
		if (isObject(arg)) dynamic = arg
		else static.elmts.push(arg)
	}

	// search for pattern in selector
	let selectors = selector.match(/([\w-]+|#[\w-]+|\.[\w-]+|\[[^\]]*\])/g)
	for (sel of selectors) {
		switch (sel.charAt(0)) {
			case "#":
				static.id = sel.substring(1);
				break;
			case ".":
				static.class.push(sel.substring(1))
				break;
			case "[":
				Object.assign(static.attrs, findAttr(sel))
				break;
			default:
				static.tag = sel
		}
	}

	// process
	if (dynamic.elmts) {
		dynamic.elmts = flatten(dynamic.elmts)
		if (!Array.isArray(dynamic.elmts)) dynamic.elmts = [dynamic.elmts]
	}

	// merging
	if (dynamic.tag) static.tag = dynamic.tag
	if (dynamic.id) static.id = dynamic.id

	// create & populate DOM element
	var element = document.createElement(static.tag)
	if (static.id) element.id = static.id
	for (cl of static.class) element.classList.add(cl)
	for (attr in static.attrs) element.setAttribute(attr, static.attrs[attr])
	if (dynamic.class)
		for (cl of dynamic.class) element.classList.add(cl)
	if (dynamic.attrs)
		for (attr in dynamic.attrs) element.setAttribute(attr, dynamic.attrs[attr])
	for (elmt of static.elmts) element.appendChild(isString(elmt) ? document.createTextNode(elmt) : elmt)
	if (dynamic.elmts)
		for (elmt of dynamic.elmts) element.appendChild(isString(elmt) ? document.createTextNode(elmt) : elmt)
	if (dynamic.events)
		for (event in dynamic.events) element.addEventListener(event, dynamic.events[event])

	if (dynamic.obj && dynamic.name) dynamic.obj[dynamic.name] = element
	element.dispatchEvent(new MouseEvent('create', {
		target: element
	}))
	return element
}
