"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const ClientUserButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
  }

  return <UserButton />;
};

export default ClientUserButton;