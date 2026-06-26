"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function AuthActionLink({ href, children, className, onClick }: Props) {
  const { token } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [pending, setPending] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    if (token) {
      router.push(href);
    } else {
      setPending(true);
      setShowAuth(true);
    }
  };

  return (
    <>
      {showAuth && (
        <AuthModal
          open={showAuth}
          onClose={() => { setShowAuth(false); setPending(false); }}
          onSuccess={() => {
            setShowAuth(false);
            setPending(false);
            router.push(href);
          }}
          title="Connectez-vous pour continuer"
        />
      )}
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
    </>
  );
}
