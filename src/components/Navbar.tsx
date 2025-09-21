import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, LogOut, User, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  compact?: boolean;
}

type NavItem = {
  label: string;
  to: string;
  type: 'route' | 'anchor';
};

const navItems: NavItem[] = [
  { label: 'My Todos', to: '/dashboard', type: 'route' },
  { label: 'AI Assistant', to: '#ai-assistant', type: 'anchor' },
];

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, compact = false }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleAnchorNavigation = useCallback((hash: string) => {
    const targetId = hash.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    closeMobileMenu();
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const body = document.body;
    const previousOverflow = body.style.overflow;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    body.style.overflow = 'hidden';

    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const triggerElement = triggerRef.current;
    const focusFirstItem = () => {
      if (!menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    };

    const animationFrame = window.requestAnimationFrame(focusFirstItem);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(focusableSelector);
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        } else if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
      const focusTarget = triggerElement ?? previousFocusRef.current;
      focusTarget?.focus({ preventScroll: true });
    };
  }, [isMenuOpen, closeMobileMenu]);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  useEffect(() => {
    if (isMenuOpen && showUserMenu) {
      setShowUserMenu(false);
    }
  }, [isMenuOpen, showUserMenu]);

  useEffect(() => {
    if (!showUserMenu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowUserMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showUserMenu]);

  const renderDesktopNavItem = (item: NavItem) => {
    const isActive = item.type === 'route' && location.pathname === item.to;
    const baseClasses = cn(
      'inline-flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    );

    if (item.type === 'route') {
      return (
        <Link
          key={item.to}
          to={item.to}
          className={cn(baseClasses, isActive && 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white')}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <button
        key={item.to}
        type="button"
        onClick={() => handleAnchorNavigation(item.to)}
        className={baseClasses}
      >
        {item.label}
      </button>
    );
  };

  const handleMobileItemClick = (item: NavItem) => {
    if (item.type === 'anchor') {
      closeMobileMenu();
      window.requestAnimationFrame(() => handleAnchorNavigation(item.to));
    } else {
      closeMobileMenu();
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className={cn('flex items-center justify-center rounded-xl bg-indigo-600 text-white', compact ? 'h-8 w-8' : 'h-10 w-10 sm:h-11 sm:w-11')}>
            <Bot className={cn('text-white', compact ? 'h-4 w-4' : 'h-5 w-5 sm:h-6 sm:w-6')} />
          </div>
          <div className="min-w-0">
            <p className={cn('font-semibold text-slate-900 dark:text-white', compact ? 'text-lg' : 'text-xl sm:text-[length:var(--font-size-lg)]')}>
              Todo AI
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Focus on what matters</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 pl-6" role="navigation" aria-label="Primary">
            {navItems.map(renderDesktopNavItem)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
            className="tap-target rounded-lg border border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={showUserMenu}
              className="tap-target rounded-lg border border-transparent bg-transparent text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
              title="Account options"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
                  <User className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium leading-snug text-slate-700 dark:text-slate-200">
                  {user?.username}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 z-20 mt-3 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.username}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 break-words">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="tap-target rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900 lg:hidden"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-controls="primary-navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {showUserMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} aria-hidden="true" />
      )}

      {isMenuOpen && (
        <>
          <div
            className="mobile-nav-overlay fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={closeMobileMenu}
          />
          <div
            ref={menuRef}
            id="primary-navigation"
            role="navigation"
            aria-label="Mobile"
            className="mobile-nav-panel fixed inset-y-0 right-0 z-40 flex w-full max-w-xs flex-col bg-white shadow-xl dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Menu</span>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="tap-target rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="flex flex-col gap-3">
                {navItems.map((item) =>
                  item.type === 'route' ? (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => handleMobileItemClick(item)}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/40 dark:focus-visible:ring-offset-slate-900"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.to}
                      type="button"
                      onClick={() => handleMobileItemClick(item)}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/40 dark:focus-visible:ring-offset-slate-900"
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>

              <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Signed in as</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white break-words">{user?.username}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300 break-words">{user?.email}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  aria-pressed={darkMode}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/40 dark:focus-visible:ring-offset-slate-900"
                >
                  <span>{darkMode ? 'Dark mode on' : 'Dark mode off'}</span>
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
