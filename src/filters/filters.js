import Vue from 'vue'

Vue.filter('capitalize', function (value) {
	if (!value) return ''
	value = value.toString()
	let arr = value.split(" ")
	let capitalized_array = []
	arr.forEach((word) => {
		let capitalized = word.charAt(0).toUpperCase() + word.slice(1)
		capitalized_array.push(capitalized)
	})
	return capitalized_array.join(" ");
})

Vue.filter('truncate', function (value, limit) {
	if (value.length > limit)
		return value.substring(0, limit - 3) + " ..."
	return value
})
Vue.filter('tailing', function (value, tail) {
	return value + tail;
})
Vue.filter('leftTime', function (value) {
	let string = value.split(" ")
	return string[1] + " " + string[2]
})


Vue.filter('shotTimeText', function (value) {
	value = value.toLowerCase()
	if (value.indexOf('minute') > -1)
		return value.toLowerCase().replace('minute', 'Min')
	else if (value.indexOf('hour') > -1)
		return value.toLowerCase().replace('hour', 'Hr')
	else if (value.indexOf('day') > -1)
		return value.toLowerCase().replace('day', 'Day')


})

Vue.filter('time', function (value, is24HrFormat = false) {
	if (value) {
		const date = new Date(Date.parse(value));
		let hours = date.getHours();
		const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
		if (!is24HrFormat) {
			const time = hours > 12 ? 'AM' : 'PM';
			hours = hours % 12 || 12;
			return hours + ':' + min + ' ' + time
		}
		return hours + ':' + min
	}
})


Vue.filter('date', function (value, fullDate = false) {
	value = String(value)
	const date = value.slice(8, 10).trim();
	const month = value.slice(4, 7).trim();
	const year = value.slice(11, 15);

	if (!fullDate) return date + ' ' + month;
	else return date + ' ' + month + ' ' + year;
})

Vue.filter('month', function (val, showYear = true) {
	val = String(val)

	const regx = /\w+\s(\w+)\s\d+\s(\d+)./;
	if (!showYear) {
		return regx.exec(val)[1];
	} else {
		return regx.exec(val)[1] + ' ' + regx.exec(val)[2];
	}

})

Vue.filter('csv', function (value) {
	return value.join(', ')
})

Vue.filter('filter_tags', function (value) {
	return value.replace(/<\/?[^>]+(>|$)/g, "")
})

Vue.filter('k_formatter', function (num) {
	return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
})

Vue.filter('shortText', function (txt, val) {
	if (txt && val < txt.length && val > 0)
		return txt.slice(0, val) + " ..."
	else
		return txt

})

Vue.filter('actionFilter', function (action) {
	if (('content' in action) !== false)
		return "Notification"
	else
		return "None"

})
Vue.filter('scoreFilter', function (score) {
	if (score.length > 0)
		return "Set"
	else
		return "None"

})