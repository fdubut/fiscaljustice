/**
 * Washington State fiscal data — sourced from real-world public data.
 * All data retrieved 2026-02-07. See src/data/research-data.json for full citations.
 */

export const WA_CURRENT_RATES = {
  /** WA has no state income tax (WA Constitution Article VII) */
  incomeTaxRate: 0,
  incomeTaxThreshold: 0,

  /** State sales tax rate — WA DOR; local rates add ~3% on top (avg combined ~9.47%) */
  salesTaxRate: 6.5,

  /**
   * State property tax levy rate per $1,000 assessed value — WA DOR Property Tax Statistics 2024
   * Part 1 (School Fund): $1.63842 + Part 2 (McCleary): $0.87909 = $2.51751
   */
  propertyTaxRate: 2.52,
};

/** Tax bases for revenue modeling */
export const WA_TAX_BASES = {
  /**
   * Total adjusted gross income for WA tax filers (~$536B).
   * Derived from ITEP Who Pays 7th Edition quintile data (2024).
   * Used as income tax base since income taxes apply to AGI.
   */
  totalAGIBillions: 536,

  /** Total taxable retail sales, 2024 est. — WA DOR QBR / AWB Institute */
  totalTaxableSalesBillions: 242,

  /** Total assessed property value, 2024 — WA DOR Property Tax Statistics 2024 */
  totalAssessedPropertyValueBillions: 833,
};

/** Current annual revenue from each source (FY2024, $B) — WA DOR Tax Statistics 2024 */
export const WA_CURRENT_REVENUE = {
  salesTaxRevenueBillions: 13.07,
  propertyTaxRevenueBillions: 2.71,
  incomeTaxRevenueBillions: 0,
};

/**
 * Estimated annual costs for universal programs ($B).
 * Healthcare: WA Universal Health Care Commission / Milliman (midpoint of $58–65B range).
 *   Note: this replaces current spending; net new tax revenue needed is lower.
 * Childcare: ~505K children under 6 × $14,355 avg (Census + Center for American Progress).
 */
export const WA_PROGRAM_COSTS = {
  universalHealthcareBillions: 61.5,
  universalChildcareBillions: 7.25,
};

/**
 * Income distribution breakpoints for WA — derived from ITEP Who Pays 7th Edition (2024).
 * Each entry: [threshold ($), fraction of total AGI that is above that threshold].
 * Used to estimate income tax revenue at various threshold levels.
 *
 * Computed from ITEP quintile boundaries and average incomes:
 *   Bottom 20%: <$33,500 (avg $18,600)  |  Second 20%: $33.5K–$61.8K (avg $47,400)
 *   Middle 20%: $61.8K–$107.7K (avg $82,400)  |  Fourth 20%: $107.7K–$162.9K (avg $132,800)
 *   Next 15%: $162.9K–$372.9K (avg $235,600)  |  Next 4%: $372.9K–$878.4K (avg $537,800)
 *   Top 1%: >$878.4K (avg $2,077,500)
 */
export const WA_INCOME_DISTRIBUTION: [number, number][] = [
  [0, 1.0],
  [33_500, 0.77],
  [61_800, 0.62],
  [107_700, 0.46],
  [162_900, 0.34],
  [250_000, 0.26],
  [372_900, 0.18],
  [500_000, 0.16],
  [878_400, 0.09],
  [2_000_000, 0.02],
];

/** Estimate total income above a threshold using piecewise linear interpolation. */
export function estimateIncomeAboveThreshold(threshold: number): number {
  const dist = WA_INCOME_DISTRIBUTION;
  const total = WA_TAX_BASES.totalAGIBillions;

  if (threshold <= 0) return total;
  if (threshold >= dist[dist.length - 1][0]) return 0;

  for (let i = 0; i < dist.length - 1; i++) {
    const [t0, f0] = dist[i];
    const [t1, f1] = dist[i + 1];
    if (threshold >= t0 && threshold < t1) {
      const t = (threshold - t0) / (t1 - t0);
      return total * (f0 + t * (f1 - f0));
    }
  }
  return 0;
}

/** Source citations for data used in the simulator */
export const DATA_SOURCES = {
  salesTax: {
    label: "WA DOR Tax Statistics 2024",
    url: "https://dor.wa.gov/sites/default/files/2025-10/Tax_Statistics_2024.pdf",
  },
  propertyTax: {
    label: "WA DOR Property Tax Statistics 2024",
    url: "https://dor.wa.gov/about/statistics-reports/property-tax-statistics/property-tax-statistics-2024",
  },
  incomeDist: {
    label: "ITEP Who Pays? 7th Edition — Washington",
    url: "https://itep.org/washington-who-pays-7th-edition/",
  },
  healthcare: {
    label: "WA Universal Health Care Commission / Milliman",
    url: "https://www.hca.wa.gov/about-hca/who-we-are/universal-health-care-commission",
  },
  childcare: {
    label: "Center for American Progress / Census",
    url: "https://www.americanprogress.org/data-view/early-learning-in-the-united-states/",
  },
  taxableSales: {
    label: "WA DOR Quarterly Business Review",
    url: "https://dor.wa.gov/about/statistics-reports/business-and-sales-taxes/quarterly-business-reviews",
  },
  assessedValue: {
    label: "WA DOR Property Tax Statistics 2024",
    url: "https://dor.wa.gov/about/statistics-reports/property-tax-statistics/property-tax-statistics-2024",
  },
};
