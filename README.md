# Meal ordering app for restaurant
![demo](public/meal-order-app-demo_out.gif)

## Description
This app is ordering meals app for restaurant. It will help for servers to take orders. Restaurants owner is able to manage menu items and details.

## Motivated
The purpose of this app is to be familiar with GraphQl and Zustand.

## What I used 
### Frontend ([package.json](https://github.com/ryoosukesaito/Meal-ordering-app/blob/main/package.json))
- image uploading
  - [Next cloudinary](https://www.npmjs.com/package/next-cloudinary)([How to use with React](https://www.mridul.tech/blogs/how-to-upload-images-to-cloudinary-with-react-js))
- [firebase](https://firebase.google.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

### Backend ([package.json](https://github.com/ryoosukesaito/Meal-ordering-app/blob/main/backend/package.json))
- [firebase admin sdk](https://firebase.google.com/docs/admin/setup)
- [GraphQL](https://www.freecodecamp.org/news/how-to-use-typescript-with-graphql/)


## Getting Started
Clone the repo,and update environment variables in `.env` and/or `.env.local` file, and need to add [firebase adminSDK](https://firebase.google.com/docs/admin/setup) in ./backend:


```bash
$ git clone https://github.com/ryoosukesaito/Meal-ordering-app.git
```
<br/>

```bash
# Set your own environment variables

## Frontend 
NEXT_PUBLIC_SERVER_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_KEY=
NEXT_PUBLIC_CLOUDINARY_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

NEXT_PUBLIC_FB_APP_KEY=
NEXT_PUBLIC_FB_AUTH_DOMAIN=
NEXT_PUBLIC_FB_PROJECT_ID=
NEXT_PUBLIC_FB_STORAGE_BUCKET=
NEXT_PUBLIC_FB_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FB_APP_ID=

## backend 
PORT=4000
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


