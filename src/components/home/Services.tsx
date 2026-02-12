"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Container } from "../shared-ui/container";

type ServiceButton = {
  enable?: boolean;
  label?: string;
  link?: string;
};

export type ServiceItem = {
  title: string;
  content: string;
  images: string[];
  button?: ServiceButton;
};

type ServicesProps = {
  services: ServiceItem[];
};

function ServiceMedia({
  service,
  priority = false,
}: {
  service: ServiceItem;
  priority?: boolean;
}) {
  const hasMultiple = service.images.length > 1;

  // Single image => no swiper required
  if (!hasMultiple) {
    const img = service.images[0];
    if (!img) return null;

    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="relative aspect-16/10 w-full">
          <Image
            src={img}
            alt={`${service.title} preview`}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        grabCursor
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        className="
          service-swiper
          [&_.swiper-pagination]:bottom-3
          [&_.swiper-pagination-bullet]:bg-white/70
          [&_.swiper-pagination-bullet]:opacity-100
          [&_.swiper-pagination-bullet-active]:bg-primary
        "
      >
        {service.images.map((slide, index) => (
          <SwiperSlide key={`${slide}-${index}`}>
            <div className="relative aspect-16/10 w-full">
              <Image
                src={slide}
                alt={`${service.title} preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

const Services = ({ services }: ServicesProps) => {
  if (!services?.length) return null;

  return (
    <>
      {services.map((service, index) => {
        const isOdd = index % 2 !== 0;
        const showButton = Boolean(
          service.button?.enable &&
          service.button?.label &&
          service.button?.link,
        );

        return (
          <section
            key={`service-${index}-${service.title}`}
            className={`py-14 md:py-20 ${isOdd ? "bg-theme-light/60" : "bg-transparent"}`}
          >
            <Container>
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Media */}
                <div className={isOdd ? "order-1" : "order-1 lg:order-2"}>
                  <ServiceMedia service={service} priority={index === 0} />
                </div>

                {/* Content */}
                <div className={isOdd ? "order-2" : "order-2 lg:order-1"}>
                  <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Service {String(index + 1).padStart(2, "0")}
                  </span>

                  <h2 className="mt-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                    {service.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {service.content}
                  </p>

                  {showButton ? (
                    <Link
                      href={service.button!.link!}
                      className="group mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                    >
                      {service.button!.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
};

export default Services;
