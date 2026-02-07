/**
 * Washington State fiscal data — sourced from real-world public data.
 * All data retrieved 2026-02-07. See src/data/research-data.json for full citations.
 */

export const WA_CURRENT_RATES = {
  /** WA has no state income tax (WA Constitution Article VII) */
  incomeTaxRate: 0,
  incomeTaxThreshold: 0,

  /**
   * WA capital gains excise tax — WA DOR
   * 7% on long-term gains above $270K deduction (2024).
   * Starting 2025: 9.9% on gains over $1M.
   */
  capitalGainsTaxRate: 7,
  capitalGainsThreshold: 270_000,

  /** State sales tax rate — WA DOR; local rates add ~3% on top (avg combined ~9.47%) */
  salesTaxRate: 6.5,

  /**
   * State property tax levy rate per $1,000 assessed value — WA DOR Property Tax Statistics 2024
   * Part 1 (School Fund): $1.63842 + Part 2 (McCleary): $0.87909 = $2.51751
   */
  propertyTaxRate: 2.52,

  /** WA currently has no wealth tax (0%). WA DOR Wealth Tax Study published Nov 2024. */
  wealthTaxRate: 0,
  wealthTaxThreshold: 250_000_000,
};

/** Tax bases for revenue modeling */
export const WA_TAX_BASES = {
  /**
   * Total adjusted gross income for WA tax filers (~$536B).
   * Derived from ITEP Who Pays 7th Edition quintile data (2024).
   * Used as income tax base since income taxes apply to AGI.
   */
  totalAGIBillions: 536,

  /**
   * Total long-term capital gains realized by WA filers (~$17.8B).
   * IRS Statistics of Income (SOI) Table 2, 2021.
   * Includes federally-reported gains; WA state-taxable base is smaller (~$8B)
   * due to exclusions for real estate, retirement accounts, and sub-threshold gains.
   */
  totalCapitalGainsBillions: 17.8,

  /** Total taxable retail sales, 2024 est. — WA DOR QBR / AWB Institute */
  totalTaxableSalesBillions: 242,

  /** Total assessed property value, 2024 — WA DOR Property Tax Statistics 2024 */
  totalAssessedPropertyValueBillions: 833,

  /**
   * Total estimated household net worth in WA (~$5,250B).
   * Derived from Fed Z.1 ($169.4T national) × WA GDP share (3.1%).
   * WA GDP $785B / US GDP $25.5T — BEA State GDP 2024.
   */
  totalHouseholdWealthBillions: 5_250,
};

/** Current annual revenue from each source (FY2024, $B) — WA DOR Tax Statistics 2024 */
export const WA_CURRENT_REVENUE = {
  salesTaxRevenueBillions: 13.07,
  propertyTaxRevenueBillions: 2.71,
  incomeTaxRevenueBillions: 0,
  /** WA DOR News Release: $560.6M initial collections for TY2024 */
  capitalGainsTaxRevenueBillions: 0.561,
  /** WA currently has no wealth tax */
  wealthTaxRevenueBillions: 0,
};

/**
 * Estimated annual costs for programs ($B).
 * K-12 funding gap: OSPI Superintendent Reykdal's 2025-27 biennium request identifies a
 *   $3.7B annual shortfall (~$1B special ed, $695M classified staff, $350M MSOC, remainder
 *   transportation & other gaps). Source: WA State Standard / OSPI (Sep 2024).
 * Childcare: ~505K children under 6 × $14,355 avg (Census + Center for American Progress).
 */
export const WA_PROGRAM_COSTS = {
  fullyFundK12Billions: 3.7,
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

/**
 * Capital gains distribution breakpoints for WA.
 * Each entry: [threshold ($), fraction of total capital gains above that threshold].
 *
 * Derived from IRS SOI data and WA DOR capital gains tax structure:
 *   - Total LT capital gains ~$17.8B (IRS SOI 2021)
 *   - State-taxable base ~$8B (after real estate, retirement, and deduction exclusions)
 *   - Gains are highly concentrated: ~90% from filers with AGI > $500K
 *   - WA DOR: 4,461 returns filed in TY2024 (gains above $270K deduction)
 *
 * Sources: IRS SOI Table 2, WA DOR Capital Gains Tax page
 */
export const WA_CAPITAL_GAINS_DISTRIBUTION: [number, number][] = [
  [0, 1.0],
  [50_000, 0.85],
  [100_000, 0.72],
  [270_000, 0.45],
  [500_000, 0.32],
  [1_000_000, 0.20],
  [2_000_000, 0.12],
  [5_000_000, 0.06],
  [10_000_000, 0.02],
];

/** Estimate total capital gains above a threshold using piecewise linear interpolation. */
export function estimateCapitalGainsAboveThreshold(threshold: number): number {
  const dist = WA_CAPITAL_GAINS_DISTRIBUTION;
  const total = WA_TAX_BASES.totalCapitalGainsBillions;

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

/**
 * Wealth distribution breakpoints for WA.
 * Each entry: [threshold ($), fraction of total household wealth above that threshold].
 *
 * Derived from Federal Reserve Distributional Financial Accounts (DFA) and WA DOR Wealth Tax Study:
 *   - WA total household net worth ~$5,250B (GDP-proportional estimate)
 *   - Fed DFA: top 1% holds 33%, top 10% holds 67%, bottom 50% holds 6%
 *   - WA DOR: ~2,939 residents with >$50M net worth; ~700 with >$250M
 *   - WA billionaires: ~$340B combined (12-13 individuals)
 *   - DOR study: 1% wealth tax at $250M threshold → ~$3B/yr revenue
 *
 * Sources: Fed Z.1 / DFA, WA DOR Wealth Tax Study (Nov 2024), Forbes 2025
 */
export const WA_WEALTH_DISTRIBUTION: [number, number][] = [
  [0, 1.0],
  [250_000, 0.90],
  [500_000, 0.80],
  [1_000_000, 0.67],
  [5_000_000, 0.42],
  [10_000_000, 0.30],
  [50_000_000, 0.15],
  [100_000_000, 0.10],
  [250_000_000, 0.057],
  [1_000_000_000, 0.035],
  [10_000_000_000, 0.01],
];

/** Estimate total household wealth above a threshold using piecewise linear interpolation. */
export function estimateWealthAboveThreshold(threshold: number): number {
  const dist = WA_WEALTH_DISTRIBUTION;
  const total = WA_TAX_BASES.totalHouseholdWealthBillions;

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
  capitalGains: {
    label: "WA DOR Capital Gains Tax",
    url: "https://dor.wa.gov/taxes-rates/other-taxes/capital-gains-tax",
  },
  capitalGainsRevenue: {
    label: "WA DOR — TY2024 Capital Gains Collections",
    url: "https://dor.wa.gov/about/news-releases/2025/tax-year-2024-initial-capital-gains-collections-exceed-5606-million",
  },
  wealthTax: {
    label: "WA DOR Wealth Tax Study (Nov 2024)",
    url: "https://dor.wa.gov/sites/default/files/2024-11/Wealth_Tax_Study_Final_Report.pdf",
  },
  wealthDist: {
    label: "Federal Reserve Distributional Financial Accounts",
    url: "https://www.federalreserve.gov/releases/z1/dataviz/dfa/distribute/chart/",
  },
  k12: {
    label: "OSPI 2025-27 Budget Request / WA State Standard",
    url: "https://washingtonstatestandard.com/2024/09/17/reykdal-seeks-3b-injection-for-wa-public-schools-in-next-budget/",
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
