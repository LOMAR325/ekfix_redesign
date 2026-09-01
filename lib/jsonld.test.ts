import { describe, expect, it } from "vitest";
import { business } from "@/data/business";
import { reviews } from "@/data/reviews";
import { commercialServices } from "@/data/b2b-segments";
import { services } from "@/data/services";
import {
  aggregateRatingJsonLd,
  businessJsonLd,
  serviceJsonLd,
} from "@/lib/jsonld";

// Seam 3 (spec.md §"Швы для тестов" #3): the business/service JSON-LD builders must
// carry the canonical NAP from data/, not the old per-page "EK Global Appliance Repair — City"
// strings, and AggregateRating must be derived from the real reviews list.

describe("businessJsonLd()", () => {
  it("uses the bare business name, not a city-suffixed variant", () => {
    expect(businessJsonLd().name).toBe("EK Global");
  });

  it("carries the E.164 phone number as a literal", () => {
    // Literal, not `business.phoneE164` — the same expression the builder assigns,
    // so a hardcoded/invented number would slip past that. Keep in sync with data/business.
    expect(businessJsonLd().telephone).toBe("+1-980-371-4319");
    expect(business.phoneE164).toBe("+1-980-371-4319");
  });

  it("mirrors data/business.areaServed exactly, capped at 20 zones", () => {
    const areaServed = businessJsonLd().areaServed;
    // Literal length + first element: this stays red if the builder ever emits an
    // invented city or a hardcoded list rather than reflecting the data layer.
    expect(areaServed).toHaveLength(20);
    expect(areaServed[0]).toEqual({ "@type": "City", name: "Charlotte, NC" });
    expect(business.areaServed[0]).toBe("Charlotte, NC");
    expect(areaServed.map((city) => city.name)).toEqual(business.areaServed);
  });

  it("advertises the four commercial services via knowsAbout", () => {
    expect(businessJsonLd().knowsAbout).toEqual(commercialServices);
    expect(businessJsonLd().knowsAbout).toHaveLength(4);
  });

  it("embeds the aggregate rating", () => {
    // Literal, not `aggregateRatingJsonLd()` — that is the exact expression the builder
    // inlines, so it could never catch a drift. 5 stars over the 6 real reviews.
    expect(businessJsonLd().aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 5,
      reviewCount: 6,
    });
  });
});

describe("aggregateRatingJsonLd()", () => {
  it("counts the real reviews, not the marketing badge", () => {
    expect(aggregateRatingJsonLd().reviewCount).toBe(reviews.length);
    expect(reviews.length).toBe(6);
  });
});

describe("serviceJsonLd(service)", () => {
  it("names the provider 'EK Global' with no suffix", () => {
    expect(serviceJsonLd(services[0]).provider.name).toBe("EK Global");
  });

  it("derives serviceType from the service name", () => {
    expect(serviceJsonLd(services[0]).serviceType).toBe("Refrigerator Repair");
  });
});
