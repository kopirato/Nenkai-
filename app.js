import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase config (YOUR KEY)
const firebaseConfig = {
  apiKey: "AIzaSyDfZhVza4Dxz3dSN9SUv8x6VHCNi_jIM0",
  authDomain: "nenkai-7a7f4.firebaseapp.com",
  projectId: "nenkai-7a7f4",
  storageBucket: "nenkai-7a7f4.firebasestorage.app",
  messagingSenderId: "133447986572",
  appId: "1:133447986572:web:6db776a6f6e03cfe65faa9"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

let img = new Image();
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

document.getElementById("upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

img.onload = () => {
  canvas.width = img.width * 1.6;
  canvas.height = img.height * 1.6;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

function enhanceImage() {
  const pass = document.getElementById("adminPass").value;
  if (pass !== "0742147197") {
    alert("Wrong admin password");
    return;
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // REAL pixel enhancement
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.15);
    data[i + 1] = Math.min(255, data[i + 1] * 1.15);
    data[i + 2] = Math.min(255, data[i + 2] * 1.15);
  }

  ctx.putImageData(imageData, 0, 0);

  if (document.getElementById("watermarkToggle").checked) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("ENHANCED PRO", 20, 50);
  }

  document.getElementById("status").innerText =
    "Enhancement completed successfully!";
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "enhanced.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function uploadToFirebase() {
  const pass = document.getElementById("adminPass").value;
  if (pass !== "0742147197") {
    alert("Unauthorized access");
    return;
  }

  canvas.toBlob(async (blob) => {
    const fileRef = ref(storage, "enhanced-images/" + Date.now() + ".png");

    try {
      await uploadBytes(fileRef, blob);
      document.getElementById("status").innerText =
        "Uploaded successfully to Firebase!";
    } catch (err) {
      console.error(err);
      document.getElementById("status").innerText =
        "Upload failed!";
    }
  });
}
