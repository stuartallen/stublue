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
  //  We should sort by hue so colors appear in ROYGBIV order
  h: number;
};

const SLCache: Record<string, ColorCacheEntry[]> = {};
const HSLCache: Record<string, ColorCacheEntry> = {};

const getColorsBySL = async (
  saturation: number,
  luminance: number,
  pushToLoadingColors: (newColors: ColorCacheEntry) => void
): Promise<ColorCacheEntry[]> => {
  const cacheKey = `S:${saturation}-L:${luminance}`;
  if (!SLCache[cacheKey]) {
    const loadedColors: ColorCacheEntry[] = [];

    for (let hue = 0; hue < 360; hue += 10) {
      try {
        const hsl = await getColorByHSL(hue, saturation, luminance);

        if (
          loadedColors.length <= 0 ||
          hsl.closestNamedHex !==
            loadedColors[loadedColors.length - 1]?.closestNamedHex
        ) {
          console.log("updating loaded colors");
          loadedColors.push(hsl);
          pushToLoadingColors(hsl);
        }
      } catch (error) {
        throw new Error("Error fetching pallete");
      }
    }
    SLCache[cacheKey] = loadedColors;
  }

  console.log("returning cache", SLCache[cacheKey]);
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
      !distance ||
      !(exactMatchName === true || exactMatchName === false) ||
      !value ||
      !r ||
      !g ||
      !b ||
      !(hue || hue === 0)
    ) {
      console.log("failed to retrieve color");
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
      return false;
    }
    const result = await response.json();
    return result;
  }

  console.error("No endpoint configured");
  return false;
};

export default getColorsBySL;
