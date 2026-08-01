export default function Calendar() {
  return (
    <section className="p-8 bg-white/5 rounded-3xl shadow-xl max-w-3xl mx-auto mt-8 text-slate-200">
      <h2 className="text-3xl font-semibold mb-4">Calendario</h2>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-700 p-4 text-center">
            Día {index + 1}
          </div>
        ))}
      </div>
    </section>
  );
}
