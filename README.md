# Stublue

Stublue is a color scheme generator website where a user can select schemes based on the S & L values from HSL colorspace (H = hue, S = saturation, L = ✨luminance✨). The website uses [thecolorapi](https://www.thecolorapi.com/), but uses strategies like caching/sessionStorage and and algorithms to minimize API calls.

# Tech Stack

I started from krskibin's [Nuxt project template](https://github.com/krskibin/nuxt3-template/tree/dev).

- Vue (Frontend framework)
- Nuxt (Making this easy to deploy and state/api management in addition to many other things)
- Typescript (Stronger typing than javascript)
- ESLint (Avoiding committing garbage)
- Prettier (Avoid committing ugly non-garbage)

# Limiting API calls

1. The most trivial way to limit api calls is to cache the results for a given S & L value.
2. Also a trivial way to limit api calls is to store the cache in sessionStorage.
3. Algorithm explanation will go here

# Quick Start

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
