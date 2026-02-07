import { useState } from "react";
import {
  WA_CURRENT_RATES,
  WA_CURRENT_REVENUE,
  WA_PROGRAM_COSTS,
  DATA_SOURCES,
  estimateIncomeAboveThreshold,
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
      className="text-blue-600 hover:text-blue-800 hover:underline"
    >
      {source.label} ↗
    </a>
  );
}

export default function Simulator() {
  const [incomeTaxRate, setIncomeTaxRate] = useState(0);
  const [incomeTaxThreshold, setIncomeTaxThreshold] = useState(0);
  const [salesTaxRate, setSalesTaxRate] = useState(WA_CURRENT_RATES.salesTaxRate);
  const [propertyTaxRate, setPropertyTaxRate] = useState(
    WA_CURRENT_RATES.propertyTaxRate
  );

  // Income tax: use ITEP-derived income distribution to estimate taxable income above threshold
  const incomeTaxRevenue =
    (incomeTaxRate / 100) * estimateIncomeAboveThreshold(incomeTaxThreshold);

  // Sales & property tax: scale proportionally from actual FY2024 revenue
  const salesTaxRevenue =
    WA_CURRENT_REVENUE.salesTaxRevenueBillions *
    (salesTaxRate / WA_CURRENT_RATES.salesTaxRate);

  const propertyTaxRevenue =
    WA_CURRENT_REVENUE.propertyTaxRevenueBillions *
    (propertyTaxRate / WA_CURRENT_RATES.propertyTaxRate);

  const totalRevenue = incomeTaxRevenue + salesTaxRevenue + propertyTaxRevenue;

  const currentTotal =
    WA_CURRENT_REVENUE.incomeTaxRevenueBillions +
    WA_CURRENT_REVENUE.salesTaxRevenueBillions +
    WA_CURRENT_REVENUE.propertyTaxRevenueBillions;

  const revenueChange = totalRevenue - currentTotal;

  const healthcarePct =
    (revenueChange / WA_PROGRAM_COSTS.universalHealthcareBillions) * 100;
  const childcarePct =
    (revenueChange / WA_PROGRAM_COSTS.universalChildcareBillions) * 100;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tax Revenue Simulator</h1>
      <p className="text-slate-600 mb-8">
        Adjust tax rates below to see how revenue changes and what programs
        Washington could fund.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tax Inputs */}
        <div className="space-y-6">
          {/* Income Tax */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Income Tax
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              WA currently has no state income tax. Source:{" "}
              <SourceLink source={DATA_SOURCES.incomeDist} />
            </p>
            <label className="block mb-3">
              <span className="text-sm font-medium text-slate-700">
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
              <span className="text-sm font-medium text-slate-700">
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
              <span className="text-xs text-slate-500">
                Income above this amount is taxed
              </span>
            </label>
          </section>

          {/* Sales Tax */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Sales Tax
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Current state rate: {WA_CURRENT_RATES.salesTaxRate}% (FY2024
              revenue: {formatBillions(WA_CURRENT_REVENUE.salesTaxRevenueBillions)}).
              Source: <SourceLink source={DATA_SOURCES.salesTax} />
            </p>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
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
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Property Tax
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Current state levy: ${WA_CURRENT_RATES.propertyTaxRate.toFixed(2)} per
              $1,000 assessed value (FY2024 revenue:{" "}
              {formatBillions(WA_CURRENT_REVENUE.propertyTaxRevenueBillions)}).
              Source: <SourceLink source={DATA_SOURCES.propertyTax} />
            </p>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
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
        </div>

        {/* Revenue Results */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Revenue Summary
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Income Tax Revenue</dt>
                <dd className="font-medium">{formatBillions(incomeTaxRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Sales Tax Revenue</dt>
                <dd className="font-medium">{formatBillions(salesTaxRevenue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Property Tax Revenue</dt>
                <dd className="font-medium">
                  {formatBillions(propertyTaxRevenue)}
                </dd>
              </div>
              <hr className="border-slate-200" />
              <div className="flex justify-between text-base font-semibold">
                <dt>Total Revenue</dt>
                <dd>{formatBillions(totalRevenue)}</dd>
              </div>
            </dl>
          </section>

          <section
            className={`rounded-lg shadow p-6 ${
              revenueChange >= 0 ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Change from Current System
            </h2>
            <p
              className={`text-2xl font-bold ${
                revenueChange >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {revenueChange >= 0 ? "+" : ""}
              {formatBillions(revenueChange)} / year
            </p>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Program Funding Impact
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Universal Healthcare</span>
                  <span className="font-medium">
                    {healthcarePct >= 0 ? "+" : ""}
                    {healthcarePct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      healthcarePct >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, healthcarePct))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Est. cost: {formatBillions(WA_PROGRAM_COSTS.universalHealthcareBillions)} / year
                  — <SourceLink source={DATA_SOURCES.healthcare} />
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Universal Childcare</span>
                  <span className="font-medium">
                    {childcarePct >= 0 ? "+" : ""}
                    {childcarePct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      childcarePct >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, childcarePct))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
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
