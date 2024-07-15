//  These should always be defined from the API but just programming defensively
type ColorResponse = {
  name?: {
    closest_named_hex?: string;
    distance?: number;
    exact_match_name?: boolean;
    value?: string;
  };
  rgb?: {
    r?: number;
    g?: number;
    b?: number;
  };
  hsl?: {
    h?: number;
  };
};

export type ColorCacheEntry = {
  closestNamedHex: string;
  distance: number;
  exactMatchName: boolean;
  value: string;
  r: number;
  g: number;
  b: number;
  //  We should sort by hue so colors appear in ROY G BIV order
  h: number;
};

const SLCache: Record<string, ColorCacheEntry[]> = {};
const HSLCache: Record<string, ColorCacheEntry> = {};

// Not used in final implementation, but worth keeping around for reference
const bruteForceGetColorsBySL = async (
  saturation: number,
  luminance: number,
  pushToLoadingColors: (newColors: ColorCacheEntry) => void
): Promise<ColorCacheEntry[]> => {
  const cacheKey = `S:${saturation}-L:${luminance}`;
  if (!SLCache[cacheKey]) {
    const loadedColors: ColorCacheEntry[] = [];

    for (let hue = 0; hue < 360; hue += 1) {
      try {
        const hsl = await getColorByHSL(hue, saturation, luminance);

        if (
          loadedColors.length <= 0 ||
          hsl.closestNamedHex !==
            loadedColors[loadedColors.length - 1]?.closestNamedHex
        ) {
          loadedColors.push(hsl);
          pushToLoadingColors(hsl);
        }
      } catch (error) {
        throw new Error("Error fetching pallette");
      }
    }
    SLCache[cacheKey] = loadedColors;
  }

  return SLCache[cacheKey];
};

const getColorByHSL = async (
  h: number,
  s: number,
  l: number
): Promise<ColorCacheEntry> => {
  const cacheKey = `H:${h}-S:${s}-L:${l}`;
  if (!HSLCache[cacheKey]) {
    const result = await fetchByHSL(h, s, l);

    let closestNamedHex: string | undefined;
    let distance: number | undefined;
    let exactMatchName: boolean | undefined;
    let value: string | undefined;
    let r: number | undefined;
    let g: number | undefined;
    let b: number | undefined;
    let hue: number | undefined;

    if (result) {
      closestNamedHex = `${result?.name?.closest_named_hex}`;
      distance = result?.name?.distance;
      exactMatchName = result?.name?.exact_match_name;
      value = result?.name?.value;
      r = result?.rgb?.r;
      g = result?.rgb?.g;
      b = result?.rgb?.b;
      hue = result?.hsl?.h;
    }

    if (
      !result ||
      !closestNamedHex ||
      !(distance || distance === 0) ||
      !(exactMatchName === true || exactMatchName === false) ||
      !value ||
      !(r || r === 0) ||
      !(g || g === 0) ||
      !(b || b === 0) ||
      !(hue || hue === 0)
    ) {
      throw new Error("failed to retrieve color");
    }

    HSLCache[cacheKey] = {
      closestNamedHex,
      distance,
      exactMatchName,
      value,
      r,
      g,
      b,
      h: hue,
    };
  }
  return HSLCache[cacheKey];
};

const fetchByHSL = async (
  h: number,
  s: number,
  l: number
): Promise<ColorResponse | false> => {
  if (process.env.VUE_APP_COLOR_ENDPOINT) {
    const response = await fetch(
      `https://www.thecolorapi.com/id?hsl=(${h},${s},${l})`
    );
    if (response.status !== 200) {
      console.error("Failed to fetch color", response);
      return false;
    }
    const result = await response.json();
    return result;
  }

  console.error("No endpoint configured");
  return false;
};

//  Perform a binary search to find where a color name transitions for a given name
const getColorTransition = async (
  colorName: string,
  saturation: number,
  luminance: number,
  hMin: number,
  hMax: number
): Promise<(ColorCacheEntry & { hueBoundary: number }) | null> => {
  while (hMin <= hMax) {
    const hMid = Math.floor((hMin + hMax) / 2);
    const colorEntry = await getColorByHSL(hMid, saturation, luminance);

    // if the color name matches, we have not gone far enough
    if (colorEntry.value === colorName) {
      hMin = hMid + 1;
      //  If the color name does not match
    } else {
      //  If the hue one less than the midpoint matches, we have found the boundary
      const oneHueLessEntry = await getColorByHSL(
        hMid - 1,
        saturation,
        luminance
      );
      if (oneHueLessEntry.value === colorName) {
        return { hueBoundary: hMid, ...colorEntry };
      }
      //  Otherwise, we have gone too far
      hMax = hMid - 1;
    }
  }

  return null;
};

//  Safe guard to prevent infinite while loop
const MAX_ITERATIONS = 360;

const getColorsBySL = async (
  saturation: number,
  luminance: number,
  pushToLoadingColors: (newColors: ColorCacheEntry) => void
): Promise<ColorCacheEntry[]> => {
  const cacheKey = `S:${saturation}-L:${luminance}`;
  if (!SLCache[cacheKey]) {
    const loadedColors: ColorCacheEntry[] = [];
    const hueBoundaries: (ColorCacheEntry & { hueBoundary: number })[] = [];

    const initialColor = await getColorByHSL(0, saturation, luminance);
    loadedColors.push(initialColor);
    hueBoundaries.push({ hueBoundary: 0, ...initialColor });
    let i = 0;

    //  Find the hue boundaries for each color
    while (
      i === 0 ||
      (i < MAX_ITERATIONS &&
        hueBoundaries[hueBoundaries.length - 1].value !== initialColor.value)
    ) {
      i++;
      const lastBoundary = hueBoundaries[hueBoundaries.length - 1];
      const nextBoundary = await getColorTransition(
        lastBoundary.value,
        saturation,
        luminance,
        lastBoundary.hueBoundary + 1,
        359
      );
      if (nextBoundary) {
        hueBoundaries.push(nextBoundary);
        if (nextBoundary.value !== initialColor.value) {
          loadedColors.push(nextBoundary);
          pushToLoadingColors(nextBoundary);
        }
      }
    }

    SLCache[cacheKey] = loadedColors;
  }
  return SLCache[cacheKey];
};

export default getColorsBySL;
export { bruteForceGetColorsBySL };
