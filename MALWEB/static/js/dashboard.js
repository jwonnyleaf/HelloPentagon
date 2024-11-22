const challengeToIDMap = {
    'Challenge 1': 'challenge1',
    'Challenge 2': 'challenge2',
    'Challenge 3': 'challenge3'
};

const ChallengeToIntegerMap = {
    'Challenge 1': 1,
    'Challenge 2': 2,
    'Challenge 3': 3
}

const ChallengeBudgets = {
    'Challenge 1': 5,
    'Challenge 2': 3,
    'Challenge 3': 2
}


const sidebarIDs = ['challenges', 'leaderboard', 'features', 'results'];

function setActiveChallenge(challenge) {
    localStorage.setItem('activeChallenge', challenge);
    updateChallengeButtons(challenge);
    updateChallengeNav(challenge);
    updateGotoFeaturesButton();
    initBudget();
}

function initBudget() {
    let budget = getMaxBudget();
    localStorage.setItem('budget', budget);
    updateBudget();
}

function getMaxBudget() {
    let challenge = localStorage.getItem('activeChallenge');
    if (!challenge) {
        return 0;
    }
    return ChallengeBudgets[challenge];
}

function updateBudget() {
    let budget = localStorage.getItem('budget');
    let budgetElement = document.getElementById('budget');
    if (budgetElement) {
        budgetElement.innerText = budget;
    }
}

function getChallengeInteger() {
    challenge = localStorage.getItem('activeChallenge');
    if (!challenge) {
        return 0;
    }
    return ChallengeToIntegerMap[challenge];
}

function updateChallengeButtons(challenge) {
    // Reset all buttons to secondary style
    for (let key in challengeToIDMap) {
        let btn = document.getElementById(challengeToIDMap[key]);
        if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }
    }

    // Set the active button to primary style
    let activeChallengeID = challengeToIDMap[challenge];
    let activeBtn = document.getElementById(activeChallengeID);
    if (activeBtn) {
        activeBtn.classList.remove('btn-secondary');
        activeBtn.classList.add('btn-primary');
    }
}

function updateChallengeNav(challenge) {
    let navText = document.getElementById('nav_challenge');
    if (challenge) {
        if (navText) {
            navText.innerText = challenge;
        }
    } else {
        navText.innerText = 'Not Selected';
    }
}

function updateSidebar(sidebarID) {
    let challengesButton = document.getElementById(sidebarID);
    challengesButton.classList.add('active');
    sidebarIDs.forEach(function (id) {
        if (id !== sidebarID) {
            let btn = document.getElementById(id);
            if (btn) {
                btn.classList.remove('active');
            }
        }
    });
}

function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(name + '=')) {
            return trimmedCookie.substring(name.length + 1);
        }
    }
    return null;
}

// wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function () {
    let activeChallenge = localStorage.getItem('activeChallenge') || '';
    updateChallengeNav(activeChallenge);
    initBudget();
});
