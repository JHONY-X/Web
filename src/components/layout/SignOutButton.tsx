"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Sign-out request failed with status ${response.status}`);
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out.", error);
      setErrorMessage("Could not sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        className="w-full justify-start text-accent-700 hover:bg-accent-50 hover:text-accent-800"
        onClick={handleSignOut}
        isLoading={isSigningOut}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Sign out
      </Button>
      {errorMessage && (
        <p role="alert" className="mt-2 px-3 text-xs text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
