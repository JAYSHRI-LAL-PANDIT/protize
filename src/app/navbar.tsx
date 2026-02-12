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

type NavChild = {
  label: string;
  href: string;
  description?: string;
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Web Development", href: "/services/web-development" },
      {
        label: "Mobile App Development",
        href: "/services/mobile-app-development",
      },
      { label: "Backend & APIs", href: "/services/backend-apis" },
      { label: "UI/UX & Design", href: "/services/ui-ux" },
      { label: "Cloud & DevOps", href: "/services/cloud-devops" },
    ],
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "Case Studies", href: "/portfolio" },
      { label: "Tech Stack", href: "/portfolio/tech" },
    ],
  },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Company", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    children: [
      { label: "Blog", href: "/insights/blog" },
      { label: "Events", href: "/insights/events" },
    ],
  },
];

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
      className={`uppercase text-sm font-bold transition-colors ${
        active ? "text-primary" : "text-black hover:text-primary/80"
      }`}
    >
      {label}
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
        className="py-3"
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-expanded={open}
            className={`px-2 uppercase text-sm font-bold transition-colors outline-none ${
              active ? "text-primary" : "text-black hover:text-primary/80"
            }`}
          >
            {label}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-80"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DropdownMenuItem asChild>
            <Link href={href} className="flex flex-col gap-0.5 py-5">
              <span className="font-semibold">View all {label}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex flex-col gap-0.5 py-2">
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
      if (menuRef.current && !menuRef.current.contains(target)) {
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
        className={`sticky top-0 z-50 w-full bg-background transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <Container className="mx-auto flex w-full items-center justify-between ">
          {/* Logo */}
          <div className="relative h-auto w-60">
            <Link href="/" aria-label="Go to homepage">
              <Image
                src="/protize.png"
                alt="Protize Logo"
                height={100}
                width={200}
                priority
                sizes="(max-width: 768px) 96px, 160px"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 md:flex lg:gap-10">
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

          <CustomButton>Get Started</CustomButton>

          {/* Mobile toggle */}
          <HamburgerMenu open={open} onToggle={() => setOpen((p) => !p)} />
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
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
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
              className="fixed right-0 top-0 z-50 h-screen w-[78%] max-w-sm bg-white shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-6 px-8 pt-24 text-black">
                {NAV_ITEMS.map((item) => {
                  if (!item.href) return null;

                  if (item.children?.length) {
                    return (
                      <div key={item.label} className="space-y-3">
                        <Link
                          href={item.href}
                          onClick={closeDrawer}
                          aria-current={
                            isActivePath(pathname, item.href)
                              ? "page"
                              : undefined
                          }
                          className={`text-lg font-semibold ${
                            isActivePath(pathname, item.href)
                              ? "text-primary"
                              : "hover:text-primary"
                          }`}
                        >
                          {item.label}
                        </Link>

                        <div className="flex flex-col gap-2 pl-3">
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
                              className={`text-sm ${
                                isActivePath(pathname, c.href)
                                  ? "text-primary"
                                  : "text-neutral-700 hover:text-primary"
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
                      className={`text-lg font-medium transition-colors ${
                        isActivePath(pathname, item.href)
                          ? "text-primary"
                          : "hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
