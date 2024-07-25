const AwarenessLoading = () => {
  const awarenessDummyData = [1, 2, 3, 4]; // Adjust the number of dummy rows as needed
  return awarenessDummyData.map((_, index) => (
    <section
      key={index}
      className="grid items-center gap-6 py-2 pl-6 pr-4 border-t-2 border-gray-200 grid-cols-customAwarness group animate-pulse"
    >
      <span className="w-6 h-6 rounded bg-slate-700"></span>
      <span className="h-6 rounded bg-slate-700"></span>
      <span className="h-6 rounded bg-slate-700"></span>
      <span className="h-6 rounded bg-slate-700"></span>
      <div className="flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-slate-700"></div>
      </div>
      <div className="grid justify-center gap-2">
        <div className="w-16 h-8 rounded-md bg-slate-700"></div>
        <div className="w-16 h-8 rounded-md bg-slate-700"></div>
      </div>
    </section>
  ));
};

export default AwarenessLoading;
