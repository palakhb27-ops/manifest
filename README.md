# Manifest - Manifest your growth with us

Web platform for entrepreneurs: AI Business Advisor, Expert Q&A Forum, Market Research.

## Structure
- `index.html` - landing page (home)
- `registration.html` - login | `signup.html` - sign up | `forgetpassword.html` - password reset | `login.html` - alternate combined login/signup
- `domainform.html` - business information form
- `AI.html` - AI Business Advisor (demo, rule-based in browser)
- `qa.html` - Expert Q&A forum (demo, shown on page only)
- `chatbot.html` + `script.js` - chatbot (calls `/api/chat` if a backend exists, otherwise built-in answers)
- `contact.html` - query / contact page (form is a demo until a backend exists)
- `404.html` - error page (set as the custom error response in CloudFront)
- `images/` - local images, `docs/` - project presentation

## Deploy on AWS (S3 + CloudFront)
1. Create an S3 bucket and upload everything except `docs/` and `README.md`.
2. Create a CloudFront distribution: origin = the bucket, Origin Access Control, default root object `index.html`, redirect HTTP to HTTPS.
3. Paste the bucket policy CloudFront suggests into the bucket permissions.
4. Open the CloudFront URL.

## Notes
- Login/sign-up forms no longer put passwords in the URL; they are demo-only until a backend exists.
- `domainform.html` answers are kept in the browser tab (sessionStorage) and pre-fill `AI.html`.
- `qa.html` stores questions in the visitor's own browser (localStorage) only.

## Not yet implemented (needs a backend, e.g. Node.js on EC2)
Real authentication, saving forms to a database, real AI answers (/api/advisor, /api/chat), forum storage and voting.
