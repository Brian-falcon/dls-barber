import React from "react";
import PasswordForm from "@/components/dashboard/PasswordForm";

type UserProfile = {
  id: string;
  nombre?: string;
  email: string;
  telefono?: string | null;
  rol?: "ADMIN" | "BARBERO" | "CLIENTE";
};

export default function ProfileCard({ user }: { user: UserProfile | null }) {
  if (!user) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
        <p className="text-gray-300">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-lg border border-gray-800">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-yellow-700/20 flex items-center justify-center text-2xl text-[#D4AF37]">{(user.nombre || user.email || "U")[0]}</div>
        <div>
          <h3 className="text-lg font-semibold">{user.nombre ?? user.email}</h3>
          <p className="text-sm text-gray-400">{user.rol === "ADMIN" ? "Administrador" : user.rol === "BARBERO" ? "Barbero" : "Cliente"}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Email</span>
          <span className="text-right text-gray-200">{user.email}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Teléfono</span>
          <span className="text-right text-gray-200">{user.telefono ?? "-"}</span>
        </div>
      </div>
      <PasswordForm />
    </div>
  );
}
