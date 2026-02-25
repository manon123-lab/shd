# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui

---

## Progressive Web App (PWA) Setup

Follow these steps to turn the site into a PWA:

1. **HTTPS or localhost** – PWAs require HTTPS in production; `localhost` works for testing.
2. **Manifest** – a `manifest.json` file already exists at the project root with the app named **Smart Food Donation** (short name "SFD").
3. **App icons** – provide two PNGs at the root or in `public/`:
   * `icon-192.png` (192×192)
   * `icon-512.png` (512×512)
   Use any graphic editor (Canva/Figma/Photoshop) to crop the logo; the sample in this repo uses a generic placeholder.
4. **HTML linkage** – `index.html` includes `<link rel="manifest" href="/manifest.json">` and `<meta name="theme-color" content="#000000">`.
5. **Service worker** – a simple `service-worker.js` is included. It caches `/` and `/index.html`; feel free to expand the cache list or change the strategy.
6. **Registration** – a script at the bottom of `index.html` registers the service worker when the page loads.

Once configured, visit the site in Chrome/Edge/Firefox and you should see an "Install"/"Add to Home screen" banner. Clear the cache if you're still seeing the old heart icon in the tab.
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
