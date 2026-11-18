
// SKIN DIARY - CYCLE INFORMATION

const cycleForm = document.querySelector("#cycleForm");

if (cycleForm) {

    const lastPeriod = document.querySelector("#lastPeriod");
    const cycleLength = document.querySelector("#cycleLength");
    const periodLength = document.querySelector("#periodLength");

    // Load previously saved information
    const savedCycle = JSON.parse(
        localStorage.getItem("skinDiaryCycle") || "null"
    );

    if (savedCycle) {
        lastPeriod.value = savedCycle.lastPeriod;
        cycleLength.value = savedCycle.cycleLength;
        periodLength.value = savedCycle.periodLength;
    }

    // Save cycle information
    cycleForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const cycleData = {
            lastPeriod: lastPeriod.value,
            cycleLength: Number(cycleLength.value),
            periodLength: Number(periodLength.value)
        };

        if (!cycleData.lastPeriod) {
            alert("Please enter the first day of your last period.");
            return;
        }

        const selectedDate = new Date(
            cycleData.lastPeriod + "T00:00:00"
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            alert("Please enter a date that is today or earlier.");
            return;
        }

        localStorage.setItem(
            "skinDiaryCycle",
            JSON.stringify(cycleData)
        );

        displayCycleOverview();

        alert("Your cycle information has been saved! ♡");
    });
}

// DISPLAY CYCLE OVERVIEW

function displayCycleOverview() {
    const nextPeriod = document.querySelector("#nextPeriod");
    const cycleDayDisplay = document.querySelector("#cycleDay");
    const cyclePhases = document.querySelector("#cyclePhases");

    const savedCycle = JSON.parse(
        localStorage.getItem("skinDiaryCycle") || "null"
    );

    if (!savedCycle) return;

    const startDate = new Date(
        savedCycle.lastPeriod + "T00:00:00"
    );

    const cycleLength = Number(savedCycle.cycleLength);
    const periodLength = Number(savedCycle.periodLength);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate estimated next period
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + cycleLength);

    nextPeriod.textContent =
        "Your next period is estimated around " +
        nextDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    // Calculate current cycle day
    const difference = Math.floor(
        (today - startDate) / (1000 * 60 * 60 * 24)
    );

    const currentCycleDay =
        ((difference % cycleLength) + cycleLength) % cycleLength + 1;

    cycleDayDisplay.textContent =
        "You are approximately on cycle day " + currentCycleDay + ".";

    // Estimate cycle phases
    const ovulationDay = cycleLength - 14;

    cyclePhases.innerHTML = `
        <p>🌸 Menstrual phase: Days 1–${periodLength}</p>
        <p>🌱 Follicular phase: After your period until around day ${ovulationDay - 1}</p>
        <p>🌼 Estimated ovulation: Around day ${ovulationDay}</p>
        <p>🌙 Luteal phase: Around days ${ovulationDay + 1}–${cycleLength}</p>
    `;
}

// Display saved information when the page opens
displayCycleOverview();

// MONTHLY CYCLE CALENDAR

const calendarDays = document.querySelector("#calendarDays");
const calendarMonth = document.querySelector("#calendarMonth");
const previousMonth = document.querySelector("#previousMonth");
const nextMonth = document.querySelector("#nextMonth");

let displayedDate = new Date();
let selectedCalendarDate = null;
let periodRangeStart = null;
function getSavedPeriodDates() {
    return JSON.parse(
        localStorage.getItem("skinDiaryPeriodDates") || "[]"
    );
}

function renderCalendar() {

    if (!calendarDays || !calendarMonth) return;

    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    calendarMonth.textContent = displayedDate.toLocaleDateString(
        "en-GB",
        { month: "long", year: "numeric" }
    );

    calendarDays.innerHTML = "";

    // Empty spaces before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "calendar-day empty";
        calendarDays.appendChild(emptyDay);
    }

    // Create the dates
    for (let day = 1; day <= totalDays; day++) {

        const dateButton = document.createElement("button");

        dateButton.type = "button";
        dateButton.className = "calendar-day";
        dateButton.textContent = day;

        const dateString =
            year + "-" +
            String(month + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");

        dateButton.dataset.date = dateString;

// RECORDED AND ESTIMATED PERIOD DATES

const savedCycle = JSON.parse(
    localStorage.getItem("skinDiaryCycle") || "null"
);

const recordedDates = getSavedPeriodDates();

if (recordedDates.includes(dateString)) {

    // Actual recorded period takes priority
    dateButton.classList.add("recorded-period");

} else if (savedCycle && savedCycle.lastPeriod) {

    const cycleStart = new Date(
        savedCycle.lastPeriod + "T00:00:00"
    );

    const calendarDate = new Date(
        dateString + "T00:00:00"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cycleLength = Number(savedCycle.cycleLength);
    const periodLength = Number(savedCycle.periodLength);

    const difference = Math.floor(
        (today - cycleStart) / 86400000
    );

    if (cycleLength > 0 && difference >= 0) {

        // Find the next estimated period
        const cyclesPassed = Math.floor(
            difference / cycleLength
        );

        const nextStart = new Date(cycleStart);

        nextStart.setDate(
            nextStart.getDate() +
            (cyclesPassed + 1) * cycleLength
        );

        const nextEnd = new Date(nextStart);

        nextEnd.setDate(
            nextEnd.getDate() + periodLength - 1
        );

        if (
            calendarDate >= nextStart &&
            calendarDate <= nextEnd
        ) {

            dateButton.classList.add("estimated-period");

        } else {

            const cycleDay =
                ((Math.floor(
                    (calendarDate - cycleStart) / 86400000
                ) % cycleLength) + cycleLength) % cycleLength + 1;

            const ovulationDay = Math.max(1, cycleLength - 14);

            if (cycleDay <= periodLength) {
                dateButton.classList.add("menstrual-phase");
            } else if (cycleDay < ovulationDay) {
                dateButton.classList.add("follicular-phase");
            } else if (cycleDay === ovulationDay) {
                dateButton.classList.add("ovulation-phase");
            } else {
                dateButton.classList.add("luteal-phase");
            }
        }
    }
}

        if (selectedCalendarDate === dateString) {
            dateButton.classList.add("selected");
        }
          // Highlight saved period dates
          if (getSavedPeriodDates().includes(dateString)) {
             dateButton.classList.add("period-day");
}

dateButton.addEventListener("click", function() {

    selectedCalendarDate = dateString;

    // First click: choose the start date
    if (periodRangeStart === null) {

        periodRangeStart = dateString;

        alert("Start date selected! Now select the last day of your period.");

    } else {

        // Second click: choose the end date
        let start = new Date(periodRangeStart + "T00:00:00");
        let end = new Date(dateString + "T00:00:00");

        // Make sure the dates are in the correct order
        if (end < start) {
            const temporaryDate = start;
            start = end;
            end = temporaryDate;
        }

        let periodDates = getSavedPeriodDates();

        // Add every date between the start and end
        let currentDate = new Date(start);

        while (currentDate <= end) {

            const savedDate =
                currentDate.getFullYear() + "-" +
                String(currentDate.getMonth() + 1).padStart(2, "0") + "-" +
                String(currentDate.getDate()).padStart(2, "0");

            if (!periodDates.includes(savedDate)) {
                periodDates.push(savedDate);
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        localStorage.setItem(
            "skinDiaryPeriodDates",
            JSON.stringify(periodDates)
        );
        displayPeriodRecords();

        periodRangeStart = null;

        alert("Your period dates have been saved! ♡");
    }

    renderCalendar();
});

        calendarDays.appendChild(dateButton);
    }
}

if (previousMonth && nextMonth) {
    previousMonth.addEventListener("click", function() {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener("click", function() {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
        renderCalendar();
    });
}

renderCalendar();

// DISPLAY SAVED PERIOD RECORDS

function displayPeriodRecords() {

    const recordsContainer = document.querySelector("#periodRecords");

    if (!recordsContainer) return;

    const dates = getSavedPeriodDates().sort();

    recordsContainer.innerHTML = "";

    if (dates.length === 0) {
        recordsContainer.textContent =
            "Your recorded periods will appear here.";
        return;
    }

    // Group consecutive dates into period records
    const groups = [];

    dates.forEach(function(date) {

        const currentDate = new Date(date + "T00:00:00");
        const lastGroup = groups[groups.length - 1];

        if (lastGroup) {

            const previousDate = new Date(
                lastGroup[lastGroup.length - 1] + "T00:00:00"
            );

            const difference =
                (currentDate - previousDate) / (1000 * 60 * 60 * 24);

            if (difference === 1) {
                lastGroup.push(date);
                return;
            }
        }

        groups.push([date]);
    });

    // Display each period record
    groups.forEach(function(group, index) {

        const record = document.createElement("div");
        record.className = "period-record";

        const firstDate = new Date(group[0] + "T00:00:00");
        const lastDate = new Date(
            group[group.length - 1] + "T00:00:00"
        );

        const dateText = document.createElement("p");

        dateText.textContent =
            firstDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }) +
            (group.length > 1
                ? " – " + lastDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })
                : "");

        const dayCount = document.createElement("p");
        dayCount.textContent = group.length + " recorded day(s)";

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove record";

        removeButton.addEventListener("click", function() {

            const confirmed = confirm(
                "Remove this period record?"
            );

            if (!confirmed) return;

            const updatedDates = getSavedPeriodDates().filter(
                date => !group.includes(date)
            );

            localStorage.setItem(
                "skinDiaryPeriodDates",
                JSON.stringify(updatedDates)
            );

            displayPeriodRecords();
            renderCalendar();
        });

        record.appendChild(dateText);
        record.appendChild(dayCount);
        record.appendChild(removeButton);

        recordsContainer.appendChild(record);
    });
}

displayPeriodRecords();

// DAILY MOOD, SYMPTOMS AND SKIN CHECK-IN

const checkinForm = document.querySelector("#checkinForm");

if (checkinForm) {

    checkinForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const mood = document.querySelector("#mood").value;
        const skinCondition = document.querySelector("#skinCondition").value;
        const notes = document.querySelector("#checkinNotes").value;

        const symptoms = Array.from(
            document.querySelectorAll(
                "input[name='symptoms']:checked"
            )
        ).map(function(item) {
            return item.value;
        });

        // Get today's local date
        const now = new Date();
        const today =
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");

        const checkinData = {
            date: today,
            mood: mood,
            symptoms: symptoms,
            skinCondition: skinCondition,
            notes: notes
        };

        // Load previous check-ins
        const savedCheckins = JSON.parse(
            localStorage.getItem("skinDiaryCheckins") || "{}"
        );

        // Save or update today's check-in
        savedCheckins[today] = checkinData;

        localStorage.setItem(
            "skinDiaryCheckins",
            JSON.stringify(savedCheckins)
        );
        displayCheckinHistory();

        alert("Your daily check-in has been saved! ♡");

    });

}

// DISPLAY RECENT CHECK-IN HISTORY

function displayCheckinHistory() {

    const historyContainer = document.querySelector("#checkinHistory");

    if (!historyContainer) return;

    const savedCheckins = JSON.parse(
        localStorage.getItem("skinDiaryCheckins") || "{}"
    );

    const dates = Object.keys(savedCheckins).sort().reverse();

    historyContainer.innerHTML = "";

    if (dates.length === 0) {
        historyContainer.textContent =
            "Your previous check-ins will appear here.";
        return;
    }

    dates.forEach(function(date) {

        const entry = savedCheckins[date];

        const card = document.createElement("article");
        card.className = "checkin-history-card";

        const heading = document.createElement("h3");
        heading.textContent = new Date(
            date + "T00:00:00"
        ).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const mood = document.createElement("p");
        mood.textContent = "Mood: " + (entry.mood || "Not recorded");

        const symptoms = document.createElement("p");
        symptoms.textContent =
            "Symptoms: " + (entry.symptoms.length
                ? entry.symptoms.join(", ")
                : "None recorded");

        const skin = document.createElement("p");
        skin.textContent =
            "Skin: " + (entry.skinCondition || "Not recorded");

        const notes = document.createElement("p");
        notes.textContent = "Notes: " + (entry.notes || "No notes");
// REMOVE CHECK-IN BUTTON

const removeButton = document.createElement("button");

removeButton.type = "button";
removeButton.textContent = "Remove entry";

removeButton.addEventListener("click", function() {

    const confirmed = confirm(
        "Are you sure you want to remove this check-in?"
    );

    if (!confirmed) return;

    delete savedCheckins[date];

    localStorage.setItem(
        "skinDiaryCheckins",
        JSON.stringify(savedCheckins)
    );

    displayCheckinHistory();

});

// Add everything to the card
card.append(
    heading,
    mood,
    symptoms,
    skin,
    notes,
    removeButton
);

historyContainer.appendChild(card);
    }); 
}
// Load saved history when the page opens
displayCheckinHistory();

// SKIN DIARY - MOOD AND SKIN INSIGHTS

let moodChartInstance = null;
let skinChartInstance = null;

function displaySkinInsights() {

    const moodCanvas = document.querySelector("#moodChart");
    const skinCanvas = document.querySelector("#skinChart");

    if (!moodCanvas || !skinCanvas) return;

    const savedCheckins = JSON.parse(
        localStorage.getItem("skinDiaryCheckins") || "{}"
    );

    const entries = Object.values(savedCheckins);

// UPDATE CYCLE INSIGHT SUMMARY CARDS

const savedCycle = JSON.parse(
    localStorage.getItem("skinDiaryCycle") || "null"
);

const cycleDayDisplay = document.querySelector("#insightCycleDay");
const phaseDisplay = document.querySelector("#insightPhase");
const nextPeriodDisplay = document.querySelector("#insightNextPeriod");
const checkinDisplay = document.querySelector("#insightCheckins");

// Display number of saved check-ins
if (checkinDisplay) {
    checkinDisplay.textContent = entries.length;
}

// Display cycle information
if (savedCycle && savedCycle.lastPeriod) {

    const startDate = new Date(
        savedCycle.lastPeriod + "T00:00:00"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cycleLength = Number(savedCycle.cycleLength);

    const difference = Math.floor(
        (today - startDate) / (1000 * 60 * 60 * 24)
    );

    if (difference >= 0 && cycleLength > 0) {

        const currentDay = (difference % cycleLength) + 1;

        if (cycleDayDisplay) {
            cycleDayDisplay.textContent = "Day " + currentDay;
        }

        const ovulationDay = Math.max(1, cycleLength - 14);
        let phase = "";

        if (currentDay <= Number(savedCycle.periodLength)) {
            phase = "Menstrual";
        } else if (currentDay < ovulationDay) {
            phase = "Follicular";
        } else if (currentDay === ovulationDay) {
            phase = "Ovulation";
        } else {
            phase = "Luteal";
        }

        if (phaseDisplay) {
            phaseDisplay.textContent = phase;
        }

        const nextPeriod = new Date(startDate);
        nextPeriod.setDate(
            nextPeriod.getDate() +
            (Math.floor(difference / cycleLength) + 1) * cycleLength
        );

        if (nextPeriodDisplay) {
            nextPeriodDisplay.textContent =
                nextPeriod.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short"
                });
        }
    }
}


    // Count recorded moods
    const moodCounts = {};

    entries.forEach(function(entry) {
        if (entry.mood) {
            moodCounts[entry.mood] =
                (moodCounts[entry.mood] || 0) + 1;
        }
    });

    // Count recorded skin conditions
    const skinCounts = {};

    entries.forEach(function(entry) {
        if (entry.skinCondition) {
            skinCounts[entry.skinCondition] =
                (skinCounts[entry.skinCondition] || 0) + 1;
        }
    });

    // Remove previous charts before updating
    if (moodChartInstance) {
        moodChartInstance.destroy();
    }

    if (skinChartInstance) {
        skinChartInstance.destroy();
    }

    // MOOD CHART
    moodChartInstance = new Chart(moodCanvas, {
        type: "bar",

        data: {
            labels: Object.keys(moodCounts),

            datasets: [{
                label: "Mood entries",
                data: Object.values(moodCounts),
                backgroundColor: "#B77F89",
                borderRadius: 8
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // SKIN CHART
    skinChartInstance = new Chart(skinCanvas, {
        type: "bar",

        data: {
            labels: Object.keys(skinCounts),

            datasets: [{
                label: "Skin entries",
                data: Object.values(skinCounts),
                backgroundColor: "#D9A9AD",
                borderRadius: 8
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Display charts when the page opens
displaySkinInsights();
