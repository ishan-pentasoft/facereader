/**
 * Validate a phone number using IPQualityScore Phone API.
 * Pass full international number including +countryCode, e.g., "+14155552671".
 * Returns the raw API response and a simple boolean.
 */
export async function ipqsValidatePhone(fullInternational) {
  const API_KEY = process.env.IPQS_API_KEY;
  if (!API_KEY) {
    // If no key configured, skip validation gracefully
    return { ok: true, skipped: true };
  }

  const base = "https://ipqualityscore.com/api/json/phone";
  const url = `${base}/${encodeURIComponent(API_KEY)}/${encodeURIComponent(
    fullInternational
  )}?strictness=1&line_type=true`;

  try {
    const res = await fetch(url, { method: "GET", next: { revalidate: 0 } });
    if (!res.ok) {
      return {
        ok: false,
        error: `IPQS request failed (${res.status})`,
      };
    }
    const data = await res.json();

    // Basic decision: invalid => reject. High fraud score => reject.
    if (data && data.valid === true) {
      if (typeof data.fraud_score === "number" && data.fraud_score >= 85) {
        return {
          ok: false,
          error: "High risk phone number",
          code: "high_risk",
          data,
        };
      }
      return { ok: true, data };
    }

    return {
      ok: false,
      error: data?.message || "Invalid phone number",
      code: "invalid",
      data,
    };
  } catch (e) {
    return { ok: false, error: e?.message || "IPQS fetch error" };
  }
}
