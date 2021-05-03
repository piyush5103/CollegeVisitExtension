document.addEventListener('DOMContentLoaded', loaded, false);

function loaded() {
	document.getElementById('refresh').addEventListener('click', onclick, false);
	onclick()
	function onclick() {
		chrome.tabs.query({ currentWindow: true, active: true },
			function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, 'do it', receiveDate)
			})
	}
	function receiveDate(response) {
		if (!response.success) {
			const invalidSpan = document.createElement('h3')
			invalidSpan.textContent = 'No working here. Try again somewhere else.'
			const erdet = document.createElement('h3')
			erdet.textContent = `noForm: ${response.noForm}, otherError: ${response.otherError}, nonEduDomain: ${response.nonEduDomain}`
			document.body.appendChild(invalidSpan)
			document.body.appendChild(erdet)
		} else {

			const date = document.createElement('h3')
			date.textContent = `date: ${response.startDate}\n${response.endDate}`
			document.body.appendChild(date)

			const university = document.createElement('h3')
			university.textContent = `university: ${response.university}`
			document.body.appendChild(university)

			const timezone = document.createElement('h3')
			timezone.textContent = `timezone: ${response.timezone}`
			document.body.appendChild(timezone)

			const googleURL = new URL('https://calendar.google.com/calendar/render')
			googleURL.searchParams.append("action", "TEMPLATE")
			googleURL.searchParams.append("text", `[${response.university}] ${response.title}`)
			googleURL.searchParams.append('dates', `${response.startDate}/${response.endDate}`)
			googleURL.searchParams.append('ctz', `${response.timezone}`)

			const title = document.createElement('h3')
			title.textContent = `title: ${response.title}, \n ${googleURL}`
			document.body.appendChild(title)

			document.getElementById('schedule').setAttribute('href', googleURL)
			document.getElementById('schedule').setAttribute('target', '_blank')



		}

	}

}



//2021-05-13T16:00:00

//YYYYMMDDTHHmmSSZ/YYYYMMDDTHHmmSSZ