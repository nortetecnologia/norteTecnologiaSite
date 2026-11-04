"use client";

import { logout } from "@/app/admin/actions";

interface AdminHeaderProps {
  userEmail?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function AdminHeader({ userEmail, onMenuToggle, showMenuButton }: AdminHeaderProps) {
  return (
    <header className="h-14 bg-[#111111] border-b border-[#2a2a2a] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="text-[#6b7280] hover:text-white transition-colors p-1 rounded"
            aria-label="Abrir menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <span className="text-[#4b5563] text-xs hidden sm:block">
          Painel Administrativo
        </span>
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="text-[#6b7280] text-xs hidden sm:block truncate max-w-[200px]">
            {userEmail}
          </span>
        )}
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-[#6b7280] hover:text-white text-xs transition-colors px-2 py-1.5 rounded hover:bg-[#1a1a1a]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
