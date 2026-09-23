# Monitoring

## What exists

- Server logs from the host (Vercel function logs). The contact route logs
  `[contact] Delivery failed via <provider>: <reason>` for every failed
  delivery, without the enquiry contents.
- Error boundaries (`src/app/error.tsx`, `src/app/global-error.tsx`) show a
  reference id (`digest`) that matches the server log entry.

## Recommended before launch (low effort)

- **An uptime check** on `/`, and on `/api/contact` expecting `405` for `GET`.
  A free tier of Better Stack, UptimeRobot or similar is enough.
- **A log alert** on `[contact] Delivery failed`, because a broken email
  configuration loses leads without anyone noticing.

## Add when justified

- **Error tracking (for example Sentry)** once there is enough traffic or
  client-side code to make browser errors worth collecting. It needs a CSP
  `connect-src` change and a privacy policy update.
- **Structured JSON logs with a request id** if the logs start being searched
  regularly.
