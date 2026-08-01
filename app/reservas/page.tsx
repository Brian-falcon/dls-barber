import BookingForm from "@/components/booking/BookingForm";
import Calendar from "@/components/booking/Calendar";
import TimeSelector from "@/components/booking/TimeSelector";

export default function ReservasPage() {
  return (
    <main className="min-h-screen px-6 py-32 text-white">
      <section className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-5xl font-bold mb-4">Reservas</h1>
          <p className="text-slate-300 max-w-3xl">
            Elegí día y hora para tu próximo turno con nuestros barberos.
          </p>
        </div>
        <BookingForm />
        <Calendar />
        <TimeSelector />
      </section>
    </main>
  );
}
