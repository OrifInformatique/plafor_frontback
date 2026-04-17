import React from "react";
import { render } from "@testing-library/react";
import ReportBar from "../ReportBar";
import skillsData from "../__fixtures__/skills-data.json";
import badData from "../__fixtures__/bad-data.json";

describe("ReportBar", () => {
  it("renders the correct number of segments with valid data", () => {
    const { container } = render(<ReportBar data={skillsData} />);
    const segments = container.querySelectorAll(".report-bar__segment");
    expect(segments).toHaveLength(skillsData.length);
  });

  it("uses the gray 100% fallback when data is empty", () => {
    const { container } = render(<ReportBar data={[]} />);
    const segments = container.querySelectorAll(".report-bar__segment");

    expect(segments).toHaveLength(1);
    expect(segments[0].style.flexBasis).toBe("100%");
    // #E0E0E0 → rgb(224, 224, 224)
    expect(segments[0].style.backgroundColor).toBe("rgb(224, 224, 224)");
  });

  it("distributes segment widths proportionally to values", () => {
    const { container } = render(<ReportBar data={skillsData} />);
    const segments = container.querySelectorAll(".report-bar__segment");

    // skillsData total = 100 → Autonome 40%, Exercé 30%, Expliqué 20%, Non expliqué 10%
    expect(parseFloat(segments[0].style.flexBasis)).toBeCloseTo(40);
    expect(parseFloat(segments[1].style.flexBasis)).toBeCloseTo(30);
    expect(parseFloat(segments[2].style.flexBasis)).toBeCloseTo(20);
    expect(parseFloat(segments[3].style.flexBasis)).toBeCloseTo(10);
  });

  it("normalizes invalid values: strings → numbers, negatives → 0, null → 0, null labels → 'Item X'", () => {
    const { container } = render(<ReportBar data={badData} />);
    const segments = container.querySelectorAll(".report-bar__segment");

    // badData: "40"→40, -5→0 (clamped), null→0, 0→0  |  total = 40
    // Autonome: 40/40 = 100%, others: 0%
    expect(segments).toHaveLength(badData.length);
    expect(parseFloat(segments[0].style.flexBasis)).toBeCloseTo(100);
    expect(parseFloat(segments[1].style.flexBasis)).toBeCloseTo(0);
    expect(parseFloat(segments[2].style.flexBasis)).toBeCloseTo(0);

    // null label → "Item 3"
    expect(segments[2].title).toMatch(/Item 3/);
  });

  it("assigns default colors in input order", () => {
    const { container } = render(<ReportBar data={skillsData} />);
    const segments = container.querySelectorAll(".report-bar__segment");

    // DEFAULT_COLORS[0] = #005BA9 → rgb(0, 91, 169)
    expect(segments[0].style.backgroundColor).toBe("rgb(0, 91, 169)");
    // DEFAULT_COLORS[1] = #4D8DC3 → rgb(77, 141, 195)
    expect(segments[1].style.backgroundColor).toBe("rgb(77, 141, 195)");
    // DEFAULT_COLORS[2] = #CCDEEE → rgb(204, 222, 238)
    expect(segments[2].style.backgroundColor).toBe("rgb(204, 222, 238)");
    // DEFAULT_COLORS[3] = #F2F2F7 → rgb(242, 242, 247)
    expect(segments[3].style.backgroundColor).toBe("rgb(242, 242, 247)");
  });
});
