'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { useThemeStore } from '@/stores/theme';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const pathname = usePathname() || '/';
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAdmin, signOut, signIn } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Favourites', href: '/favourites' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:animate-pulse-glow transition-all">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block">Pipasa Shoe House</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-secondary hover:bg-accent transition-all text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-secondary hover:bg-accent transition-all"
              >
                <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                      {isAdmin && <span className="text-xs text-primary font-medium">Admin</span>}
                    </div>
                    <div className="p-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/25"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            className="md:hidden p-2.5 rounded-xl bg-secondary hover:bg-accent transition-all"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full mt-4 px-4 py-3 rounded-xl gradient-bg text-white font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
