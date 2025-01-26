const ipv4 = import.meta.env.VITE_HOST_IPV4;

// Send a command to Flask backend (e.g., to control the app or volume)
export const sendCommand = (url, data) => {
  fetch(`http://${ipv4}:5000${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
