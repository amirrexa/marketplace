# 🛍️ Digital Marketplace (Next.js + Supabase)

A **minimalistic** full-stack marketplace for **physical product display** built using modern Next.js 15 features and Supabase.

---

## 🚀 Features

- 🔐 JWT-based authentication (custom login/register)
- 🧑‍💼 Role-based access: Buyer / Seller / Admin
- 📦 Sellers can upload & manage product listings (image + info)
- 🛒 Buyers can browse, add to cart, and request products
- ✉️ Confirmation modals for actions (e.g., request, delete)
- ☁️ Supabase used for file/image storage (public bucket)
- 🧠 Protected routes via middleware
- 🍪 Auth persisted using secure HTTP-only cookies
- 📦 Product data stored in PostgreSQL (via Prisma)
- 💅 Beautiful UI using Tailwind CSS + shadcn/ui
- 🧪 Fully client/server split via App Router

---

## 📁 Tech Stack

| Purpose       | Stack                        |
|---------------|------------------------------|
| Frontend      | Next.js 15 (App Router)      |
| Backend       | API Routes + Prisma ORM      |
| Auth          | JWT + `jose` + Cookies       |
| DB            | PostgreSQL (via Supabase)    |
| Storage       | Supabase Buckets             |
| UI            | Tailwind CSS + shadcn/ui     |
| State         | Jotai + localStorage         |
| Toasts        | `sonner`                     |

---

## ⚙️ Project Structure (Simplified)

```
/app
  /login, /register        → Auth pages
  /dashboard
    /buyer                 → Browse & request products
    /seller                → Upload/manage products
    /buyer/cart            → Cart logic via Jotai + localStorage
  /api
    /auth                  → login/register logic (JWT cookie)
    /products              → CRUD for seller-uploaded products
    /orders                → POST orders by buyers
/lib
  prisma.ts, auth.ts       → Prisma client, JWT helpers
/components
  ui/                      → shadcn-based inputs, buttons
  dashboard/               → shared components (e.g. ConfirmModal)
```

---

## 🧪 Roles Overview

- **BUYER**: Can only view products, request items
- **SELLER**: Can create, update, and delete their own products
- **ADMIN**: Can access everything (TODO)

---

## 🛠️ How to Run Locally

```bash
git clone https://gitlab.com/yourname/digital-marketplace
cd digital-marketplace
cp .env.example .env.local  # set up your Supabase credentials
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

---

## 🧾 Notes

- Set your Supabase storage bucket to **public**
- JWT is signed/verified using `jose` instead of `jsonwebtoken` (Edge-compatible)
- All protected routes are checked via middleware using the `role` in JWT payload

---

## 📦 Production Deployment

- Hosted on **Vercel**
- Add `npx prisma generate` in `build` script to avoid client issues
- Configure Supabase secrets in Vercel dashboard

---

## 🧠 Author

Developed by **@amirrezakh123**  
Feel free to fork, contribute or customize!
