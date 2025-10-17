// Ganti ini dengan Client ID dari Google Cloud
const CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";

window.onload = () => {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("googleSignInButton"),
    { theme: "outline", size: "large" }
  );
};

function handleCredentialResponse(response) {
  document.getElementById("loginStatus").textContent =
    "Login berhasil ✅ Token diterima.";
  console.log("ID Token:", response.credential);
}

// Fungsi hash file dengan SHA-256 dan watermark
document.getElementById("hashButton").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) {
    alert("Pilih file terlebih dahulu.");
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const watermarkText = `Signature © nadiamegautami-one • ${new Date().toLocaleString()}`;

  document.getElementById("hashOutput").textContent = hashHex;
  document.getElementById("watermark").textContent = watermarkText;
});