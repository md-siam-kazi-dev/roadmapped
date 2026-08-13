"use client";

import * as React from "react";
import { toCountdown, type Countdown } from "@/lib/utils/time";

export function useCountdown(deadlineAt: string): Countdown {
  const [cd, setCd] = React.useState<Countdown>(() => toCountdown(deadlineAt));

  React.useEffect(() => {
    const id = setInterval(() => setCd(toCountdown(deadlineAt)), 1000);
    return () => clearInterval(id);
  }, [deadlineAt]);

  return cd;
}