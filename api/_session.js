import crypto from "node:crypto";

const COOKIE_NAME = "nyf_session";
const SESSION_SECONDS = 400 * 86400;
const getSecret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
  return value;
};
const sign = (payload) => crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

export function readSession(req) {
  try {
    const raw = String(req.headers.cookie || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
    if (!raw) return null;
    if (raw.length > 2048) return null;
    const [payload, signature] = raw.split(".");
    const expected = sign(payload);
    if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString());
    return value.v === 1 && value.iat <= Date.now() + 60000 && value.exp > Date.now() && ["member", "staff"].includes(value.role) ? value : null;
  } catch { return null; }
}

export function setSession(res, value) {
  const now = Date.now();
  const payload = Buffer.from(JSON.stringify({ ...value, v: 1, iat: now, exp: now + SESSION_SECONDS * 1000 })).toString("base64url");
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
}

export function clearSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}
