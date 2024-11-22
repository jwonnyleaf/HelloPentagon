const availableFeatures = [
    "virtual_size",
    "has_debug",
    "imports",
    "exports",
    "has_relocations",
    "has_resources",
    "has_signature",
    "has_tls",
    "symbols",
    "timestamp",
    "machine",
    "numberof_sections",
    "characteristics_list",
    "dll_characteristics_list",
    "magic",
    "major_image_version",
    "minor_image_version",
    "major_linker_version",
    "minor_linker_version",
    "major_operating_system_version",
    "minor_operating_system_version",
    "major_subsystem_version",
    "minor_subsystem_version",
    "sizeof_code",
    "sizeof_headers",
    "sizeof_heap_commit",
    "string_paths",
    "string_urls",
    "string_registry",
    "string_MZ",
    "functions",
    "libraries",
    "exports_list"
];

// Selected Features list (index + 1)
const selectedFeatures = [];

function selectFeatureBudgetUpdate(button) {
    const featureIndex = parseInt(button.dataset.index);
    const maxBudget = getMaxBudget();
    let budget = localStorage.getItem('budget');
    if (budget && selectedFeatures.length >= maxBudget) {
        alert('You have reached the maximum number of features. Please unselect a feature to add a new one.');
        return;
    }
    budget = parseInt(budget) || 1;
    budget = budget - 1;
    localStorage.setItem('budget', budget);
    updateBudget();

    button.classList.remove('btn-secondary');
    button.classList.add('btn-primary');
    selectedFeatures.push(featureIndex);
}

function deselectFeatureBudgetUpdate(button) {
    const featureIndex = parseInt(button.dataset.index);
    let budget = localStorage.getItem('budget');
    budget = parseInt(budget) || 0;
    budget = budget + 1;
    localStorage.setItem('budget', budget);
    updateBudget();

    button.classList.remove('btn-primary');
    button.classList.add('btn-secondary');
    const index = selectedFeatures.indexOf(featureIndex);
    if (index !== -1) {
        selectedFeatures.splice(index, 1);
    }
}

// Function to toggle button state and update selectedFeatures
function toggleFeature(button) {
    if (button.classList.contains('btn-secondary')) {
        selectFeatureBudgetUpdate(button);

    } else {
        deselectFeatureBudgetUpdate(button);
    }
}


function trainButtonClicked() {
    // check number of selected features
    if (selectedFeatures.length == 0) {
        alert('Please select at least one feature to train the model.');
        return;
    }

    const endpoint = '/api/train/';
    let challengeID = getChallengeInteger();

    if (!challengeID) {
        alert('Please select a challenge first!');
        return;
    }

    const data = {
        features: selectedFeatures,
        challenge_id: challengeID
    };

    // Send a POST request to the server
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify that we're sending JSON data
            'X-CSRFToken': getCSRFToken()       // Add CSRF token if needed (Django)
        },
        body: JSON.stringify(data)              // Convert the data to JSON format
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(responseData => {
            // Handle the server's response
            console.log('Server response:', responseData);
            alert('Training completed successfully!');
            // redirect to /results
            window.location.href = '/results/';

        })
        .catch(error => {
            // Handle any errors
            console.error('There was a problem with the fetch operation:', error);
            alert('An error occurred while training. Please try again.');
        });

}


// wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function () {
    // Create buttons for each feature
    const featuresContainer = document.getElementById('featuresContainer');
    availableFeatures.forEach((feature, index) => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary', 'feature-btn', 'col-md-3', 'col-sm-6', 'col-lg-2');
        button.textContent = feature;
        button.dataset.index = index + 1; // Store index + 1 in data attribute

        // Click event listener for the button
        button.addEventListener('click', () => {
            toggleFeature(button);
        });

        featuresContainer.appendChild(button);
    });

    // Train button event listener
    const trainButton = document.getElementById('trainButton');
    trainButton.addEventListener('click', () => {
        trainButtonClicked();
    });

});
