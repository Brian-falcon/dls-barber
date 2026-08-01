import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-2xl bg-gold text-black px-5 py-3 font-semibold transition hover:bg-white/90 ${props.className ?? ""}`}
    />
  );
}
