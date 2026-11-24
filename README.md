This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Rohobot API configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to the backend API base URL. The default is `https://heran.pythonanywhere.com/api/v1`. This URL is public configuration; never put credentials or tokens in a `NEXT_PUBLIC_` variable.

The account sign-in and candidate invitation registration flows use the Rohobot API through Next.js Route Handlers. Access and refresh tokens are stored only in HttpOnly cookies and are accepted only from successful backend responses. Demo account creation, demo OTPs, and trainer QR registration have been removed. Organization and trainer registration remain unavailable until their real backend contracts are integrated.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load the Geist font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



## Run locally

Run `npm run dev` to start the development server on http://localhost:3000.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
