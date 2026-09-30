import { business } from "@/data/business";
import { site } from "@/data/site";
import type { ReviewsData } from "@/lib/google-reviews";
import { ChipRow } from "./chip-row";

// Under a reviews section: "All reviews on Google →" (the Business Profile) and "Leave a review →",
// plus the Google Maps attribution when the reviews shown came from Google (Places API policy).
export function GoogleReviewLinks({ data, style }: { data: ReviewsData; style?: React.CSSProperties }) {
  const copy = site.googleReviews;
  return (
    <div style={{ marginTop: 24, ...style }}>
      <ChipRow
        items={[
          { label: copy.all, href: business.social.google },
          { label: copy.leave, href: business.google.writeReviewUrl },
        ]}
      />
      {data.source === "google" && (
        <p style={{ margin: "14px 0 0", fontSize: 13, color: "var(--text-dark-60)" }}>{copy.attribution}</p>
      )}
    </div>
  );
}
