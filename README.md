# Social dept finances
A full stack next.js App Router typesafe typescript application

## Project Overview
The selected topic for this app is Finances, focusing on handling transactions across different categories. This showcases basic functionality for both the frontend and backend layers.
- Users can create, view, and manage financial transactions.
- Transactions are organized by categories and types ("income" | "expense").
- The backend uses handler functions for API routes to implement a RESTful API, promoting clear separation of concerns and making it easy to consume from the frontend.
- The use of interfaces in the repository layer allows easy mocking for testing database interactions without relying on a real database.

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

Using Drizzle:

```bash
pnpm drizzle-kit push
```

Or, generate and apply migrations:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

Create categories
```bash
pnpm run seed:categories
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

## 🛠 Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Create production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

---

# Example
App deployed using vercel, open [social-dept-finances](https://social-dept-xi.vercel.app/)

## Useful links
- [NestJS](https://nextjs.org/)
- [clerk](https://clerk.com/)
- [shadcn](https://ui.shadcn.com/)
- [drizzle](https://orm.drizzle.team/)
- [vercel](https://vercel.com/)