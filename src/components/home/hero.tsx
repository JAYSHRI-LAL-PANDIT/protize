import { markdownify } from "@/lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../shared-ui/container";
import { withBasePath } from "@/lib/utils";

type BannerButton = {
  label?: string;
  link?: string;
};

export type HomeBanner = {
  title: string;
  content?: string;
  image?: string;
  button?: BannerButton;
};

type HomeHeroProps = {
  banner: HomeBanner;
};

const HomeHero = ({ banner }: HomeHeroProps) => {
  const cta = banner.button;

  return (
    <Container className="relative overflow-hidden py-10 md:py-16">
      <div className="mx-auto max-w-5xl text-center">
        {/* Title */}
        <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-6xl">
          {banner.title}
        </h1>

        {/* Content */}
        {banner.content ? (
          <div className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg xl:text-xl">
            {markdownify(banner.content, "div")}
          </div>
        ) : null}

        {/* CTA */}
        {cta ? (
          <div className="mt-8 flex items-center justify-center">
            <Link
              href={cta.link ?? "/contact"}
              rel={cta.label}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label={cta.label}
            >
              {cta.label}
            </Link>
          </div>
        ) : null}

        {/* Hero image */}
        {banner.image ? (
          <div className="mx-auto mt-10 max-w-4xl md:mt-14">
            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-2 shadow-2xl shadow-black/5 backdrop-blur-sm">
              <Image
                className="h-auto w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                src={withBasePath(banner.image)}
                width={1400}
                height={760}
                alt={banner.title || "Banner image"}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              />
            </div>
          </div>
        ) : null}
      </div>
    </Container>
  );
};

export default HomeHero;
