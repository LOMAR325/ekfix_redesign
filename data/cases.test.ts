import { describe, expect, it } from "vitest";
import { cases } from "./cases";
import { towns } from "./towns";
import type { RepairCase } from "./types";

// Data invariants for repair cases (story 75, seam 6): only the template's fields — never a
// customer name or address — and `area` is a known town/area slug. `cases` is empty until
// real cases are confirmed, so each test pushes a violating fixture (and removes it) to
// prove the check catches it.

function withPushed<T>(list: T[], item: T, run: () => void) {
  list.push(item);
  try {
    run();
  } finally {
    list.splice(list.indexOf(item), 1);
  }
}

const TEMPLATE_FIELDS = new Set([
  "status",
  "slug",
  "title",
  "appliance",
  "model",
  "symptom",
  "diagnosis",
  "failedComponent",
  "repair",
  "parts",
  "result",
  "area",
  "technician",
  "serviceSlug",
]);

const fixture = (over: Partial<RepairCase> = {}): RepairCase => ({
  status: "draft",
  slug: "fixture-case",
  title: "Fixture case",
  appliance: "Refrigerator",
  symptom: "Symptom.",
  diagnosis: "Diagnosis.",
  failedComponent: "Component",
  repair: "Repair.",
  parts: ["Part"],
  result: "Result.",
  area: "charlotte",
  serviceSlug: "refrigerator",
  ...over,
});

/** Fields outside the template (a customer name/address would land here). */
const foreignFields = (): string[] =>
  cases.flatMap((c) =>
    Object.keys(c)
      .filter((k) => !TEMPLATE_FIELDS.has(k))
      .map((k) => `${c.slug}: ${k}`),
  );

/** `area` that is not a data/towns slug. */
const unknownAreas = (): string[] => {
  const slugs = new Set(towns.map((t) => t.slug));
  return cases.filter((c) => c.area !== undefined && !slugs.has(c.area)).map((c) => c.slug);
};

describe("repair cases", () => {
  it("carry only template fields (no customer name/address)", () => {
    expect(foreignFields()).toEqual([]);
    const withCustomer: RepairCase = Object.assign(fixture(), {
      customerName: "Jane Doe",
      address: "1 Main St",
    });
    withPushed(cases, withCustomer, () =>
      expect(foreignFields()).toEqual(["fixture-case: customerName", "fixture-case: address"]),
    );
  });

  it("name an area only by a data/towns slug", () => {
    expect(unknownAreas()).toEqual([]);
    withPushed(cases, fixture(), () => expect(unknownAreas()).toEqual([]));
    withPushed(cases, fixture({ area: "nowhere-town" }), () =>
      expect(unknownAreas()).toEqual(["fixture-case"]),
    );
  });
});
