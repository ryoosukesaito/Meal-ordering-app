This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
Clone the repo,and update environment variables in `.env` and/or `.env.local` file:
```bash
$ git clone https://github.com/ryoosukesaito/Meal-ordering-app.git
```

### set up a frontend server
- install package to type &nbsp;<kbd>npm install</kbd>
- Then type the below command after &nbsp;<kbd>npm run</kbd>&nbsp; or <kbd>yarn</kbd>&nbsp;

```bash
"dev": "next dev",
"build": "next build", 
"start": "next start",
"lint": "eslint ." 
"lint:fix": "eslint --fix",
"format": "npx prettier --write \"src/**/*.{ts,tsx}\" && eslint --fix --ext \"src/**/*.{ts,tsx}\"" 
```

### set up a backend server
```bash
$ cd backend
$ npm install && npm run dev
```


## Initializing the application
```bash
✔ What is your project named? … frontend
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? …  Yes
✔ Would you like to use Tailwind CSS? …  Yes
✔ Would you like to use `src/` directory? …  Yes
✔ Would you like to use App Router? (recommended) … No
✔ Would you like to customize the default import alias? … Yes
✔ What import alias would you like configured? … @/*
```


## What I used

- image uploading
  Next cloudinary [ref](https://www.npmjs.com/package/next-cloudinary) , [How to use with React](https://www.mridul.tech/blogs/how-to-upload-images-to-cloudinary-with-react-js)
- firebase
- Zustand [ref](https://docs.pmnd.rs/zustand/getting-started/introduction)
- 