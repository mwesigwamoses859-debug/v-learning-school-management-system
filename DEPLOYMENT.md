# V-Learning School Management System

Live school portal: https://v-learning-school-management-system.mwesigwamoses859.workers.dev/
Learning platform: https://v-learning-uganda-app.pages.dev/

This is the Cloudflare Worker edition of the supplied school system. Student and academic records persist in D1, rather than a local JSON file. It starts without copied students, marks, staff, attendance, documents or sample activity. Existing copied staff accounts are disabled by the upgrade migration; previously published initial administrator passwords must be changed before opening records.

## Build and deployment

Use Node.js 22 or later. Run `npm ci`, `npm run lint`, `npm test` and `npm run build:worker`. Deploy with `npm run cf:migrate` followed by `npx wrangler deploy`. The GitHub production branch is `main`. The Worker uses `wrangler.jsonc`, the `DB` binding to `v-learning-sms-db` and its `ASSETS` binding to the Vite output directory `dist`.

Do not use the previous Node/JSON backend or the original Rainbow House database. No initial passwords, real data or private API keys are included in the source. A fresh deployment requires applying every numbered migration in order.

## Learning integration

In the Cloudflare Pages production settings for `v-learning-uganda-app`, bind `SCHOOL_DB` to the existing `v-learning-sms-db`. Preserve the learning platform's `DB`, private `MEDIA` bucket and `ADMIN_PASSWORD` secret. Redeploy Pages after binding changes.

The learning API stores the original learner/score and an outbox event together in its existing D1 transaction. It then applies that event to the school database. If the school connection fails, the original account and marks remain saved and the queued event is retried on learner-session requests and from the administrator dashboard. **Sync saved records** backfills existing accounts and quiz attempts in bounded batches and retries pending events. No third-party messages or email are sent by synchronization.

School student IDs derive from the platform's stable learner ID, never a name match. School, class, phone and email are the values actually supplied by the learner. Unknown dates of birth, gender and guardian details stay blank. Contact details are private to authenticated administrators. Passwords, recovery codes and session secrets never enter synchronized records.

Every quiz attempt has a unique result ID and a unique learner/submission pair. Repeated delivery is safe. Different attempts remain separate, with actual correct answers, total questions and percentage. Practice scores are shown under **Online learning**, separate from school term-exam marks; no fabricated BOT/MOT/EOT values are generated.

## Administrator access

Sign in to the existing learning administrator dashboard and choose **Open school management**. The server issues a one-use 60-second code in a URL fragment; the school exchanges it for an HttpOnly, Secure, SameSite=Strict staff session and removes the fragment. Codes and session tokens are stored only as hashes. The school rechecks the active staff role on every request. Staff username/password sign-in remains available for staff accounts created by the administrator. There is no public administrator registration and public student/marks synchronization endpoints reject writes.

The owner account is created only through a verified learning-administrator session. The learning administrator password stays on the learning platform. Optional email sign-in requires private `SESSION_SECRET` and `RESEND_API_KEY` secrets plus a verified `EMAIL_FROM`; password/owner access does not require email delivery.

## Validation

The Worker test covers empty initial data, private records, rejection of public sync writes, one-use owner access, cross-origin write rejection and session revocation. The learning repository separately tests durable registration/quiz synchronization, duplicate delivery, same-name students, secondary classes and outbox recovery.
