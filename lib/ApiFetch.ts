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

// 🔐 refresh control (prevents multiple refresh calls)
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const ApiFetch = async (url: string, options: any = {}) => {
  let access = localStorage.getItem("access_token");
  let refresh = localStorage.getItem("refresh_token");

  let headers: any = {
    ...(options.headers || {}),
  };

  // ✅ attach token if valid
  if (access && isTokenValid(access)) {
    headers["Authorization"] = `Bearer ${access}`;
  }

  let res: Response;

  try {
    res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error("Network error:", err);
    return new Response(JSON.stringify({ error: "Network error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 🔥 HANDLE TOKEN EXPIRED (401)
  if (res.status === 401 && refresh) {
    try {
      // 🧠 prevent multiple refresh calls
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = fetch(`${API_BASE}/api/auth/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        })
          .then(async (r) => {
            if (!r.ok) throw new Error("Refresh failed");

            const data = await r.json();

            localStorage.setItem("access_token", data.access);
            return data.access;
          })
          .catch((err) => {
            console.error("Refresh error:", err);

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            return null;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newAccess = await refreshPromise;

      // ✅ retry original request
      if (newAccess) {
        headers["Authorization"] = `Bearer ${newAccess}`;

        return await fetch(`${API_BASE}${url}`, {
          ...options,
          headers,
        });
      }

      // ❌ refresh failed → force logout safe response
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    } catch (err) {
      console.error("Unexpected error:", err);

      return new Response(JSON.stringify({ error: "Auth error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return res;
};