// backend ka base url
const BASE_URL = "http://localhost:5000/api";

// chhota helper function jo fetch ka kaam aasaan banata hai
export async function apiRequest(path, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // agar token hai to authorization header me daalo
  if (token) {
    options.headers.Authorization = "Bearer " + token;
  }

  // agar body hai to json me convert karo
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, options);
  const data = await res.json();

  return { ok: res.ok, status: res.status, data };
}

// login api call
export function loginUser(email, password) {
  return apiRequest("/auth/login", "POST", { email, password });
}

// register api call
export function registerUser(name, email, password) {
  return apiRequest("/auth/register", "POST", { name, email, password });
}

// profile api call
export function getProfile() {
  return apiRequest("/profile");
}

// admin dashboard api call
export function getAdminDashboard() {
  return apiRequest("/admin/dashboard");
}