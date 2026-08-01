/* eslint-disable @next/next/no-img-element */
import PasswordForm from "@/components/dashboard/PasswordForm";
import ProfileEditor from "@/components/dashboard/ProfileEditor";

type UserProfile = { id: string; nombre: string; email: string; telefono?: string | null; avatar?: string | null; rol?: "ADMIN" | "BARBERO" | "CLIENTE" };

export default function ProfileCard({ user }: { user: UserProfile | null }) {
  if (!user) return <div className="p-6 bg-gray-900 rounded-lg border border-gray-800"><p className="text-gray-300">Usuario no encontrado</p></div>;
  const role = user.rol === "ADMIN" ? "Administrador" : user.rol === "BARBERO" ? "Barbero" : "Cliente";
  return <div className="p-6 bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-lg border border-gray-800"><div className="flex items-center gap-4"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-yellow-700/20 text-2xl text-[#D4AF37]">{user.avatar ? <img src={user.avatar} alt={`Foto de ${user.nombre}`} className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center">{(user.nombre || user.email || "U")[0].toUpperCase()}</span>}</div><div><h3 className="text-lg font-semibold">{user.nombre}</h3><p className="text-sm text-gray-400">{role}</p></div></div><div className="mt-6 space-y-2 text-sm"><div className="flex justify-between gap-3 text-gray-300"><span>Email</span><span className="text-right text-gray-200 break-all">{user.email}</span></div><div className="flex justify-between gap-3 text-gray-300"><span>Teléfono</span><span className="text-right text-gray-200">{user.telefono ?? "-"}</span></div></div><ProfileEditor initial={user} /><PasswordForm /></div>;
}
