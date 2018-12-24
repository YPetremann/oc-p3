function isArray(value) {
	return value && typeof value === 'object' && value.constructor === Array;
}

function isObject(value) {
	return value && typeof value === 'object' && value.constructor === Object;
}
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}
function _(selector, ...args) {
	let tag = "div"
	let id = null
	let cls = []
	let attrs = ""
	let dynattrs = {}
	let elmts = []

	// search for arguments type
	for (arg of args) {
		if (isObject(arg)) dynattrs = arg
		else elmts.push(arg)
	}
	elmts = flatten(elmts)
	// search for pattern
	let sels = selector.match(/([\w-]+|#[\w-]+|\.[\w-]+|\[[^\]]*\])/g)
	for (sel of sels) {
		switch (sel.charAt(0)) {
			case "#":
				id = sel.substring(1);
				break;
			case ".":
				cls.push(sel.substring(1))
				break;
			case "[":
				attrs += sel.substring(1, sel.length - 1) + " ";
				break;
			default:
				tag = sel
		}
	}
	// define element by tag
	var el = document.createElement(tag)
	// add id
	if (id) {
		el.id = id
	}
	// add classes
	for (cl of cls) {
		el.classList.add(cl)
	}
	// add attributes
	re = /(\w+)(="([^"]*)")?/g
	do {
		_attr = re.exec(attrs)
		if (_attr) {
			key = _attr[1]
			value = _attr[3]
			if (!value) {
				value = ""
			}
			el.setAttribute(key, value)
		}
	} while (_attr);
	for (key in dynattrs) {
		el.setAttribute(key, dynattrs[key])
	}
	// if sub element is not array, make it array
	if (!Array.isArray(elmts)) {
		elmts = [elmts]
	}
	// integrate sub elements
	for (i = 0; i < elmts.length; i++) {
		elmt = elmts[i]
		if (typeof elmt === 'string' || elmt instanceof String) {
			elmt = document.createTextNode(elmt)
		}
		el.appendChild(elmt)
	}
	return el
}
