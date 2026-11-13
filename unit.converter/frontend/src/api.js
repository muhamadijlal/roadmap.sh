// Memanggil backend Express: POST /api/convert
// Body:     { category, value, from, to }
// Sukses:   { result }
// Gagal:    { error }  (status 4xx/5xx)
export async function convertUnit({ category, value, from, to }) {
  let res;
  try {
    res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, value, from, to }),
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (status ${res.status})`);
  }

  if (typeof data?.result !== "number") {
    throw new Error("Invalid response from server.");
  }

  return data.result;
}
