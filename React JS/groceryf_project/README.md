# FreshCart - Grocery E‑Commerce Frontend

## Tech Stack

- React + Vite + TypeScript  
- Tailwind CSS  
- React Router DOM  
- Axios  
- TanStack React Query  
- Zustand  
- React Hook Form + Zod  
- Framer Motion  
- Lucide React  
- Sonner

## Setup & Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and adjust API URL if needed
cp .env.example .env
# edit .env and ensure:
# VITE_API_URL=http://localhost:8080

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

The app expects a backend running at `http://localhost:8080` with standard REST endpoints for auth, products, cart, and orders. Update `VITE_API_URL` if your backend runs on a different host or port.

## Features

✅ **Complete E-Commerce Functionality**
- Product browsing with search, filters, and categories
- Shopping cart with real-time updates
- Checkout with demo payment processing
- Order tracking with real-time status updates
- User authentication (Login/Register)
- Admin panel for product management

✅ **Production-Ready Features**
- Mock data fallbacks for offline/demo mode
- Real-time order status polling
- Responsive design (mobile-first)
- Smooth animations with Framer Motion
- Toast notifications
- Protected routes
- Error handling

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done ✅)
   ```bash
   git push origin main
   ```

2. **Deploy via Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository: `Code6r/myawsoutputs`
   - Set Root Directory to: `groceryf_project`
   - Add Environment Variable:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-url.com` (or leave default for demo mode)
   - Click "Deploy"

3. **Your app will be live at:** `https://your-project.vercel.app`

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Base directory: `groceryf_project`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable: `VITE_API_URL`
7. Deploy!

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## GitHub Repository

Your code is safely stored at:
**https://github.com/Code6r/myawsoutputs**

Branch: `2026-02-16-5w1d`

## Environment Variables

Create a `.env` file (or set in deployment platform):

```env
VITE_API_URL=http://localhost:8080
```

For production, update this to your backend API URL.