function copyImageUrl(imageUrl) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(imageUrl);
        return;
    }

    navigator.clipboard.writeText(imageUrl)
        .then(() => {
        })
        .catch(err => {
            console.error('Failed to copy image URL: ', err);
            alert('Failed to copy image URL. Please copy manually.');
        });
}

function copyControlCode(controlCode) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(controlCode);
        return;
    }

    navigator.clipboard.writeText(controlCode)
        .then(() => {

        })
        .catch(err => {
            console.error('Failed to copy control code: ', err);
            alert('Failed to copy control code. Please copy manually.');
        });
}

function copySensitivityCode(sensitivityCode) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(sensitivityCode);
        return;
    }

    navigator.clipboard.writeText(sensitivityCode)
        .then(() => {

        })
        .catch(err => {
            console.error('Failed to copy sensitivity code: ', err);
            alert('Failed to copy sensitivity code. Please copy manually.');
        });
}

function toggleImage(button, imageUrl, event) {
    event.preventDefault();

    var imageContainer = button.closest('.profile-card').querySelector('.image-container');
    var image = imageContainer.querySelector('img');


    if (image.style.display === 'none' || !image.hasAttribute('src')) {
        image.onload = function () {
            image.style.display = 'block';
            button.textContent = 'Hide';
        };
        image.src = imageUrl;
    } else {
        if (image.style.display === 'none') {
            image.style.display = 'block';
            button.textContent = 'Hide';
        } else {
            image.style.display = 'none';
            button.textContent = 'Show';
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {

    updateDeviceSizes();


    var deviceSelect = document.getElementById("device");
    deviceSelect.addEventListener("change", function () {
        updateDeviceSizes();
    });
});

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);

    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Failed to copy text. Please copy manually.');
    }

    document.body.removeChild(textArea);
}


function setupUploadPage() {

    var uploadButton = document.querySelector('.upload-button');
    if (uploadButton) {
        uploadButton.addEventListener('click', function () {
            location.href = '/upload';
        });
    }


    var gameSelect = document.getElementById('game');
    if (gameSelect) {
        gameSelect.addEventListener('change', function () {

        });
    }


    var deviceSelect = document.getElementById('device');
    var sizeSelect = document.getElementById('device_size');
    if (deviceSelect && sizeSelect) {
        deviceSelect.addEventListener('change', function () {
            updateDeviceSizes();
        });
    }
}


function updateDeviceSizes() {
    var deviceSelect = document.getElementById("device");
    var sizeSelect = document.getElementById("device_size");
    var selectedDevice = deviceSelect.value;


    sizeSelect.innerHTML = '';


    var defaultOption = document.createElement("option");
    defaultOption.text = "Select Size";
    sizeSelect.add(defaultOption);

    switch (selectedDevice) {
        case "Android":
            sizeSelect.options.add(new Option("6.0 inches", "6.0"));
            sizeSelect.options.add(new Option("6.1 inches", "6.1"));
            sizeSelect.options.add(new Option("6.2 inches", "6.2"));
            sizeSelect.options.add(new Option("6.3 inches", "6.3"));
            sizeSelect.options.add(new Option("6.4 inches", "6.4"));
            sizeSelect.options.add(new Option("6.5 inches", "6.5"));
            sizeSelect.options.add(new Option("6.6 inches", "6.6"));
            sizeSelect.options.add(new Option("6.7 inches", "6.7"));
            sizeSelect.options.add(new Option("6.8 inches", "6.8"));
            sizeSelect.options.add(new Option("6.9 inches", "6.9"));
            break;
        case "iPhone":
            sizeSelect.options.add(new Option("6.1 inches", "6.1"));
            sizeSelect.options.add(new Option("4.0 inches", "4.0"));
            sizeSelect.options.add(new Option("4.7 inches", "4.7"));
            sizeSelect.options.add(new Option("5.4 inches", "5.4"));
            sizeSelect.options.add(new Option("5.5 inches", "5.5"));
            break;
        case "iPad":
            sizeSelect.options.add(new Option("7.9 inches", "7.9"));
            sizeSelect.options.add(new Option("9.7 inches", "9.7"));
            sizeSelect.options.add(new Option("10.5 inches", "10.5"));
            sizeSelect.options.add(new Option("10.9 inches", "10.9"));
            sizeSelect.options.add(new Option("11.0 inches", "11.0"));
            sizeSelect.options.add(new Option("12.9 inches", "12.9"));
            break;
        default:
            break;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    setupUploadPage();
});

function validateForm() {
    var sizeSelect = document.getElementById('device_size');
    var selectedSize = sizeSelect.value;

    if (selectedSize === '' || selectedSize === 'Select Size') {
        alert('Please select a device size before submitting.');
        return false;
    }


    return true;
}