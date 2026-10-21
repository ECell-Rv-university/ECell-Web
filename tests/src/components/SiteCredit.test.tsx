import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SiteCredit from "@/src/components/SiteCredit/SiteCredit";

describe("SiteCredit", () => {
  it("rewrites the credit on the second tap of the heart", () => {
    render(<SiteCredit />);
    const heart = screen.getByRole("button", { name: "Send love" });

    fireEvent.click(heart);
    expect(heart).toHaveAttribute("data-hint", "1 more");
    expect(screen.queryByText(/GOAT team/)).toBeNull();

    fireEvent.click(heart);
    expect(screen.getByText("by the GOAT tech team of ECell")).toBeInTheDocument();
    expect(heart).toHaveAttribute("data-hint", "you found it");
    expect(screen.getByRole("button", { name: "Send more love" })).toBeInTheDocument();
  });
});
