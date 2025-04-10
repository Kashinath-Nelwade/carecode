// DOM Elements
const userForm = document.getElementById('userForm');
const qrSection = document.getElementById('qrSection');
const qrcodeDiv = document.getElementById('qrcode');
const downloadBtn = document.getElementById('downloadBtn');
const newCodeBtn = document.getElementById('newCodeBtn');
const searchBtn = document.getElementById('searchBtn');
const scanBtn = document.getElementById('scanBtn');
const searchInput = document.getElementById('searchInput');
const dataSection = document.getElementById('dataSection');
const dataDisplay = document.getElementById('dataDisplay');
const scanModal = document.getElementById('scanModal');
const closeScan = document.getElementById('closeScan');
const printBtn = document.getElementById('printBtn');

// Database simulation using localStorage
const database = {
    saveData: (id, data) => {
        localStorage.setItem(`carecode_${id}`, JSON.stringify(data));
        return id;
    },
    getData: (id) => {
        const data = localStorage.getItem(`carecode_${id}`);
        return data ? JSON.parse(data) : null;
    }
};

// Generate a unique ID
function generateId() {
    return 'cc-' + Math.random().toString(36).substr(2, 9);
}

// Form submission handler
if (userForm) {
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const userData = {
            id: generateId(),
            fullName: document.getElementById('fullName').value,
            dob: document.getElementById('dob').value,
            bloodType: document.getElementById('bloodType').value,
            allergies: document.getElementById('allergies').value,
            conditions: document.getElementById('conditions').value,
            emergencyContact: document.getElementById('emergencyContact').value,
            medications: document.getElementById('medications').value,
            timestamp: new Date().toISOString()
        };

        // Save to database
        database.saveData(userData.id, userData);

        // Generate QR code
        generateQRCode(userData.id);

        // Show QR section
        userForm.style.display = 'none';
        qrSection.style.display = 'block';
    });
}

// Generate QR code
// function generateQRCode(data) {
//     // Clear previous QR code
//     qrcodeDiv.innerHTML = '';

//     // Create new QR code
//     new QRCode(qrcodeDiv, {
//         text: data,
//         width: 200,
//         height: 200,
//         colorDark: "#000000",
//         colorLight: "#ffffff",
//         correctLevel: QRCode.CorrectLevel.H
//     });
// }

// Generate QR code with a URL that points to your hosted app
// function generateQRCode(id) {
//     // Clear previous QR code
//     qrcodeDiv.innerHTML = '';

//     // Create the URL that will be encoded in the QR
//     // Replace with your actual hosted URL when deployed
//     const appUrl = window.location.href.includes('view.html')
//         ? window.location.href.replace('view.html', 'view.html?id=' + id)
//         : window.location.href.replace('index.html', 'view.html?id=' + id);

//     // Create new QR code with the full URL
//     new QRCode(qrcodeDiv, {
//         text: appUrl,
//         width: 200,
//         height: 200,
//         colorDark: "#000000",
//         colorLight: "#ffffff",
//         correctLevel: QRCode.CorrectLevel.H
//     });
// }


// this code i get from the github 

function generateQRCode(id) {
    qrcodeDiv.innerHTML = '';
    
    // Use your GitHub Pages URL
    const appUrl = `https://YOUR-USERNAME.github.io/carecode/view.html?id=${id}`;
    
    new QRCode(qrcodeDiv, {
        text: appUrl,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}





// Download QR code
if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
        const canvas = qrcodeDiv.querySelector('canvas');
        const url = canvas.toDataURL('image/png');

        const a = document.createElement('a');
        a.href = url;
        a.download = 'carecode-qr.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// Create new code
if (newCodeBtn) {
    newCodeBtn.addEventListener('click', function () {
        qrSection.style.display = 'none';
        userForm.style.display = 'block';
        userForm.reset();
    });
}

// Search for data
if (searchBtn) {
    searchBtn.addEventListener('click', function () {
        const id = searchInput.value.trim();
        if (id) {
            displayData(id);
        } else {
            alert('Please enter a valid ID');
        }
    });
}

// Scan QR code
if (scanBtn) {
    scanBtn.addEventListener('click', function () {
        scanModal.style.display = 'flex';
        // In a real app, you would initialize a QR scanner here
        // For demo purposes, we'll simulate scanning after 2 seconds
        setTimeout(() => {
            const sampleId = 'cc-abcdef123'; // This would be the scanned ID
            scanModal.style.display = 'none';
            displayData(sampleId);
        }, 2000);
    });
}

// Close scan modal
if (closeScan) {
    closeScan.addEventListener('click', function () {
        scanModal.style.display = 'none';
    });
}

// Display data function
function displayData(id) {
    const data = database.getData(id);

    if (data) {
        dataDisplay.innerHTML = `
            <div class="data-item">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> ${data.fullName}</p>
                <p><strong>Date of Birth:</strong> ${new Date(data.dob).toLocaleDateString()}</p>
                <p><strong>Blood Type:</strong> ${data.bloodType}</p>
            </div>
            
            <div class="data-item">
                <h3>Medical Information</h3>
                <p><strong>Allergies:</strong> ${data.allergies || 'None listed'}</p>
                <p><strong>Conditions:</strong> ${data.conditions || 'None listed'}</p>
                <p><strong>Medications:</strong> ${data.medications || 'None listed'}</p>
            </div>
            
            <div class="data-item">
                <h3>Emergency Contact</h3>
                <p>${data.emergencyContact || 'Not provided'}</p>
            </div>
            
            <div class="data-item">
                <p><small>Last updated: ${new Date(data.timestamp).toLocaleString()}</small></p>
            </div>
        `;

        dataSection.style.display = 'block';
    } else {
        dataDisplay.innerHTML = '<p>No data found for this ID. Please check and try again.</p>';
        dataSection.style.display = 'block';
    }
}

// Print data
if (printBtn) {
    printBtn.addEventListener('click', function () {
        window.print();
    });
}

// Initialize page
if (window.location.pathname.includes('view.html')) {
    // Check for ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        displayData(id);
    }
}
