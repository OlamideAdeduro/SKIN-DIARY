// My Skin Diary JavaScript

console.log("Welcome to Skin Diary!");


function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const routineCheckboxes = document.querySelectorAll(
    ".routine-step input[type='checkbox'][data-id]"
);

routineCheckboxes.forEach(function (checkbox) {
    const checkboxId = checkbox.dataset.id;

    const storageKey = "routine-" + getToday() + "-" + checkboxId;

    checkbox.checked = localStorage.getItem(storageKey) === "checked";

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            localStorage.setItem(storageKey, "checked");
        } else {
            localStorage.removeItem(storageKey);
        }
    });
});


const journalForm = document.querySelector("#journalForm");

if (journalForm) {
    const entryDate = document.querySelector("#entryDate");
    const skinFeeling = document.querySelector("#skinFeeling");
    const skinNotes = document.querySelector("#skinNotes");

    const journalEntries = JSON.parse(
        localStorage.getItem("skinDiaryEntries") || "[]"
    );

    journalForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const entry = {
            date: entryDate.value,
            feeling: skinFeeling.value,
            notes: skinNotes.value
        };

        journalEntries.push(entry);

        localStorage.setItem(
            "skinDiaryEntries",
            JSON.stringify(journalEntries)
        );

        alert("Your journal entry has been saved! ♡");

        journalForm.reset();
    });
}

const previousEntries = document.querySelector("#previousEntries");

if (previousEntries) {
    function displayJournalEntries() {
        const entries = JSON.parse(
            localStorage.getItem("skinDiaryEntries") || "[]"
        );

        previousEntries.innerHTML = "";

        if (entries.length === 0) {
            previousEntries.textContent =
                "Your reflections will appear here once you save your first entry. ♡";
            return;
        }

        entries.slice().reverse().forEach(function (entry) {
            const card = document.createElement("article");
            card.className = "journal-card p-4 mb-3";

            const date = document.createElement("h3");
            date.textContent = entry.date;

            const feeling = document.createElement("p");
            feeling.textContent = "Skin feeling: " + entry.feeling;

            const notes = document.createElement("p");
            notes.textContent = entry.notes;

            card.append(date, feeling, notes);
            previousEntries.appendChild(card);
        });
    }

    displayJournalEntries();
}

const morningProgress = document.querySelector("#morningProgress");
const eveningProgress = document.querySelector("#eveningProgress");
const journalProgress = document.querySelector("#journalProgress");

if (morningProgress && eveningProgress && journalProgress) {

    const morningIds = [
        "morning-dove",
        "morning-byoma",
        "morning-garnier",
        "morning-good-molecules",
        "morning-alpha-arbutin",
        "morning-purito",
        "morning-sunscreen"
    ];

    const eveningIds = [
        "evening-dove",
        "evening-nivea",
        "evening-byoma",
        "evening-anua",
        "evening-alpha-arbutin",
        "evening-purito"
    ];

    function countCompleted(ids) {
        return ids.filter(function (id) {
            const storageKey = "routine-" + getToday() + "-" + id;

            return localStorage.getItem(storageKey) === "checked";
        }).length;
    }

    const morningCount = countCompleted(morningIds);
    const eveningCount = countCompleted(eveningIds);

    const entries = JSON.parse(
        localStorage.getItem("skinDiaryEntries") || "[]"
    );

    morningProgress.textContent = morningCount + " of 7 steps";
    eveningProgress.textContent = eveningCount + " of 6 steps";
    journalProgress.textContent = entries.length + " entries";
}

function updateRoutineProgress() {
    const morningIds = [
        "morning-dove",
        "morning-byoma",
        "morning-garnier",
        "morning-good-molecules",
        "morning-alpha-arbutin",
        "morning-purito",
        "morning-sunscreen"
    ];

    const eveningIds = [
        "evening-dove",
        "evening-nivea",
        "evening-byoma",
        "evening-anua",
        "evening-alpha-arbutin",
        "evening-purito"
    ];

    function countToday(ids) {
        return ids.filter(function (id) {
            const key = "routine-" + getToday() + "-" + id;
            return localStorage.getItem(key) === "checked";
        }).length;
    }

    const morningCount = countToday(morningIds);
    const eveningCount = countToday(eveningIds);

    const morningCountText = document.querySelector("#morningCount");
    const morningBar = document.querySelector("#morningBar");

    const eveningCountText = document.querySelector("#eveningCount");
    const eveningBar = document.querySelector("#eveningBar");

    if (morningCountText && morningBar) {
        morningCountText.textContent = morningCount + " / 7 completed";
        morningBar.style.width = (morningCount / 7 * 100) + "%";
    }

    if (eveningCountText && eveningBar) {
        eveningCountText.textContent = eveningCount + " / 6 completed";
        eveningBar.style.width = (eveningCount / 6 * 100) + "%";
    }
}

updateRoutineProgress();

// WEEKLY SKINCARE TRACKER

const weeklyTracker = document.querySelector("#weeklyTracker");

if (weeklyTracker) {

    const morningIds = [
        "morning-dove",
        "morning-byoma",
        "morning-garnier",
        "morning-good-molecules",
        "morning-alpha-arbutin",
        "morning-purito",
        "morning-sunscreen"
    ];

    const eveningIds = [
        "evening-dove",
        "evening-nivea",
        "evening-byoma",
        "evening-anua",
        "evening-alpha-arbutin",
        "evening-purito"
    ];

    // Find the Monday of the current week
    const today = new Date();
    const monday = new Date(today);
    const dayNumber = (today.getDay() + 6) % 7;

    monday.setDate(today.getDate() - dayNumber);

    function getDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function countRoutine(dateKey, ids) {
        return ids.filter(function (id) {
            const key = "routine-" + dateKey + "-" + id;

            return localStorage.getItem(key) === "checked";
        }).length;
    }

    
// Calculate fully completed routines for the week

let completedMorningDays = 0;
let completedEveningDays = 0;

for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const dateKey = getDateKey(date);

    if (countRoutine(dateKey, morningIds) === 7) {
        completedMorningDays++;
    }

    if (countRoutine(dateKey, eveningIds) === 6) {
        completedEveningDays++;
    }
}

const weeklyMorningCount =
    document.querySelector("#weeklyMorningCount");

const weeklyEveningCount =
    document.querySelector("#weeklyEveningCount");

if (weeklyMorningCount) {
    weeklyMorningCount.textContent =
        completedMorningDays + " / 7";
}

if (weeklyEveningCount) {
    weeklyEveningCount.textContent =
        completedEveningDays + " / 7";
}


    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    weeklyTracker.innerHTML = "";

    for (let i = 0; i < 7; i++) {

        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        const dateKey = getDateKey(date);

        const morningCount = countRoutine(dateKey, morningIds);
        const eveningCount = countRoutine(dateKey, eveningIds);

        const dayCard = document.createElement("div");
        dayCard.className = "week-day";

        const dayLabel = document.createElement("span");
        dayLabel.textContent = dayNames[i];

        const dateLabel = document.createElement("small");
        dateLabel.textContent = date.getDate();

        const morning = document.createElement("span");
        morning.className = "day-circle";
        morning.textContent = morningCount === 7 ? "✓" : "☀";
        morning.title = `Morning: ${morningCount}/7 completed`;

        const evening = document.createElement("span");
        evening.className = "day-circle";
        evening.textContent = eveningCount === 6 ? "✓" : "☾";
        evening.title = `Evening: ${eveningCount}/6 completed`;

        if (morningCount === 7) {
            morning.classList.add("completed");
        }

        if (eveningCount === 6) {
            evening.classList.add("completed");
        }

        dayCard.append(
            dayLabel,
            dateLabel,
            morning,
            evening
        );

        weeklyTracker.appendChild(dayCard);
    }
}

// DAILY SELF-CARE ACTIVITIES AND XP

const selfcareTasks = document.querySelectorAll(
    ".selfcare-task input[type='checkbox']"
);

const selfcareProgress = document.querySelector("#selfcareProgress");
const pointsDisplay = document.querySelector("#pointsCount");

const today = new Date().toLocaleDateString("en-CA");

const activityKey = "selfcare-" + today;
const savedActivities = JSON.parse(
    localStorage.getItem(activityKey) || "[]"
);

selfcareTasks.forEach(function(task) {
    task.checked = savedActivities.includes(task.dataset.activity);

    task.addEventListener("change", updateSelfcare);
});

function updateSelfcare() {
    const completedActivities = [];

    selfcareTasks.forEach(function(task) {
        if (task.checked) {
            completedActivities.push(task.dataset.activity);
        }
    });

    localStorage.setItem(
        activityKey,
        JSON.stringify(completedActivities)
    );

   if (selfcareProgress) {
    selfcareProgress.textContent =
        completedActivities.length + " of 3 activities completed";
}

if (pointsDisplay) {
    pointsDisplay.textContent = calculateLifetimeXP() + " XP";
}
}

// CALCULATE TOTAL POINTS EARNED

function calculateLifetimeXP() {
    let totalPoints = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith("selfcare-")) {
            const activities = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            totalPoints += activities.length * 10;
        }
    }

    return totalPoints;
}

// CALCULATE SELF-CARE STREAK

function calculateStreak() {
    let streak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedDates = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith("selfcare-")) {
            const activities = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            if (activities.length > 0) {
                completedDates.push(key.replace("selfcare-", ""));
            }
        }
    }

    completedDates.sort();

    const uniqueDates = [...new Set(completedDates)];

    let checkDate = new Date(today);

    // Allow the streak to continue if yesterday was completed
    const todayString = checkDate.toLocaleDateString("en-CA");

    if (!uniqueDates.includes(todayString)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateString = checkDate.toLocaleDateString("en-CA");

        if (!uniqueDates.includes(dateString)) {
            break;
        }

        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
}

updateSelfcare();
// DISPLAY SELF-CARE STREAK

const streakDisplay = document.querySelector("#streakCount");

if (streakDisplay) {
    streakDisplay.textContent = calculateStreak() + " days";
}
// DAILY WORDS OF ENCOURAGEMENT

const encouragementMessages = [
    {
        title: "Your skin doesn't need perfection. It needs patience. ♡",
        description: "Give yourself time. Every skin journey is different."
    },
    {
        title: "You deserve the same care you give to everyone else. ♡",
        description: "Remember to make yourself a priority too."
    },
    {
        title: "Rest is productive too. Give yourself permission to slow down. ♡",
        description: "You don't have to achieve everything today."
    },
    {
        title: "Little progress is still progress. ♡",
        description: "Celebrate the small things you do for yourself."
    },
    {
        title: "You are beautiful beyond your skin. ♡",
        description: "Your worth is never measured by your appearance."
    },
    {
        title: "Be gentle with yourself today. ♡",
        description: "You are learning, growing and doing your best."
    },
    {
        title: "Your journey is yours. Don't compare it. ♡",
        description: "Focus on your own growth, one day at a time."
    }
];

const dailyMessage = document.querySelector("#dailyMessage");
const dailyDescription = document.querySelector(
    "#dailyMessageDescription"
);

if (dailyMessage && dailyDescription) {

    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const today = new Date();

    const dayNumber = Math.floor(
        (today - startOfYear) / (1000 * 60 * 60 * 24)
    );

    const messageIndex = dayNumber % encouragementMessages.length;
    const message = encouragementMessages[messageIndex];

    dailyMessage.textContent = message.title;
    dailyDescription.textContent = message.description;
}

// CONNECT DASHBOARD TO SAVED CYCLE INFORMATION

function updateDashboardCycle() {

    const savedCycle = JSON.parse(
        localStorage.getItem("skinDiaryCycle") || "null"
    );

    const cycleCount = document.querySelector("#cycleCount");
    const cycleDayDisplay = document.querySelector("#dashboardCycleDay");
    const cycleDetails = document.querySelector("#dashboardCycleDetails");

    if (!savedCycle) {
        if (cycleCount) cycleCount.textContent = "Not set";

        if (cycleDayDisplay) {
            cycleDayDisplay.textContent = "Your cycle diary";
        }

        if (cycleDetails) {
            cycleDetails.textContent = "Period · Mood · Symptoms · Skin";
        }

        return;
    }

    const startDate = new Date(
        savedCycle.lastPeriod + "T00:00:00"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cycleLength = Number(savedCycle.cycleLength);
    const periodLength = Number(savedCycle.periodLength);

    const difference = Math.floor(
        (today - startDate) / 86400000
    );

    if (difference < 0 || cycleLength <= 0) return;

    const cycleDay = (difference % cycleLength) + 1;
    const ovulationDay = Math.max(1, cycleLength - 14);

    let phase;

    if (cycleDay <= periodLength) {
        phase = "Menstrual";
    } else if (cycleDay < ovulationDay) {
        phase = "Follicular";
    } else if (cycleDay === ovulationDay) {
        phase = "Ovulation";
    } else {
        phase = "Luteal";
    }

    const nextPeriod = new Date(startDate);

    nextPeriod.setDate(
        nextPeriod.getDate() +
        (Math.floor(difference / cycleLength) + 1) * cycleLength
    );

    if (cycleCount) {
        cycleCount.textContent = "Day " + cycleDay;
    }

    if (cycleDayDisplay) {
        cycleDayDisplay.textContent =
            "Day " + cycleDay + " · " + phase;
    }

    if (cycleDetails) {
        cycleDetails.textContent =
            "Next estimated period: " +
            nextPeriod.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short"
            });
    }
}

updateDashboardCycle();

// DISPLAY LATEST DAILY CHECK-IN ON DASHBOARD

function updateDashboardCheckin() {

    const savedCheckins = JSON.parse(
        localStorage.getItem("skinDiaryCheckins") || "{}"
    );

    const moodDisplay = document.querySelector("#dashboardMood");
    const skinDisplay = document.querySelector("#dashboardSkin");
    const symptomsDisplay = document.querySelector("#dashboardSymptoms");

    if (!moodDisplay || !skinDisplay || !symptomsDisplay) return;

    const dates = Object.keys(savedCheckins).sort();

    if (dates.length === 0) {
        moodDisplay.textContent = "Mood: Not recorded yet";
        skinDisplay.textContent = "Skin: Not recorded yet";
        symptomsDisplay.textContent = "Symptoms: Not recorded yet";
        return;
    }

    const latestCheckin = savedCheckins[dates[dates.length - 1]];

    moodDisplay.textContent =
        "Mood: " + (latestCheckin.mood || "Not recorded");

    skinDisplay.textContent =
        "Skin: " + (latestCheckin.skinCondition || "Not recorded");

    symptomsDisplay.textContent =
        "Symptoms: " +
        (latestCheckin.symptoms.length
            ? latestCheckin.symptoms.join(", ")
            : "None recorded");
}

updateDashboardCheckin();
