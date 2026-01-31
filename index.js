const BACKEND_URL = "https://blindaid-bc-production.up.railway.app";
const userId = "akash_001"; // SAME ID as Pi

let locationSent = false;
let pollingStarted = true;

const statusText = document.getElementById("status");
statusText.innerText = "🟢 Waiting for emergency...";

// poll backend every 3 seconds
setInterval(async () => {
  if (!pollingStarted || locationSent) return;

  try {
    const res = await fetch(`${BACKEND_URL}/status/${userId}`);
    const data = await res.json();

    if (data.active && !data.locationReceived) {
      statusText.innerText = "🚨 Emergency detected. Sending location...";

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await fetch(`${BACKEND_URL}/location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            })
          });

          locationSent = true;
          statusText.innerText = "📍 Location sent automatically";
        },
        () => {
          statusText.innerText = "❌ Location permission denied";
        }
      );
    }

    // reset when emergency ends (for next time)
    if (!data.active && locationSent) {
      locationSent = false;
      statusText.innerText = "🟢 Waiting for emergency...";
    }

  } catch (e) {
    console.log("Polling error");
  }
}, 3000);
