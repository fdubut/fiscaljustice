export default function Introduction() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-bold mb-6">
        Fiscal Justice in Washington State
      </h1>

      <p className="text-lg leading-relaxed mb-4">
        Washington State has one of the most regressive tax systems in the
        United States. With no state income tax, the burden of funding public
        services falls disproportionately on sales taxes and property taxes —
        taxes that take a larger share of income from lower-income households.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        <strong>Fiscal justice</strong> means designing a tax system where
        everyone contributes fairly based on their ability to pay. It means
        asking whether our current approach adequately funds the services our
        communities need — like universal healthcare and universal childcare —
        and who bears the cost.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        This site provides a <strong>tax simulator</strong> that lets you
        explore what happens when you adjust income tax, sales tax, and property
        tax rates. You can see how much revenue Washington would gain or lose,
        and how close we&apos;d get to funding universal healthcare and
        universal childcare for all Washingtonians.
      </p>

      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-blue-900">
          <strong>Try the simulator →</strong> Head to the{" "}
          <a href="/simulator" className="underline font-medium">
            Simulator
          </a>{" "}
          page to start exploring different tax scenarios.
        </p>
      </div>
    </article>
  );
}
