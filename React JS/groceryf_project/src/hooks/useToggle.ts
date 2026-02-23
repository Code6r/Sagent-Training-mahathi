import { useState } from "react";

export const useToggle = (initial = false): [boolean, () => void, () => void] => {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  const reset = () => setValue(initial);
  return [value, toggle, reset];
};

