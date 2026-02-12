export type NavChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
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
