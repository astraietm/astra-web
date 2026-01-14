# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Supported Domains
- https://astraietm.in
- https://api.astraietm.in

## Reporting a Vulnerability

We take the security of our systems seriously. If you believe you have found a security vulnerability in the ASTRA project, please report it to us as described below.

**Do not report security vulnerabilities through public GitHub issues.**

### How to Report

Please send an email to **security@astraietm.in** with the following details:

- A description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact.
- Any proof-of-concept code or screenshots.

We will acknowledge your report within 48 hours and provide an estimated timeline for resolution.

## Disclosure Policy

- We ask that you do not disclose the vulnerability to the public until we have had reasonable time to fix it.
- We will notify you when the vulnerability is fixed.
- We appreciate your help in making our software more secure and will credit you for your discovery if you wish.

## Security Best Practices for Developers

- **Never commit secrets**. Use `.env` files and ensure they are git-ignored.
- **Rotate secrets** immediately if you suspect a leak.
- **Review dependencies** regularly for vulnerabilities using `npm audit` or `pip check`.
