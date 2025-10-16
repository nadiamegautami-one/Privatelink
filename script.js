// --- Helper functions ---
// Function to switch sections
function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

// Navigation links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(link.getAttribute('href').substring(1));
  });
});

// --- Google Sign-In Setup ---

// Replace 'YOUR_CLIENT_ID' with your actual Google OAuth 2.0 client ID
const CLIENT_ID = 'YOUR_CLIENT_ID'; // <-- Replace this

// Initialize Google Sign-In
window.onload = () => {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById('google-signin'),
    { theme: 'outline', size: 'large', text: 'signin_with', shape: 'pill' }
  );
  // Optional: Auto-login
  // google.accounts.id.prompt();
  setWatermark();
  loadUserFromURL();
};

// Store user info
let currentUser = null;

function handleCredentialResponse(response) {
  const responsePayload = response.credential;
  const userObj = parseJwt(responsePayload);
  currentUser = {
    name: userObj.name,
    email: userObj.email,
    picture: userObj.picture
  };
  updateUserUI();
}

// Parse JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Update UI after login
function updateUserUI() {
  if (currentUser) {
    document.querySelector('.user-info').innerText = currentUser.name;
    document.getElementById('google-signin').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('file-section').style.display = 'block';
  }
}

// Logout function
document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  document.querySelector('.user-info').innerText = '';
  document.getElementById('google-signin').style.display = 'block';
  document.getElementById('logout-btn').style.display = 'none';
  document.getElementById('file-section').style.display = 'none';
});

// --- Hash Generator ---
document.getElementById('generate-hash').addEventListener('click', () => {
  const fileInput = document.getElementById('file-input');
  if (!currentUser) {
    alert('Please login with Google to upload files.');
    return;
  }
  if (fileInput.files.length === 0) {
    alert('Please select a file.');
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = e.target.result;
    generateHashes(data);
  };
  reader.readAsArrayBuffer(file);
});

// Function to generate hashes
function generateHashes(arrayBuffer) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  const md5Hash = CryptoJS.MD5(wordArray).toString();
  const sha1Hash = CryptoJS.SHA1(wordArray).toString();
  const sha256Hash = CryptoJS.SHA256(wordArray).toString();

  document.getElementById('hash-results').innerHTML = `
    <p><strong>MD5:</strong> ${md5Hash}</p>
    <p><strong>SHA-1:</strong> ${sha1Hash}</p>
    <p><strong>SHA-256:</strong> ${sha256Hash}</p>
  `;
}

// --- Watermark with GitHub username ---
function setWatermark() {
  const url = window.location.href;
  const match = url.match(/github.io\/([^\/]+)\//);
  const username = match ? match[1] : 'your-github-username';
  document.getElementById('github-username').innerText = username;
}

// --- Load user info from URL or local storage if needed ---
// (Optional enhancement)

// --- Additional: smooth scroll for navigation ---
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(link.getAttribute('href').substring(1));
  });
});