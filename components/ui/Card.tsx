import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return <div className="rounded-3xl bg-slate-900/90 p-6 shadow-2xl">{children}</div>;
}
