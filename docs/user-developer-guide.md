# User + Developer Guide

This combined guide provides both end-user workflows and developer setup details for quick onboarding.

## Part A: User Guide

### Roles and Access

- Admin, Manager: Full access to the dashboard and modules.
- Cashier, Pharmacist, Other: POS-only access.

### Key Tasks

- Login: role-based routing directs staff to POS or Dashboard.
- POS: search items, add quantities, complete sale.
- Products: add products and manage stock batches.
- Suppliers: create suppliers, search and view details.
- Purchase Orders: create and view POs.
- Customers: register customers and track activity.

### Password Reset

1. Click “Forgot Password?”
2. Enter the account email.
3. Open the reset link in your email and set a new password.

## Part B: Developer Guide

### Local Setup

Backend:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd pharmacy-ui
npm install
npm run dev
```

### Environment Variables

- DB: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Auth: `SECRET_KEY`
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_SENDER`
- Reset links: `FRONTEND_BASE_URL`

### Password Reset API

- `POST /password-reset/request` (form: `email`)
- `POST /password-reset/confirm` (form: `token`, `new_password`)

### Notes

- If DB is already initialized, create the password reset token table manually or via migration.
- UI uses JWT `role` claim for route gating; users should re-login after updates.
