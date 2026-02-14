/**
 * Research data index — aggregates all per-category research data files.
 *
 * Category mapping (old code → new slug):
 *   1A → current-tax-rates      1B → tax-regressivity       1C → state-revenue
 *   1D → healthcare-coverage    1E → childcare-costs         2A → income-distribution
 *   2B → sales-tax-base         2C → property-tax-base       2D → revenue-modeling
 *   3A → k12-funding            3B → childcare-programs      4A → demographics
 *   4B → state-comparisons      5A → capital-gains-tax       5B → wealth-tax
 */

import currentTaxRates from "./current-tax-rates.json";
import taxRegressivity from "./tax-regressivity.json";
import stateRevenue from "./state-revenue.json";
import healthcareCoverage from "./healthcare-coverage.json";
import childcareCosts from "./childcare-costs.json";
import incomeDistribution from "./income-distribution.json";
import salesTaxBase from "./sales-tax-base.json";
import propertyTaxBase from "./property-tax-base.json";
import revenueModeling from "./revenue-modeling.json";
import k12Funding from "./k12-funding.json";
import childcarePrograms from "./childcare-programs.json";
import demographics from "./demographics.json";
import stateComparisons from "./state-comparisons.json";
import capitalGainsTax from "./capital-gains-tax.json";
import wealthTax from "./wealth-tax.json";

export interface ResearchDataPoint {
  id: string;
  data_point: string;
  value: string;
  numeric_value: number | null;
  unit: "percent" | "dollars" | "billions_usd" | "millions_usd" | "rate_per_1000" | "count" | "text";
  year: string;
  source_name: string;
  source_url: string;
  retrieved_date: string;
  notes?: string;
}

export interface ResearchCategory {
  category: string;
  title: string;
  description: string;
  data: ResearchDataPoint[];
}

export const researchCategories: Record<string, ResearchCategory> = {
  "current-tax-rates": currentTaxRates as unknown as ResearchCategory,
  "tax-regressivity": taxRegressivity as unknown as ResearchCategory,
  "state-revenue": stateRevenue as unknown as ResearchCategory,
  "healthcare-coverage": healthcareCoverage as unknown as ResearchCategory,
  "childcare-costs": childcareCosts as unknown as ResearchCategory,
  "income-distribution": incomeDistribution as unknown as ResearchCategory,
  "sales-tax-base": salesTaxBase as unknown as ResearchCategory,
  "property-tax-base": propertyTaxBase as unknown as ResearchCategory,
  "revenue-modeling": revenueModeling as unknown as ResearchCategory,
  "k12-funding": k12Funding as unknown as ResearchCategory,
  "childcare-programs": childcarePrograms as unknown as ResearchCategory,
  "demographics": demographics as unknown as ResearchCategory,
  "state-comparisons": stateComparisons as unknown as ResearchCategory,
  "capital-gains-tax": capitalGainsTax as unknown as ResearchCategory,
  "wealth-tax": wealthTax as unknown as ResearchCategory,
};

export const allResearchData: ResearchDataPoint[] = Object.values(researchCategories).flatMap(
  (cat) => cat.data,
);
