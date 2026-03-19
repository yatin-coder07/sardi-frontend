const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ApiFetch = async (url, options = {}) => {

  let access = localStorage.getItem("access_token");
  let refresh = localStorage.getItem("refresh_token");

  let res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${access}`,
    },
  });

  // 🔥 If token expiredz
  if (res.status === 401 && refresh) {

    const refreshRes = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();

      localStorage.setItem("access_token", data.access);

      // 🔁 retry original request
      res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${data.access}`,
        },
      });

    } else {
      // ❌ refresh also failed → logout
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  }

  return res;
};