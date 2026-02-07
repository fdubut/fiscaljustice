// Washington State fiscal data
// Sources: WA Department of Revenue, Office of Financial Management

export const WA_CURRENT_RATES = {
  // WA has no state income tax
  incomeTaxRate: 0,
  incomeTaxThreshold: 0,

  // State sales tax rate (local rates vary, avg ~2.4% on top)
  salesTaxRate: 6.5,

  // State property tax rate per $1,000 of assessed value
  // (local levies add more; this is the state portion)
  propertyTaxRate: 9.87,
};

// Aggregate taxable bases (approximate, for placeholder calculations)
export const WA_TAX_BASES = {
  // Total personal income in WA (approx, billions)
  totalPersonalIncomeBillions: 600,

  // Total taxable retail sales (approx, billions)
  totalTaxableSalesBillions: 200,

  // Total assessed property value (approx, billions)
  totalAssessedPropertyValueBillions: 2_000,
};

// Estimated annual costs for universal programs in WA (placeholder estimates, billions)
export const WA_PROGRAM_COSTS = {
  universalHealthcareBillions: 30,
  universalChildcareBillions: 5,
};

// Current WA state general fund revenue from these sources (approx, billions)
export const WA_CURRENT_REVENUE = {
  salesTaxRevenueBillions: 13.0,
  propertyTaxRevenueBillions: 19.74,
  incomeTaxRevenueBillions: 0,
};
