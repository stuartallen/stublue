# Stublue

Stublue is a color scheme generator website where a user can select schemes based on the S & L values from HSL colorspace (H = hue, S = saturation, L = ✨luminance✨). The website uses [thecolorapi](https://www.thecolorapi.com/), but uses strategies like caching and algorithms to minimize API calls.

# Tech Stack

- Vue (Frontend framework)
- Vite (Local development for Vue)
- Typescript (Stronger typing than javascript)
- ESLint (Avoid committing bad patterns)
- Prettier (Make the code look nice)

# Quick Start

```bash
git clone git@github.com:stuartallen/stublue.git
cd stublue/app/
npm install
npm run serve
```

# Important considerations

- How efficiently can the distinct names be determined? Can the number of API calls be reduced?

Let's assume the nearest named colors from thecolorapi always appear in a single contiguous chain with respect to hue. This is only an approximation of the actual implementation.

Instead of making 360 API calls for each S&L value, we can use the binary search algorithm to minimize these. At a high level we begin with the hue value 0, then only make API calls at binary search indices.

At each index if we detect the names of the color are the same our index is too small. If we detect the names of the color are different, let us check one hue value less. If the names still differ, our index is too large, otherwise we have found the boundary for a unique name.

We perform a new binary search start from a hue value one greater than the boundary. We repeat this process until we have found the boundary with the original color.

The number of API calls, is then of course limited 360 as we cache colors by their HSL value so there will be no repeat calls. This would be in the worst case where there is a unique name at every hue value.

In a typical case with C unique color names for a given saturation and luminance, the function that bounds our API calls is C\*log(360). If we wanted to be more or less specific about hue values than a single degree, we could replace 360 to different number of divisions of the color wheel.

Lastly, we also use an SL cache with all the colors stored so users can quickly see pallettes they've already generated.

- Do all colors need to be rendered at once?

Nope! While generating new colors, you can see them load in. You can see and manipulate your old pallette while you wait as well.

- When will the API calls be made?

API calls are made starting when the saturation and luminance form is submitted, and until all colors have loaded. Because the actions of a binary search depend on the value from each specific call, they are not made in parallel.

- What is the best user experience for selecting S and L values?

I opted for a simple HTML form with input restricted to numeric characters only. This way it is familiar to users with screen readers or users who require keyboard navigating.

- What sort of feedback will the user receive? How will loading times be handled?

When a user initially loads the page they will see the existing pallette load in. When they start loading a new pallette, they can copy info from their old pallette if they'd like to set it aside

# Attributions:

- I started from a [Vue/Vite Template](https://github.com/peshanghiwa/Vue3-Vite-Pinia-Tailwind-Typescript-Template), but found it unfortunately out of date and used the default Vite project setup.
- The color wheel favicon is from [Freepik on FlatIcon](https://www.flaticon.com/free-icon/color-wheel_2919733).
- A. Morel's answer to a [stack overflow thread](https://stackoverflow.com/questions/31706611/why-does-the-html-input-with-type-number-allow-the-letter-e-to-be-entered-in) about form validation.
