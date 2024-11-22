function GotoFeatures() {
    // check if challenge is active
    let activeChallenge = localStorage.getItem('activeChallenge');
    if (!activeChallenge) {
        alert('Please select a challenge first!');
        return false;
    }
    window.location.href = "/features";
    return true;
}

function updateGotoFeaturesButton() {
    let activeChallenge = localStorage.getItem('activeChallenge');
    if (!activeChallenge) {
        return;
    }
    let btn = document.getElementById('btnGotoFeatures');
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-success');
}


// wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function () {

    let activeChallenge = localStorage.getItem('activeChallenge') || '';
    updateChallengeButtons(activeChallenge);
    updateGotoFeaturesButton();
});
