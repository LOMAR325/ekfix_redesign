import { afterEach, describe, expect, it, vi } from "vitest";
import { isDraftPreview, isPublished, published, routable } from "@/lib/publish";

// spec §1: one visibility rule. Search-facing layers use published()/isPublished() —
// drafts never, not even in dev; routes use routable() — drafts render only in `next dev`.

const draft = { status: "draft" as const, id: "a" };
const live = { status: "published" as const, id: "b" };

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("published / isPublished", () => {
  it("keeps only published items, in their original order", () => {
    const later = { status: "published" as const, id: "c" };
    expect(published([live, draft, later]).map((x) => x.id)).toEqual(["b", "c"]);
    expect(isPublished(draft)).toBe(false);
    expect(isPublished(live)).toBe(true);
  });

  it("ignores NODE_ENV — a draft is never published, even in dev", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(published([draft])).toEqual([]);
    expect(isPublished(draft)).toBe(false);
  });
});

describe("routable", () => {
  it("in production only a published item gets a route", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(routable(draft)).toBe(false);
    expect(routable(live)).toBe(true);
  });

  it("in next dev a draft is routable (owner preview)", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(routable(draft)).toBe(true);
  });
});

describe("isDraftPreview", () => {
  it("is true only for a draft rendered in dev", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(isDraftPreview(draft)).toBe(true);
    expect(isDraftPreview(live)).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    expect(isDraftPreview(draft)).toBe(false);
  });
});
