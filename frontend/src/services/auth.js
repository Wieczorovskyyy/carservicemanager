export function parseTokenPayload(token) {
  try {
    if (!token) return null;
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export function getAuthUser() {
  const token = localStorage.getItem("token");
  const payload = parseTokenPayload(token);
  return {
    token,
    id: payload?.id || null,
    role: payload?.role || "guest",
    first_name: payload?.first_name || "",
    last_name: payload?.last_name || ""
  };
}
