# Stublue

Stublue is a color scheme generator website where a user can select schemes based on the S & L values from HSL colorspace (H = hue, S = saturation, L = ✨luminance✨). The website uses [thecolorapi](https://www.thecolorapi.com/), but uses strategies like caching/sessionStorage and and algorithms to minimize API calls.

# Tech Stack

- Vue (Frontend framework)
- Vite (Dev framework for Vue)
- Typescript (Stronger typing than javascript)
- ESLint (Avoiding committing garbage)
- Prettier (Avoid committing ugly non-garbage)

# Limiting API calls

1. The most trivial way to limit api calls is to cache the results for a given S & L value.
2. Also a trivial way to limit api calls is to store the cache in sessionStorage.
3. Algorithm explanation will go here

# Quick Start

```bash
# npm
npm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

# Attributions:

- Color Wheel favicon is from [Freepik on FlatIcon](https://www.flaticon.com/free-icon/color-wheel_2919733)
