import crypto from "node:crypto";

const COOKIE_NAME = "nyf_session";
const getSecret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
  return value;
};
const sign = (payload) => crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

export function readSession(req) {
  try {
    const raw = String(req.headers.cookie || "").split(";").map((p) => p.trim())
      .find((p) => p.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
    if (!raw) return null;
    const [payload, signature] = raw.split(".");
    const expected = sign(payload);
    if (!signature || signature.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString());
    return value.exp > Date.now() ? value : null;
  } catch {
    return null;
  }
}

export function setSession(res, value) {
  const payload = Buffer.from(JSON.stringify({ ...value, exp: Date.now() + 30 * 86400000 })).toString("base64url");
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
}

export function clearSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}
