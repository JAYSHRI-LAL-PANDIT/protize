"use client";

import HamburgerMenu from "@/components/shared-ui/hamburger-menu";
import CustomButton from "@/components/shared-ui/custom-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared-ui/container";
import { NAV_ITEMS, NavChild } from "@/config/nav-menu";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type DesktopLinkProps = {
  label: string;
  href: string;
  pathname: string;
};

function DesktopLink({ label, href, pathname }: DesktopLinkProps) {
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative px-2 py-2 uppercase text-sm font-bold tracking-wide transition-colors ${
        active ? "text-primary" : "text-black/90 hover:text-primary/90"
      }`}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

type DesktopDropdownProps = {
  label: string;
  href: string;
  items: NavChild[];
  pathname: string;
};

function DesktopDropdown({
  label,
  href,
  items,
  pathname,
}: DesktopDropdownProps) {
  const active = isActivePath(pathname, href);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const handleMouseLeave = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearCloseTimer]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-2"
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-expanded={open}
            className={`group relative px-2 py-2 uppercase text-sm font-bold tracking-wide transition-colors outline-none ${
              active ? "text-primary" : "text-black/90 hover:text-primary/90"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              {label}
              <span
                className={`text-xs transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▾
              </span>
            </span>
            <span
              aria-hidden
              className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary transition-transform duration-300 ${
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="mt-2 w-80 rounded-xl border border-black/10 bg-white p-1 shadow-xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DropdownMenuItem asChild>
            <Link
              href={href}
              className="flex rounded-lg px-3 py-3 text-sm font-semibold hover:bg-black/5"
            >
              View all {label}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 hover:bg-black/5"
              >
                <span className="font-medium">{item.label}</span>
                {item.description ? (
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const closeDrawer = useCallback(() => setOpen(false), []);

  // Close drawer on route change
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Close on outside click + Esc + lock body scroll while drawer open
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      const clickedInsideDrawer =
        !!menuRef.current && menuRef.current.contains(target);

      const clickedOnTrigger =
        !!triggerRef.current && triggerRef.current.contains(target);

      if (!clickedInsideDrawer && !clickedOnTrigger) {
        closeDrawer();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeDrawer]);

  // Shadow on scroll (raf optimized)
  useEffect(() => {
    let raf = 0;

    const update = () => {
      const next = window.scrollY > 80;
      setScrolled((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b border-black/5 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/75 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <Container className="mx-auto flex h-20 w-full items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/protize.png"
              alt="Protize Logo"
              width={180}
              height={56}
              priority
              className="h-auto w-32 object-contain sm:w-36 md:w-44"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 176px"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex lg:gap-2">
            {NAV_ITEMS.map((item) => {
              if (!item.href) return null;

              if (item.children?.length) {
                return (
                  <DesktopDropdown
                    key={item.label}
                    label={item.label}
                    href={item.href}
                    items={item.children}
                    pathname={pathname}
                  />
                );
              }

              return (
                <DesktopLink
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  pathname={pathname}
                />
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <CustomButton>Get Started</CustomButton>
          </div>

          {/* Mobile toggle */}
          <div ref={triggerRef} className="md:hidden">
            <HamburgerMenu open={open} onToggle={() => setOpen((p) => !p)} />
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/45 md:hidden"
              onClick={closeDrawer}
              aria-hidden="true"
            />

            <motion.aside
              key="drawer"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed right-0 top-0 z-40 h-screen w-full max-w-md border-l border-black/10 bg-white shadow-2xl md:hidden"
            >
              <div className="mt-20 h-[calc(100vh-4rem)] overflow-y-auto px-5 py-6 text-black">
                <div className="space-y-5">
                  {NAV_ITEMS.map((item) => {
                    if (!item.href) return null;

                    if (item.children?.length) {
                      return (
                        <div key={item.label} className="space-y-2">
                          <Link
                            href={item.href}
                            onClick={closeDrawer}
                            aria-current={
                              isActivePath(pathname, item.href)
                                ? "page"
                                : undefined
                            }
                            className={`block text-base font-semibold uppercase tracking-wide ${
                              isActivePath(pathname, item.href)
                                ? "text-primary"
                                : "text-black hover:text-primary"
                            }`}
                          >
                            {item.label}
                          </Link>

                          <div className="ml-1 flex flex-col gap-1 border-l border-black/10 pl-3">
                            {item.children.map((c) => (
                              <Link
                                key={c.href}
                                href={c.href}
                                onClick={closeDrawer}
                                aria-current={
                                  isActivePath(pathname, c.href)
                                    ? "page"
                                    : undefined
                                }
                                className={`rounded-md px-2 py-1.5 text-sm ${
                                  isActivePath(pathname, c.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-neutral-700 hover:bg-black/5 hover:text-primary"
                                }`}
                              >
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={closeDrawer}
                        aria-current={
                          isActivePath(pathname, item.href) ? "page" : undefined
                        }
                        className={`block rounded-md px-1 py-1 text-base font-semibold uppercase tracking-wide transition-colors ${
                          isActivePath(pathname, item.href)
                            ? "text-primary"
                            : "text-black hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-black/10 pt-5">
                  <CustomButton>Get Started</CustomButton>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
