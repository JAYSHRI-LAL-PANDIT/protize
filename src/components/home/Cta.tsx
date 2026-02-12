import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../shared-ui/container";
import { markdownify } from "@/lib/utils/textConverter";

type CtaButton = {
  enable?: boolean;
  label?: string;
  link?: string;
  rel?: string;
};

export type CtaSection = {
  title: string;
  content?: string;
  image?: string;
  button?: CtaButton;
};

type CtaProps = {
  cta: CtaSection;
};

function Cta({ cta }: CtaProps) {
  if (!cta) return null;

  const showButton = Boolean(
    cta.button?.enable && cta.button?.label && cta.button?.link,
  );

  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background p-6 shadow-xl shadow-black/5 md:p-10 lg:p-12">
          {/* Soft background accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-14 -top-14 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
          </div>

          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            {/* Content */}
            <div className="order-2 text-center md:order-1 md:text-left">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Let’s build something great
              </span>

              <h2 className="mt-4 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                {cta.title}
              </h2>

              {cta.content ? (
                <div className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {markdownify(cta.content, "div")}
                </div>
              ) : null}

              {showButton ? (
                <Link
                  href={cta.button!.link!}
                  rel={cta.button?.rel}
                  className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                >
                  {cta.button!.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : null}
            </div>

            {/* Image */}
            <div className="order-1 md:order-2">
              {cta.image ? (
                <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-border/60 bg-white shadow-md">
                  <Image
                    src={cta.image}
                    alt={cta.title || "Call to action image"}
                    width={700}
                    height={460}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 768px) 90vw, 40vw"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Cta;
