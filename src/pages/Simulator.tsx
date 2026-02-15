import { useState } from "react";
import {
  WA_CURRENT_RATES,
  WA_CURRENT_REVENUE,
  WA_CURRENT_SPENDING,
  WA_PROGRAM_COSTS,
  DATA_SOURCES,
  estimateIncomeAboveThreshold,
  estimateCapitalGainsAboveThreshold,
  estimateWealthAboveThreshold,
} from "../data/constants";

function formatBillions(value: number): string {
  if (Math.abs(value) >= 1) {
    return `$${value.toFixed(1)}B`;
  }
  return `$${(value * 1_000).toFixed(0)}M`;
}

function SourceLink({ source }: { source: { label: string; url: string } }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-civic-600 hover:text-civic-800 hover:underline"
    >
      {source.label} ↗
    </a>
  );
}

export default function Simulator() {
  const [incomeTaxRate, setIncomeTaxRate] = useState(0);
  const [incomeTaxThreshold, setIncomeTaxThreshold] = useState(0);
  const [capitalGainsTaxRate, setCapitalGainsTaxRate] = useState(
    WA_CURRENT_RATES.capitalGainsTaxRate
  );
  const [capitalGainsThreshold, setCapitalGainsThreshold] = useState(
    WA_CURRENT_RATES.capitalGainsThreshold
  );
  const [salesTaxRate, setSalesTaxRate] = useState(WA_CURRENT_RATES.salesTaxRate);
  const [propertyTaxRate, setPropertyTaxRate] = useState(
    WA_CURRENT_RATES.propertyTaxRate
  );
  const [wealthTaxRate, setWealthTaxRate] = useState(0);
  const [wealthTaxThreshold, setWealthTaxThreshold] = useState(
    WA_CURRENT_RATES.wealthTaxThreshold
  );
  const [boTaxRate, setBoTaxRate] = useState(WA_CURRENT_RATES.boTaxRate);
  const [reetRate, setReetRate] = useState(WA_CURRENT_RATES.reetRate);

  // Income tax: use ITEP-derived income distribution to estimate taxable income above threshold
  const incomeTaxRevenue =
    (incomeTaxRate / 100) * estimateIncomeAboveThreshold(incomeTaxThreshold);

  // Capital gains tax: use capital gains distribution model
  const capitalGainsTaxRevenue =
    (capitalGainsTaxRate / 100) *
    estimateCapitalGainsAboveThreshold(capitalGainsThreshold);

  // Sales & property tax: scale proportionally from actual FY2024 revenue
  const salesTaxRevenue =
    WA_CURRENT_REVENUE.salesTaxRevenueBillions *
    (salesTaxRate / WA_CURRENT_RATES.salesTaxRate);

  const propertyTaxRevenue =
    WA_CURRENT_REVENUE.propertyTaxRevenueBillions *
    (propertyTaxRate / WA_CURRENT_RATES.propertyTaxRate);

  // Wealth tax: use wealth distribution model
  const wealthTaxRevenue =
    (wealthTaxRate / 100) * estimateWealthAboveThreshold(wealthTaxThreshold);

  // B&O tax: scale proportionally from actual FY2024 revenue
  const boTaxRevenue =
    WA_CURRENT_REVENUE.boTaxRevenueBillions *
    (boTaxRate / WA_CURRENT_RATES.boTaxRate);

  // REET: scale proportionally from actual FY2024 revenue
  const reetRevenue =
    WA_CURRENT_REVENUE.reetRevenueBillions *
    (reetRate / WA_CURRENT_RATES.reetRate);

  // Fixed revenue sources (not adjustable)
  const otherTaxRevenue =
    WA_CURRENT_REVENUE.insurancePremiumTaxRevenueBillions +
    WA_CURRENT_REVENUE.publicUtilityTaxRevenueBillions +
    WA_CURRENT_REVENUE.liquorTaxRevenueBillions +
    WA_CURRENT_REVENUE.tobaccoTaxRevenueBillions +
    WA_CURRENT_REVENUE.otherTaxRevenueBillions;

  const federalTransfers = WA_CURRENT_REVENUE.federalTransfersBillions;

  const totalRevenue =
    federalTransfers +
    incomeTaxRevenue +
    capitalGainsTaxRevenue +
    salesTaxRevenue +
    propertyTaxRevenue +
    wealthTaxRevenue +
    boTaxRevenue +
    reetRevenue +
    otherTaxRevenue;

  const currentTotal =
    WA_CURRENT_REVENUE.federalTransfersBillions +
    WA_CURRENT_REVENUE.incomeTaxRevenueBillions +
    WA_CURRENT_REVENUE.capitalGainsTaxRevenueBillions +
    WA_CURRENT_REVENUE.salesTaxRevenueBillions +
    WA_CURRENT_REVENUE.propertyTaxRevenueBillions +
    WA_CURRENT_REVENUE.wealthTaxRevenueBillions +
    WA_CURRENT_REVENUE.boTaxRevenueBillions +
    WA_CURRENT_REVENUE.reetRevenueBillions +
    otherTaxRevenue;

  const revenueChange = totalRevenue - currentTotal;

  const healthcareNetNewPct =
    (revenueChange / WA_PROGRAM_COSTS.universalHealthcareNetNewBillions) * 100;
  const childcarePct =
    (revenueChange / WA_PROGRAM_COSTS.universalChildcareBillions) * 100;
  const k12Pct =
    (revenueChange / WA_PROGRAM_COSTS.fullyFundK12Billions) * 100;
  const housingPct =
    (revenueChange / WA_PROGRAM_COSTS.affordableHousingBillions) * 100;

  const spendingCategories = [
    { label: "K-12 Education", value: WA_CURRENT_SPENDING.k12EducationBillions },
    { label: "Human Services", value: WA_CURRENT_SPENDING.humanServicesBillions },
    { label: "Healthcare (Medicaid/HCA)", value: WA_CURRENT_SPENDING.healthcareBillions },
    { label: "Higher Education", value: WA_CURRENT_SPENDING.higherEducationBillions },
    { label: "Public Safety", value: WA_CURRENT_SPENDING.publicSafetyBillions },
    { label: "Other", value: WA_CURRENT_SPENDING.otherBillions },
    { label: "General Government", value: WA_CURRENT_SPENDING.generalGovernmentBillions },
    { label: "Natural Resources", value: WA_CURRENT_SPENDING.naturalResourcesBillions },
  ];
  const totalStateSpending = spendingCategories.reduce((sum, c) => sum + c.value, 0);
  const maxSpending = spendingCategories[0].value;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-civic-900">Tax Revenue Simulator</h1>
      <p className="text-civic-600 mb-8">
        Adjust tax rates below to see how revenue changes and what programs
        Washington could fund.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tax Inputs */}
        <div className="space-y-6">
          {/* Income Tax */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Income Tax
            </h2>
            <p className="text-xs text-civic-500 mb-3">
              WA currently has no state income tax. Source:{" "}
              <SourceLink source={DATA_SOURCES.incomeDist} />
            </p>
            <label className="block mb-3">
              <span className="text-sm font-medium text-civic-700">
                Rate: {incomeTaxRate.toFixed(1)}%
              </span>
              <input
                type="range"
                min={0}
                max={15}
                step={0.1}
                value={incomeTaxRate}
                onChange={(e) => setIncomeTaxRate(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-civic-700">
                Threshold: ${incomeTaxThreshold.toLocaleString()}
              </span>
              <input
                type="range"
                min={0}
                max={500_000}
                step={5_000}
                value={incomeTaxThreshold}
                onChange={(e) => setIncomeTaxThreshold(Number(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-civic-500">
                Income above this amount is taxed
              </span>
            </label>
          </section>

          {/* Capital Gains Tax */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Capital Gains Tax
            </h2>
            <p className="text-xs text-civic-500 mb-3">
              Current rate: {WA_CURRENT_RATES.capitalGainsTaxRate}% above $
              {WA_CURRENT_RATES.capitalGainsThreshold.toLocaleString()}{" "}
              deduction (FY2024 revenue:{" "}
              {formatBillions(
                WA_CURRENT_REVENUE.capitalGainsTaxRevenueBillions
              )}
              ). Source: <SourceLink source={DATA_SOURCES.capitalGainsRevenue} />
            </p>
            <label className="block mb-3">
              <span className="text-sm font-medium text-civic-700">
                Rate: {capitalGainsTaxRate.toFixed(1)}%
              </span>
              <input
                type="range"
                min={0}
                max={30}
                step={0.1}
                value={capitalGainsTaxRate}
                onChange={(e) =>
                  setCapitalGainsTaxRate(Number(e.target.value))
                }
                className="w-full mt-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-civic-700">
                Threshold: ${capitalGainsThreshold.toLocaleString()}
              </span>
              <input
                type="range"
                min={0}
                max={1_000_000}
                step={10_000}
                value={capitalGainsThreshold}
                onChange={(e) =>
                  setCapitalGainsThreshold(Number(e.target.value))
                }
                className="w-full mt-1"
              />
              <span className="text-xs text-civic-500">
                Capital gains above this amount are taxed
              </span>
            </label>
          </section>

          {/* Sales Tax */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Sales Tax
            </h2>
            <p className="text-xs text-civic-500 mb-3">
              Current state rate: {WA_CURRENT_RATES.salesTaxRate}% (FY2024
              revenue: {formatBillions(WA_CURRENT_REVENUE.salesTaxRevenueBillions)}).
              Source: <SourceLink source={DATA_SOURCES.salesTax} />
            </p>
            <label className="block">
              <span className="text-sm font-medium text-civic-700">
                Rate: {salesTaxRate.toFixed(1)}%
              </span>
              <input
                type="range"
                min={0}
                max={15}
                step={0.1}
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
          </section>

          {/* Property Tax */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Property Tax
            </h2>
            <p className="text-xs text-civic-500 mb-3">
              Current state levy: ${WA_CURRENT_RATES.propertyTaxRate.toFixed(2)} per
              $1,000 assessed value (FY2024 revenue:{" "}
              {formatBillions(WA_CURRENT_REVENUE.propertyTaxRevenueBillions)}).
              Source: <SourceLink source={DATA_SOURCES.propertyTax} />
            </p>
            <label className="block">
              <span className="text-sm font-medium text-civic-700">
                Rate: ${propertyTaxRate.toFixed(2)} / $1,000
              </span>
              <input
                type="range"
                min={0}
                max={25}
                step={0.01}
                value={propertyTaxRate}
                onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
          </section>

          {/* B&O Tax */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Business &amp; Occupation Tax
            </h2>
            <p className="text-xs text-civic-500 mb-3">
              Current avg effective rate: {WA_CURRENT_RATES.boTaxRate}% on gross
              business income (FY2024 revenue:{" "}
              {formatBillions(WA_CURRENT_REVENUE.boTaxRevenueBillions)}).
              Industry rates range 0.138%–3.3%. Source:{" "}
              <SourceLink source={DATA_SOURCES.boTax} />
            </p>
            <label className="block">
              <span className="text-sm font-medium text-civic-700">
                Avg Rate: {boTaxRate.toFixed(3)}%
              </span>
              <input
                type="range"
                min={0}
                max={2}
                step={0.001}
                value={boTaxRate}
                onChange={(e) => setBoTaxRate(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
          </section>

          {/* REET */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Real Estate Excise Tax
            </h2>
            <p className="text-xs text-civic-500 mb-3">
              Current avg effective rate: {WA_CURRENT_RATES.reetRate}% on sale
              price (FY2024 revenue:{" "}
              {formatBillions(WA_CURRENT_REVENUE.reetRevenueBillions)}).
              Tiered 1.1%–3%. Source:{" "}
              <SourceLink source={DATA_SOURCES.reet} />
            </p>
            <label className="block">
              <span className="text-sm font-medium text-civic-700">
                Avg Rate: {reetRate.toFixed(1)}%
              </span>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={reetRate}
                onChange={(e) => setReetRate(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
          </section>

          {/* Wealth Tax */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Wealth Tax
            </h2>
            <p className="text-xs text-civic-500 mb-3">
              WA currently has no wealth tax. DOR study (2024): 1% at $250M
              threshold → ~$3B/yr from ~700 households. Source:{" "}
              <SourceLink source={DATA_SOURCES.wealthTax} />
            </p>
            <label className="block mb-3">
              <span className="text-sm font-medium text-civic-700">
                Rate: {wealthTaxRate.toFixed(2)}%
              </span>
              <input
                type="range"
                min={0}
                max={5}
                step={0.01}
                value={wealthTaxRate}
                onChange={(e) => setWealthTaxRate(Number(e.target.value))}
                className="w-full mt-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-civic-700">
                Threshold:{" "}
                {wealthTaxThreshold >= 1_000_000_000
                  ? `$${(wealthTaxThreshold / 1_000_000_000).toFixed(1)}B`
                  : `$${(wealthTaxThreshold / 1_000_000).toFixed(0)}M`}
              </span>
              <input
                type="range"
                min={1_000_000}
                max={1_000_000_000}
                step={1_000_000}
                value={wealthTaxThreshold}
                onChange={(e) =>
                  setWealthTaxThreshold(Number(e.target.value))
                }
                className="w-full mt-1"
              />
              <span className="text-xs text-civic-500">
                Net worth above this amount is taxed annually
              </span>
            </label>
          </section>
        </div>

        {/* Revenue Results */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Revenue Summary
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-civic-600">
                  Federal Transfers
                  <span className="text-xs text-civic-400 ml-1">(fixed)</span>
                </dt>
                <dd className="font-medium">{formatBillions(federalTransfers)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">Sales Tax Revenue</dt>
                <dd className="font-medium">{formatBillions(salesTaxRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">B&amp;O Tax Revenue</dt>
                <dd className="font-medium">{formatBillions(boTaxRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">Property Tax Revenue</dt>
                <dd className="font-medium">{formatBillions(propertyTaxRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">REET Revenue</dt>
                <dd className="font-medium">{formatBillions(reetRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">Income Tax Revenue</dt>
                <dd className="font-medium">{formatBillions(incomeTaxRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">Capital Gains Tax Revenue</dt>
                <dd className="font-medium">
                  {formatBillions(capitalGainsTaxRevenue)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">Wealth Tax Revenue</dt>
                <dd className="font-medium">
                  {formatBillions(wealthTaxRevenue)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600 group relative">
                  Other Tax Revenue
                  <span className="text-xs text-civic-400 ml-1">(fixed)</span>
                  <span className="block text-xs text-civic-400 mt-0.5">
                    Insurance ${WA_CURRENT_REVENUE.insurancePremiumTaxRevenueBillions}B
                    · Utility ${WA_CURRENT_REVENUE.publicUtilityTaxRevenueBillions}B
                    · Liquor ${WA_CURRENT_REVENUE.liquorTaxRevenueBillions}B
                    · Tobacco ${WA_CURRENT_REVENUE.tobaccoTaxRevenueBillions}B
                    · Other ${WA_CURRENT_REVENUE.otherTaxRevenueBillions}B
                  </span>
                </dt>
                <dd className="font-medium">{formatBillions(otherTaxRevenue)}</dd>
              </div>
              <hr className="border-civic-200" />
              <div className="flex justify-between text-base font-semibold">
                <dt>Total Revenue</dt>
                <dd>{formatBillions(totalRevenue)}</dd>
              </div>
              <p className="text-xs text-civic-400">
                Source: <SourceLink source={DATA_SOURCES.otherTaxes} /> ·{" "}
                <SourceLink source={DATA_SOURCES.federalTransfers} />
              </p>
            </dl>
          </section>

          <section
            className={`rounded-lg shadow p-6 ${
              revenueChange >= 0 ? "bg-teal-50" : "bg-red-50"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Change from Current System
            </h2>
            <p
              className={`text-2xl font-bold ${
                revenueChange >= 0 ? "text-teal-700" : "text-red-700"
              }`}
            >
              {revenueChange >= 0 ? "+" : ""}
              {formatBillions(revenueChange)} / year
            </p>
          </section>

          {/* Current State Budget */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-civic-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Where the Money Goes
            </h2>
            <p className="text-xs text-civic-500 mb-4">
              Current state operating budget (annualized from 2025-27 biennium).
              Source: <SourceLink source={DATA_SOURCES.stateBudget} />
            </p>
            <div className="space-y-2.5">
              {spendingCategories.map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="text-civic-600">{cat.label}</span>
                    <span className="font-medium">{formatBillions(cat.value)}</span>
                  </div>
                  <div className="w-full bg-civic-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-civic-400 transition-all"
                      style={{
                        width: `${(cat.value / maxSpending) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <hr className="border-civic-200 mt-3" />
              <div className="flex justify-between text-sm font-semibold">
                <span>State Funds (NGF-O)</span>
                <span>{formatBillions(totalStateSpending)}</span>
              </div>
              <div className="flex justify-between text-sm text-civic-500">
                <span>Federal Transfers</span>
                <span>{formatBillions(WA_CURRENT_REVENUE.federalTransfersBillions)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Total Operating Budget</span>
                <span>
                  {formatBillions(
                    totalStateSpending +
                      WA_CURRENT_REVENUE.federalTransfersBillions
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* Program Funding Impact */}
          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              What New Revenue Could Fund
            </h2>
            <p className="text-xs text-civic-500 mb-4">
              How far does {revenueChange >= 0 ? "new" : "lost"} revenue go
              toward closing these funding gaps?
            </p>
            <div className="space-y-4">
              {/* Universal Healthcare */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-civic-600">Universal Healthcare</span>
                  <span className="font-medium">
                    {healthcareNetNewPct >= 0 ? "+" : ""}
                    {healthcareNetNewPct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-civic-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      healthcareNetNewPct >= 0 ? "bg-teal-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, healthcareNetNewPct))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-civic-500 mt-1">
                  Net new revenue needed: {formatBillions(WA_PROGRAM_COSTS.universalHealthcareNetNewBillions)} / year
                  (total program cost: {formatBillions(WA_PROGRAM_COSTS.universalHealthcareTotalBillions)},
                  largely replacing existing premiums &amp; spending)
                  — <SourceLink source={DATA_SOURCES.universalHealthcare} />
                </p>
              </div>

              {/* Universal Childcare */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-civic-600">Universal Childcare</span>
                  <span className="font-medium">
                    {childcarePct >= 0 ? "+" : ""}
                    {childcarePct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-civic-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      childcarePct >= 0 ? "bg-teal-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, childcarePct))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-civic-500 mt-1">
                  Est. cost: {formatBillions(WA_PROGRAM_COSTS.universalChildcareBillions)} / year
                  — <SourceLink source={DATA_SOURCES.childcare} />
                </p>
              </div>

              {/* K-12 Funding Gap */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-civic-600">Fully Funding K-12</span>
                  <span className="font-medium">
                    {k12Pct >= 0 ? "+" : ""}
                    {k12Pct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-civic-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      k12Pct >= 0 ? "bg-teal-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, k12Pct))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-civic-500 mt-1">
                  Est. gap: {formatBillions(WA_PROGRAM_COSTS.fullyFundK12Billions)} / year
                  — <SourceLink source={DATA_SOURCES.k12} />
                </p>
              </div>

              {/* Affordable Housing */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-civic-600">Affordable Housing</span>
                  <span className="font-medium">
                    {housingPct >= 0 ? "+" : ""}
                    {housingPct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-civic-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      housingPct >= 0 ? "bg-teal-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, housingPct))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-civic-500 mt-1">
                  Est. investment gap: {formatBillions(WA_PROGRAM_COSTS.affordableHousingBillions)} / year
                  — <SourceLink source={DATA_SOURCES.affordableHousing} />
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
