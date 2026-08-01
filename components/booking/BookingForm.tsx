export default function BookingForm() {
  return (
    <section className="p-8 bg-white/5 rounded-3xl shadow-xl max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-white">Reservá tu turno</h2>
      <form className="grid gap-4 text-slate-200">
        <label className="flex flex-col gap-2">
          Nombre completo
          <input className="rounded-xl p-3 bg-slate-900 border border-slate-700" type="text" placeholder="Tu nombre" />
        </label>
        <label className="flex flex-col gap-2">
          Correo electrónico
          <input className="rounded-xl p-3 bg-slate-900 border border-slate-700" type="email" placeholder="email@ejemplo.com" />
        </label>
        <label className="flex flex-col gap-2">
          Servicio
          <select className="rounded-xl p-3 bg-slate-900 border border-slate-700">
            <option>Corte</option>
            <option>Afeitado</option>
            <option>Barba</option>
          </select>
        </label>
        <button className="rounded-xl bg-gold text-black font-bold py-3 hover:bg-white/90">Enviar reserva</button>
      </form>
    </section>
  );
}
