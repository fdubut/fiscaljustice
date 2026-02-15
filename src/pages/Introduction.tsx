export default function Introduction() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="relative -mx-4 -mt-8 mb-10 overflow-hidden rounded-b-2xl">
        <img
          src="/images/hero-banner.webp"
          alt="Community gathering at the Washington State Capitol"
          className="w-full h-[340px] md:h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-civic-900/80 via-civic-900/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Fiscal Justice in Washington State
          </h1>
          <p className="text-lg md:text-xl text-civic-100 leading-relaxed">
            Exploring how a fairer tax system can fund the services our communities need.
          </p>
        </div>
      </div>

      {/* Article Content */}
      <article className="prose prose-slate max-w-none">
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
          explore what happens when you adjust tax rates across all major revenue
          sources — income tax, sales tax, property tax, B&amp;O tax, real estate
          excise tax, capital gains, and more. You can see Washington&apos;s
          complete revenue picture, including federal transfers, and how close
          we&apos;d get to funding universal healthcare, universal childcare,
          fully funding K-12 education, and closing the affordable housing gap.
        </p>

        <div className="mt-8 p-5 bg-accent-50 border-l-4 border-accent-500 rounded-lg shadow-sm">
          <p className="text-civic-900">
            <strong>Try the simulator →</strong> Head to the{" "}
            <a href="/simulator" className="underline font-medium text-civic-600 hover:text-civic-800">
              Simulator
            </a>{" "}
            page to start exploring different tax scenarios.
          </p>
        </div>
      </article>
    </div>
  );
}
