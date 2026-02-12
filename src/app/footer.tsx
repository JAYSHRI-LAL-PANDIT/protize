import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/config/nav-menu";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

type SocialItem = {
  name: string;
  href: string;
  short?: string;
};

const BRAND = {
  name: "Protize",
  logoSrc: "/protize.png",
  logoWidth: 300,
  logoHeight: 52,
  description:
    "We build modern web, mobile, and backend systems with performance, scale, and great UX.",
  copyright: `© ${new Date().getFullYear()} Protize. All rights reserved.`,
};

const SOCIALS: SocialItem[] = [
  { name: "Facebook", href: "https://facebook.com", short: "f" },
  { name: "X", href: "https://x.com", short: "x" },
  { name: "LinkedIn", href: "https://linkedin.com", short: "in" },
  { name: "Instagram", href: "https://instagram.com", short: "ig" },
];

const Footer = () => {
  const grouped: FooterColumn[] = NAV_ITEMS.filter(
    (item) => item.children?.length,
  ).map((section) => ({
    title: section.label,
    links: [
      ...(section.href
        ? [{ label: `All ${section.label}`, href: section.href }]
        : []),
      ...(section.children ?? []).map((c) => ({
        label: c.label,
        href: c.href,
      })),
    ],
  }));

  const standalone: FooterLink[] = NAV_ITEMS.filter(
    (item) => item.href && !item.children?.length,
  ).map((item) => ({
    label: item.label,
    href: item.href!,
  }));

  if (standalone.length) {
    grouped.unshift({
      title: "Quick Links",
      links: standalone,
    });
  }

  const footerColumns = grouped.slice(0, 3);

  return (
    <footer className="bg-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 pt-20">
        {/* top area */}
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr] lg:gap-x-12">
          {/* menu columns */}
          {footerColumns.map((col, index) => (
            <div key={col.title}>
              <h2 className="text-2xl font-semibold leading-tight text-dark">
                {col.title}
              </h2>

              <ul className="mt-8 space-y-1.5">
                {col.links.map((item) => (
                  <li key={`${col.title}-${item.href}`}>
                    <Link
                      href={item.href}
                      className="text-base leading-snug transition-colors opacity-80 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {index === 0 &&
                  [
                    { label: "Contact Us", href: "/contact" },
                    { label: "Insights", href: "/insights" },
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms of Service", href: "/terms" },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-base leading-snug transition-colors opacity-80 hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* brand column */}
          <div>
            <Link href="/" aria-label={BRAND.name} className="inline-block">
              <Image
                src={BRAND.logoSrc}
                width={BRAND.logoWidth}
                height={BRAND.logoHeight}
                alt={`${BRAND.name} Logo`}
              />
            </Link>

            <p className="mt-1 max-w-90 text-base leading-snug text-text">
              {BRAND.description}
            </p>

            <ul className="mt-4 flex items-center gap-4">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-white"
                    title={s.name}
                  >
                    <span className="text-sm font-semibold">
                      {s.short ?? s.name.slice(0, 2)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* bottom area */}
        <div className="mt-14 border-t border-border py-7">
          <p className="text-center text-sm text-text">{BRAND.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
