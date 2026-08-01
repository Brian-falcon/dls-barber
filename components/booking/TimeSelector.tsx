export default function TimeSelector() {
  return (
    <section className="p-8 bg-white/5 rounded-3xl shadow-xl max-w-3xl mx-auto mt-8 text-slate-200">
      <h2 className="text-3xl font-semibold mb-4">Seleccioná un horario</h2>
      <div className="grid grid-cols-2 gap-4">
        {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map((time) => (
          <button key={time} className="rounded-2xl border border-slate-700 p-4 hover:border-gold">
            {time}
          </button>
        ))}
      </div>
    </section>
  );
}
