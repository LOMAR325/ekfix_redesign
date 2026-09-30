import { describe, expect, it } from "vitest";
import {
  businessRequestHref,
  homeBookingHref,
  readBusinessPreset,
  readHomePreset,
} from "@/components/booking-link";

// Form presets in a URL (ADR 0023): the link a page builds is the one the form reads back;
// only real options of the form survive.

describe("booking links", () => {
  it("home: /appliance-repair[?appliance=…]#book and back", () => {
    expect(homeBookingHref()).toBe("/appliance-repair#book");
    const href = homeBookingHref({ appliance: "Stove / Range" });
    expect(href).toBe("/appliance-repair?appliance=Stove+%2F+Range#book");
    expect(readHomePreset(href.slice(href.indexOf("?"), href.indexOf("#")))).toEqual({ appliance: "Stove / Range" });
  });

  it("business: /commercial-appliance-repair[?type=…&equipment=…]#request and back", () => {
    expect(businessRequestHref()).toBe("/commercial-appliance-repair#request");
    const href = businessRequestHref({ businessType: "Restaurant", equipment: "Commercial Dishwasher" });
    expect(href).toBe("/commercial-appliance-repair?type=Restaurant&equipment=Commercial+Dishwasher#request");
    expect(readBusinessPreset("?type=Restaurant&equipment=Commercial+Dishwasher")).toEqual({
      businessType: "Restaurant",
      equipment: "Commercial Dishwasher",
    });
  });

  it("unknown values are ignored", () => {
    expect(readHomePreset("?appliance=Spaceship")).toEqual({ appliance: null });
    expect(readBusinessPreset("?type=Bank&equipment=Laser")).toEqual({ businessType: null, equipment: null });
    expect(readHomePreset("?as=Homeowner")).toEqual({ appliance: null });
  });
});
