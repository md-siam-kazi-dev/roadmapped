"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} {...props} className="pr-10" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
        onClick={() => setShow((v) => !v)}
      >
        {show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </Button>
    </div>
  );
}