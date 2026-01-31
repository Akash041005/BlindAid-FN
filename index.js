const BACKEND_URL = "https://blindaid-bc-production.up.railway.app";

const sosBtn = document.getElementById("sosBtn");
const statusText = document.getElementById("status");

sosBtn.addEventListener("click", async () => {
  const userId = document.getElementById("userId").value.trim();

  if (!userId) {
    alert("Please enter your ID");
    return;
  }

  statusText.innerText = "🚨 Sending emergency...";

  // 1️⃣ Trigger emergency
  await fetch(`${BACKEND_URL}/emergency`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  // 2️⃣ Get GPS location
  if (!navigator.geolocation) {
    statusText.innerText = "❌ GPS not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      await fetch(`${BACKEND_URL}/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lat, lng })
      });

      statusText.innerText = "✅ SOS sent successfully";
    },
    () => {
      statusText.innerText = "❌ Location permission denied";
    }
  );
});
