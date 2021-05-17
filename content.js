
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (document.domain.endsWith('edu') || domainExclusions.includes(document.domain)) {
		if (document.forms.isEmpty) {
			sendResponse({
				success: false,
				noForm: true,
				otherError: false,
				nonEduDomain: false
			})
		}

		const forms = Array.from(document.forms)
		let form
		forms.forEach(function (i) {
			if (i.enctype == 'multipart/form-data') {
				form = i
			}
		})
		if (form != null || form != undefined) {
			let form_date = document.getElementById("form_date").cloneNode(true).value
			form_date = form_date.replaceAll('-', '')
			form_date = form_date.replaceAll(':', '')


			let endDate = new Date(document.getElementById("form_date").value)
			if (document.getElementById('register_date').innerText.includes("until")) {
				let tempRegisterDate = document.getElementById('register_date').cloneNode(true)
				tempRegisterDate.removeChild(tempRegisterDate.firstElementChild)
				tempRegisterDate.removeChild(tempRegisterDate.lastElementChild)
				let endTime = tempRegisterDate.innerText.split(' until ')[1]
				endTime = endTime.split(' ')
				dayNight = endTime[1]
				endTime = endTime[0]
				endTime = endTime.split(':')
				if (dayNight.toLowerCase() == 'am' || (dayNight.toLowerCase() == 'pm' && endTime[0] == '12')) {
					endDate.setHours(parseInt(endTime[0]))
				} else if (dayNight.toLowerCase() == 'pm') {
					endDate.setHours(parseInt(endTime[0]) + 12)
				} else {
					sendResponse({
						success: false,
						otherError: true,
						noForm: false,
						nonEduDomain: false
					})
				}
				endDate.setMinutes(parseInt(endTime[1]))
			} else {
				endDate.setTime(parseInt(endDate.getTime()) + 3600000)
			}
			endDate = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1, 2)}${pad(endDate.getDate(), 2)}T${endDate.getHours()}${pad(endDate.getMinutes(), 2)}${pad(endDate.getSeconds(), 2)}`

			const timezone = timezones[document.getElementById('register_date').getElementsByTagName('span')[0].innerText]
			let university = document.domain.split('.')[document.domain.split('.').length - 2]
			try {
				university = uniDomains[document.domain.split('.')[document.domain.split('.').length - 2]]
				if (university == undefined) {
					throw new Error
				}
			} catch (err) {
				university = document.domain.split('.')[document.domain.split('.').length - 2].toUpperCase()
			}
			let title = "Untitled Event"
			try {
				title = form.getElementsByTagName('h1')[0].innerText
			} catch (err) {
				try {
					title = document.getElementById('slateEventTitle').innerText
				} catch (err) {
					try {
						title = document.title.split(' | ')[0]
					} catch (err) {
						title = `${university} Event`
					}

				}
			}



			sendResponse({
				success: true,
				noForm: false,
				otherError: false,
				nonEduDomain: false,
				startDate: form_date,
				endDate: endDate,
				timezone: timezone,
				title: title,
				university: university
			})
		} else {
			sendResponse({
				success: false,
				otherError: true,
				noForm: false,
				nonEduDomain: false
			})
		}
	} else {
		sendResponse({
			success: false,
			nonEduDomain: true,
			otherError: false,
			noForm: false
		})
	}

})

const domainExclusions = [
	"mitadmissions.org",
	"apply.mitadmissions.org",
	"utoronto.ca",
	"apply.adm.utoronto.ca",
	"adm.utoronto.ca",
	"mcmaster.ca"
]

const uniDomains = {
	"stanford": "Stanford",
	"harvard": "Harvard",
	"uchicago": "UChicago",
	"umich": "UMichigan",
	"brown": "Brown",
	"princeton": "Princeton",
	"columbia": "Columbia",
	"mit": "MIT",
	"mitadmissions": "MIT",
	"yale": "Yale",
	"upenn": "UPenn",
	"caltech": "Caltech",
	"jhu": "Johns Hopkins",
	"northwestern": "Northwestern",
	"duke": "Duke",
	"dartmouth": "Dartmouth",
	"ucla": "UCLA",
	"berkeley": "UC Berkeley",
	"ucsd": "UC San Diego",
	"cornell": "Cornell",
	"utoronto": "UofT",
	"tulane": "Tulane",
	"drexel": "Drexel",
	"drake": "Drake",
	"case": "CWRU",
	"buffalo": "SUNY Buffalo",
	"ucdavis": "UC Davis",
	"stonybrook": "Stony Brook",
	"uci": "UC Irvine",
	"ucr": "UC Riverside",
	"washington": "UWash",
	"ucmerced": "UC Merced",
	"ucsb": "UC Santa Barbara",
	"purdue": "Purdue",
	"utexas": "UT Austin",
	"uta": "UT Arlington",
	"utdallas": "UT Dallas",
	"utep": "UT El Paso",
	"utrgv": "UT Rio Grande Valley",
	"utsa": "UT San Antonio",
	"uttyler": "UT Tyler",
	"utpb": "UT Permian Basin",
	"cmu": "CMU",
	"psu": "Penn State",
	"umn": "U of Minnesota",
	"umcrookston": "UMN Crookston",
	"nyu": "NYU",
	"wisc": "UW-Madison",
	"uwm": "UW–Milwaukee",
	"uwec": "UW–Eau Claire",
	"uwgb": "UW-Green Bay",
	"uwlax": "UW-La Crosse",
	"uwosh": "UW-Oshkosh",
	"uwp": "UW-Parkside",
	"uwplatt": "UW-Platteville",
	"uwrf": "UW–River Falls",
	"uwsp": "UW–Stevens Point",
	"uwstout": "UW–Stout",
	"uwsuper": "UW–Superior",
	"uww": "UW–Whitewater",
	"bu": "BostonU",
	"uillinois": "UofI",
	"illinois": "UIUC",

}

//uc merced only uses zoom
//ucsb uses salesforce software

const timezones = {
	"Central Daylight Time": "America/Chicago",
	"Central Time": "America/Chicago",
	"Pacific Daylight Time": "America/Los_Angeles",
	"Pacific Time": "America/Los_Angeles",
	"Eastern Daylight Time": "America/New_York",
	"Eastern Time": "America/New_York",
	"Indian Standard Time": "Asia/Kolkata",
	"Hawaiian Standard Time": "US/Hawaii",
	"Alaska Standard Time": "US/Alaska",
	"Pacific Standard Time": "US/Pacific",
	"Mountain Standard Time": "US/Mountain",
	"Central Standard Time": "US/Central",
	"Eastern Standard Time": "US/Eastern",
}

function pad(num, size) {
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}