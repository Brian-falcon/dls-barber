import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-2xl bg-slate-900 border border-slate-700 p-3 text-white placeholder:text-slate-500 ${props.className ?? ""}`}
    />
  );
}
