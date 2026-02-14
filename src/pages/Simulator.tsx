import { useState } from "react";
import {
  WA_CURRENT_RATES,
  WA_CURRENT_REVENUE,
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

  const totalRevenue =
    incomeTaxRevenue +
    capitalGainsTaxRevenue +
    salesTaxRevenue +
    propertyTaxRevenue +
    wealthTaxRevenue;

  const currentTotal =
    WA_CURRENT_REVENUE.incomeTaxRevenueBillions +
    WA_CURRENT_REVENUE.capitalGainsTaxRevenueBillions +
    WA_CURRENT_REVENUE.salesTaxRevenueBillions +
    WA_CURRENT_REVENUE.propertyTaxRevenueBillions +
    WA_CURRENT_REVENUE.wealthTaxRevenueBillions;

  const revenueChange = totalRevenue - currentTotal;

  const k12Pct =
    (revenueChange / WA_PROGRAM_COSTS.fullyFundK12Billions) * 100;
  const childcarePct =
    (revenueChange / WA_PROGRAM_COSTS.universalChildcareBillions) * 100;

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
                <dt className="text-civic-600">Sales Tax Revenue</dt>
                <dd className="font-medium">{formatBillions(salesTaxRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">Property Tax Revenue</dt>
                <dd className="font-medium">
                  {formatBillions(propertyTaxRevenue)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-civic-600">Wealth Tax Revenue</dt>
                <dd className="font-medium">
                  {formatBillions(wealthTaxRevenue)}
                </dd>
              </div>
              <hr className="border-civic-200" />
              <div className="flex justify-between text-base font-semibold">
                <dt>Total Revenue</dt>
                <dd>{formatBillions(totalRevenue)}</dd>
              </div>
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

          <section className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-lg font-semibold mb-4 text-civic-800">
              Program Funding Impact
            </h2>
            <div className="space-y-4">
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
