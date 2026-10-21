const API_URL = process.env.API_URL;

export async function apiGet(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    // credentials: "include", // if auth goes through a cookie
  });
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`);
  }
  return response.json();
}
