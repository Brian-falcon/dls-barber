import { useState } from "react";

export default function useSomething() {
  const [value, setValue] = useState(0);
  const increment = () => setValue((current) => current + 1);

  return { value, increment };
}
