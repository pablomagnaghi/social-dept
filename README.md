# Getting Started with This Next.js 15 App (Using pnpm)

This project is built using **Next.js 15**, **pnpm**, **TypeScript**, and includes common configurations like **Tailwind CSS**, **ShadCN**, **Clerk Authentication**, and **Drizzle ORM**.

---

## 🚀 Quickstart

### 1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. **Install dependencies**

```bash
pnpm install
```

### 3. **Environment Variables**

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_postgres_url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Replace values with your actual environment secrets.

### 4. **Run database migrations (if applicable)**

If you're using Drizzle:

```bash
pnpm drizzle-kit push
```

Or, generate and apply migrations:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

### 5. **Run the development server**

```bash
pnpm dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Tech Stack

* **Next.js 15** (App Router)
* **pnpm** (fast package manager)
* **Tailwind CSS** for styling
* **ShadCN UI** for accessible components
* **Drizzle ORM** for database access
* **Clerk** for authentication

---

## 📂 Common Directories

```bash
/src
  /app              # App router pages
  /components       # Reusable components
  /api              # Server-side API handlers
  /db               # Drizzle config and schema
  /hooks            # Custom React hooks
  /styles           # Tailwind CSS and global styles
```

---

## 🛠 Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Create production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

---

## 🧪 Troubleshooting

* **CSS not working?**

  * Make sure Tailwind is set up correctly in `postcss.config.js` and `tailwind.config.ts`

* **Clerk server error?**

  * Verify your Clerk keys and make sure you're using `server-only` in server components

* **Relative fetch fails in Server Component?**

  * Use `process.env.NEXT_PUBLIC_SITE_URL` to build absolute URLs

---
