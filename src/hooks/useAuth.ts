"use client";

import { useState, useEffect } from "react";
import { getAccessToken, clearTokens } from "@/lib/auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(Boolean(getAccessToken()));
    setIsLoading(false);
  }, []);

  function logout() {
    clearTokens();
    setIsAuthenticated(false);
  }

  return { isAuthenticated, isLoading, logout };
}
