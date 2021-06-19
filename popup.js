document.addEventListener("DOMContentLoaded", loaded, false);

function loaded() {
	document.getElementById("refresh").addEventListener("click", onclick, false);
	onclick();
	function onclick() {
		document.getElementById("button-bar").style.display = "none";
		document.getElementById("detail-bar").style.display = "none";
		console.log("click success"); //flag
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, "do it", receiveDate);
		});
	}
	function receiveDate(response) {
		if (!response.success) {
			try {
				document.body.removeChild(document.getElementById("event-details"));
			} catch (err) {}
			const eventDetails = document.createElement("div");
			eventDetails.setAttribute("id", "event-details");
			document.body.appendChild(eventDetails);

			const invalidSpan = document.createElement("h3");
			invalidSpan.innerText = "No working here. Try again somewhere else.";
			const erdet = document.createElement("h3");
			erdet.innerText = `noForm: ${response.noForm} \notherError: ${response.otherError} \nnonEduDomain: ${response.nonEduDomain}`;
			document.getElementById("event-details").appendChild(invalidSpan);
			document.getElementById("event-details").appendChild(erdet);
			document.getElementById("schedule").setAttribute("href", "#");
			document.getElementById("schedule").setAttribute("target", "");
		} else {
			// const eventDetails = document.createElement("div");
			// eventDetails.setAttribute("id", "event-details");
			// document.body.appendChild(eventDetails);

			// const date = document.createElement("h3");
			// date.innerText = `date: ${response.startDate}\n${response.endDate}`;
			// document.getElementById("event-details").appendChild(date);

			// const university = document.createElement("h3");
			// university.innerText = `university: ${response.university}`;
			// document.getElementById("event-details").appendChild(university);

			// const timezone = document.createElement("h3");
			// timezone.innerText = `timezone: ${response.timezone}`;
			// document.getElementById("event-details").appendChild(timezone);

			document.getElementById("uni-name").innerText = `${response.university}`;
			document.getElementById("event-name").innerText = `${response.title}`;
			document.getElementById("start-time").innerText = `${response.startDate}`;
			document.getElementById("end-time").innerText = `${response.endDate}`;
			document.getElementById("timezone").innerText = `${response.timezone}`;

			const googleURL = new URL("https://calendar.google.com/calendar/render");
			googleURL.searchParams.append("action", "TEMPLATE");
			googleURL.searchParams.append("text", `[${response.university}] ${response.title}`);
			googleURL.searchParams.append("dates", `${response.startDate}/${response.endDate}`);
			googleURL.searchParams.append("ctz", `${response.timezone}`);

			// const title = document.createElement("h3");
			// title.innerText = `title: ${response.title}, \n ${googleURL}`;
			// document.getElementById("event-details").appendChild(title);

			document.getElementById("schedule").setAttribute("href", googleURL);
			document.getElementById("schedule").setAttribute("target", "_blank");
			document.getElementById("button-bar").style.display = "block";
			document.getElementById("detail-bar").style.display = "block";
		}
	}
}

//2021-05-13T16:00:00

//YYYYMMDDTHHmmSSZ/YYYYMMDDTHHmmSSZ
