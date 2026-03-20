const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ApiFetch = async (url: string, options: any = {}) => {
  let access = localStorage.getItem("access_token");
  let refresh = localStorage.getItem("refresh_token");

  // ✅ base headers
  let headers: any = {
    ...(options.headers || {}),
  };

  // ✅ ONLY attach token if it exists
  if (access) {
    headers["Authorization"] = `Bearer ${access}`;
  }

  let res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  // 🔥 If unauthorized AND we have refresh token
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

      // ✅ save new access token
      localStorage.setItem("access_token", data.access);

      // ✅ retry original request with new token
      headers["Authorization"] = `Bearer ${data.access}`;

      res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
      });

    } else {
      // ❌ refresh failed → logout safely
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // ⚠️ only redirect if user was actually logged in
      if (access) {
        window.location.href = "/login";
      }

      return res;
    }
  }

  return res;
};