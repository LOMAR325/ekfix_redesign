import { afterEach, describe, expect, it, vi } from "vitest";
import { getReviews } from "@/lib/google-reviews";

// Reviews source (owner, 2026-09-30): Google through the Places API when the key is set, the
// site's own reviews otherwise — and on any Google failure.

const place = {
  rating: 4.9,
  userRatingCount: 27,
  reviews: [
    {
      rating: 5,
      text: { text: "Fixed our walk-in the same day." },
      relativePublishTimeDescription: "2 weeks ago",
      authorAttribution: { displayName: "Jane R.", uri: "https://www.google.com/maps/contrib/1" },
    },
    { rating: 4, text: { text: "" }, authorAttribution: { displayName: "No Text" } },
  ],
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getReviews", () => {
  it("without GOOGLE_PLACES_API_KEY: the site's reviews, no request", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const data = await getReviews();
    expect(data.source).toBe("site");
    expect(data.rating).toEqual({ value: 5, count: 6 });
    expect(data.reviews).toHaveLength(6);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("with the key: Place Details of the business's Place ID, mapped; a review without text dropped", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(place), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const data = await getReviews();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit & { next: { revalidate: number } }];
    expect(url).toBe("https://places.googleapis.com/v1/places/ChIJ8zG7gctrMWQRDNuk6H3xUnY?languageCode=en");
    expect(init.headers).toEqual({ "X-Goog-Api-Key": "test-key", "X-Goog-FieldMask": "rating,userRatingCount,reviews" });
    expect(init.next.revalidate).toBe(86400);
    expect(data).toEqual({
      source: "google",
      rating: { value: 4.9, count: 27 },
      reviews: [
        {
          author: "Jane R.",
          detail: "2 weeks ago",
          text: "Fixed our walk-in the same day.",
          rating: 5,
          authorUrl: "https://www.google.com/maps/contrib/1",
          relativeTime: "2 weeks ago",
        },
      ],
    });
  });

  it("an API error or a network failure falls back to the site's reviews", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("denied", { status: 403 })));
    expect((await getReviews()).source).toBe("site");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    expect((await getReviews()).source).toBe("site");
  });

  it("a place with no usable review falls back too", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ rating: 5, userRatingCount: 1, reviews: [] }))));
    expect((await getReviews()).source).toBe("site");
  });
});
