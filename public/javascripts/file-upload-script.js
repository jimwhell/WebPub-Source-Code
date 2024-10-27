const fileInput = document.querySelector('#file-upload');
const fileNameDisplay = document.querySelector('#file-upload-filename');

console.log(fileInput);
console.log(fileNameDisplay)
fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = Array.from(fileInput.files)
            .map(file => file.name)
            .join(', ');
    } else {
        fileNameDisplay.textContent = 'No file chosen';
    }
});
