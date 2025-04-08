// Custom Scripts for Pawthorized

document.addEventListener('DOMContentLoaded', () => {
    // ScrollSpy activation
    const mainNav = document.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Navbar collapse on click for mobile
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    navLinks.forEach(navLink => {
        navLink.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Form Logic
    const checkbox = document.getElementById('additionalHandler');
    const handlerField = document.getElementById('additionalHandlerField');
    const emailField = document.getElementById('additionalEmailField');
    const paymentButton = document.getElementById('submit');
    const form = document.getElementById('registrationForm');

    const basePrice = 19.99;
    const extraHandlerPrice = 9.99;

    if (checkbox && paymentButton) {
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            handlerField.classList.toggle('d-none', !isChecked);
            emailField.classList.toggle('d-none', !isChecked);
            paymentButton.textContent = isChecked
                ? `Complete Payment - $${(basePrice + extraHandlerPrice).toFixed(2)}`
                : `Complete Payment - $${basePrice.toFixed(2)}`;
        });
    }

    // Click handler for payment
    if (paymentButton) {
        paymentButton.addEventListener('click', () => {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const isAdditional = checkbox.checked;
            const total = isAdditional ? basePrice + extraHandlerPrice : basePrice;
            

            form.submit(); // Will submit base64 with other data
        });
    }

    // Field validation feedback
    const petName = document.getElementById('petName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');

    [petName, phone, email].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.toggle('is-invalid', !input.checkValidity());
        });
    });

    // Final validation before submission
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            form.reportValidity();
        }
    });
});

let cropper;

// Setup cropper on image selection
document.getElementById('petPicture').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const previewImage = document.getElementById('previewImage');
    const previewContainer = document.getElementById('previewContainer');
    const cropButton = document.getElementById('cropButton');
    const statusMessage = document.getElementById('statusMessage');

    
    // Reset messages and preview
    statusMessage.classList.add('d-none');
    cropButton.classList.add('d-none');
    previewContainer.style.display = 'none';

    // Fix for iPhone HEIC images (basic workaround)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Unsupported image format. Please upload PNG, JPG, or take a screenshot.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        previewImage.src = event.target.result;
        previewImage.onload = () => {
            // Init Cropper
            if (cropper) cropper.destroy();
            cropper = new Cropper(previewImage, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1
            });

            previewContainer.style.display = 'block';
            cropButton.classList.remove('d-none');
        };
    };

    reader.readAsDataURL(file);
});

// Crop and save image
document.getElementById('cropButton').addEventListener('click', function () {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
        width: 480,
        height: 480,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    const base64 = canvas.toDataURL('image/png');
    document.getElementById('petImageBase64').value = base64;

    // Cleanup UI
    cropper.destroy();
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('statusMessage').classList.remove('d-none');
});

// formspree submition
