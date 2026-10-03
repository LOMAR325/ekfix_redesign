// Intrinsic pixel dimensions of every file in public/images/, measured with `sips`.
// next/image needs an explicit width/height (or `fill`); the shared UI components read
// the real aspect ratio from here so the CSS in app/globals.css (which only caps size —
// e.g. `.brand-cell img { max-height: 42px }`) keeps images undistorted and shift-free.
//
// Keys are the exact `src` strings stored in data/*.ts (e.g. "/images/thermador.webp").

export type Dimensions = { width: number; height: number };

export const imageDimensions: Record<string, Dimensions> = {
  "/images/ek-global-technician-rooftop-refrigeration-charlotte.webp": { width: 1280, height: 960 },
  "/images/ek-global-technician-commercial-washer-extractor.webp": { width: 1280, height: 960 },
  "/images/ek-global-technician-dry-cleaner-laundry.webp": { width: 1280, height: 960 },
  "/images/ek-global-technician-commercial-washer-portrait.webp": { width: 959, height: 1280 },
  "/images/ek-global-technician-commercial-rooftop.webp": { width: 1280, height: 960 },
  "/images/ek-global-technician-home-kitchen-call.webp": { width: 1280, height: 960 },
  "/images/ek-global-technician-home-laundry-hookup.webp": { width: 1280, height: 960 },
  "/images/ek-global-technician-control-boards-home.webp": { width: 960, height: 1280 },
  "/images/Amana.webp": { width: 800, height: 200 },
  "/images/Beverage_Air.webp": { width: 600, height: 170 },
  "/images/DCS.webp": { width: 750, height: 356 },
  "/images/Dacor.webp": { width: 625, height: 175 },
  "/images/Fisher_Paykel.webp": { width: 1000, height: 150 },
  "/images/GE.webp": { width: 1700, height: 550 },
  "/images/Haier.webp": { width: 640, height: 199 },
  "/images/Hotpoint.webp": { width: 500, height: 100 },
  "/images/JennAir.webp": { width: 1575, height: 375 },
  "/images/Kenmore_Logo.webp": { width: 960, height: 225 },
  "/images/LG.webp": { width: 1250, height: 547 },
  "/images/Middleby_Corporation.webp": { width: 1504, height: 120 },
  "/images/Perlick.webp": { width: 960, height: 260 },
  "/images/refrigerator-repair.webp": { width: 519, height: 804 },
  "/images/Scotsman.webp": { width: 450, height: 250 },
  "/images/Speed_Queen.webp": { width: 1100, height: 175 },
  "/images/SreetFair.png": { width: 675, height: 284 },
  "/images/Thor.webp": { width: 700, height: 204 },
  "/images/True.webp": { width: 625, height: 100 },
  "/images/U_line.webp": { width: 356, height: 95 },
  "/images/Viking.webp": { width: 1065, height: 350 },
  "/images/Wolf.webp": { width: 800, height: 260 },
  "/images/blodget.webp": { width: 2400, height: 600 },
  "/images/bosch.webp": { width: 1000, height: 230 },
  "/images/charlotte.webp": { width: 3900, height: 2200 },
  "/images/cooktop-repair.webp": { width: 1000, height: 1000 },
  "/images/copeland.webp": { width: 1000, height: 200 },
  "/images/dishwasher-repair.webp": { width: 1677, height: 2000 },
  "/images/washer-dryer-repair.webp": { width: 1240, height: 1722 },
  "/images/dryer-repair.webp": { width: 1000, height: 1000 },
  "/images/electrolux.webp": { width: 3840, height: 1000 },
  "/images/freezer-repair.webp": { width: 400, height: 1000 },
  "/images/frigidare.webp": { width: 1920, height: 300 },
  "/images/garbage-disposal-repair.webp": { width: 600, height: 1000 },
  "/images/girbau.webp": { width: 1000, height: 210 },
  "/images/google_logo.webp": { width: 1457, height: 909 },
  "/images/ek-global-technician-washer-repair-charlotte.webp": { width: 1578, height: 997 },
  "/images/hobart.webp": { width: 800, height: 200 },
  "/images/ice-maker-repair.webp": { width: 1000, height: 1000 },
  "/images/kitchen_aid.webp": { width: 920, height: 100 },
  "/images/ek-global-technician-commercial-laundry-charlotte.webp": { width: 1398, height: 1036 },
  "/images/ek-global-technician-restaurant-kitchen-charlotte.webp": { width: 1280, height: 960 },
  "/images/maytag.webp": { width: 1920, height: 400 },
  "/images/microwave-repair.webp": { width: 850, height: 850 },
  "/images/samsung.webp": { width: 1600, height: 532 },
  "/images/stove-repair.webp": { width: 1900, height: 1900 },
  "/images/sub_zero_logo.webp": { width: 1250, height: 280 },
  "/images/thermador.webp": { width: 2250, height: 400 },
  "/images/charlotte-area-town.webp": { width: 1500, height: 954 },
  "/images/whirlpool.webp": { width: 3300, height: 1400 },
  "/images/wine-cooler-repair.webp": { width: 1000, height: 1000 },
};

/** Real dimensions for `src`, or a neutral 4:3 fallback for anything not measured. */
export function imageDims(src: string): Dimensions {
  return imageDimensions[src] ?? { width: 1200, height: 900 };
}
