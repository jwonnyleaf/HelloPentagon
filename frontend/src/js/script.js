const fileUpload = document.getElementById('file-upload');
const fileNameDisplay = document.getElementById('file-name');
const confirmButton = document.getElementById('confirm-button');
const submitButton = document.getElementById('submit-button');
const form = document.getElementById('upload-form');

fileUpload.addEventListener('change', function(event) {
    if (fileUpload.files.length > 0) {
        const fileName = fileUpload.files[0].name;
        fileNameDisplay.textContent = `Selected file: ${fileName}`;
        confirmButton.style.display = 'block';
    }
});

confirmButton.addEventListener('click', function(event) {
    submitButton.style.display = 'block'; 
    confirmButton.style.display = 'none'; 
});

form.addEventListener('submit', function(event) {
    if (!fileUpload.files.length) {
        event.preventDefault();
        alert("Please select a file to upload.");
    }
});
