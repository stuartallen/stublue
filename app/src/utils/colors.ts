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
};

export type ColorCacheEntry = {
  closestNamedHex: string;
  distance: number;
  exactMatchName: boolean;
  value: string;
  r: number;
  g: number;
  b: number;
};

const SLCache: Record<string, ColorCacheEntry> = {};

const getColorsBySL = async (
  saturation: number,
  luminance: number
): Promise<ColorCacheEntry> => {
  const cacheKey = `S:${saturation}-L:${luminance}`;
  if (!SLCache[cacheKey]) {
    const result = await fetchByHSL(200, saturation, luminance);

    let closestNamedHex: string | undefined;
    let distance: number | undefined;
    let exactMatchName: boolean | undefined;
    let value: string | undefined;
    let r: number | undefined;
    let g: number | undefined;
    let b: number | undefined;

    if (result) {
      closestNamedHex = `${result?.name?.closest_named_hex}`;
      distance = result?.name?.distance;
      exactMatchName = result?.name?.exact_match_name;
      value = result?.name?.value;
      r = result?.rgb?.r;
      g = result?.rgb?.g;
      b = result?.rgb?.b;
    }

    if (
      !result ||
      !closestNamedHex ||
      !distance ||
      !(exactMatchName === true || exactMatchName === false) ||
      !value ||
      !r ||
      !g ||
      !b
    ) {
      throw new Error("failed to retrieve color");
    }

    SLCache[cacheKey] = {
      closestNamedHex,
      distance,
      exactMatchName,
      value,
      r,
      g,
      b,
    };
  }
  return SLCache[cacheKey];
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
