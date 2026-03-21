const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🔥 check if JWT is still valid
const isTokenValid = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const ApiFetch = async (url: string, options: any = {}) => {
  let access = localStorage.getItem("access_token");
  let refresh = localStorage.getItem("refresh_token");

  let headers: any = {
    ...(options.headers || {}),
  };

  // ✅ ONLY attach token if valid
  if (access && isTokenValid(access)) {
    headers["Authorization"] = `Bearer ${access}`;
  } else {
    // 🔥 clean broken tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    access = null;
  }

  let res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  // 🔥 If unauthorized AND we have refresh token
  if (res.status === 401 && refresh) {
    try {
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

        headers["Authorization"] = `Bearer ${data.access}`;

        // 🔁 retry original request
        res = await fetch(`${API_BASE}${url}`, {
          ...options,
          headers,
        });
      } else {
        // ❌ refresh failed → clear tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return null; // 🔥 IMPORTANT FIX
      }
    } catch (err) {
      console.error("Refresh failed:", err);
      return null;
    }
  }

  return res;
};