import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { markdownify } from "@/lib/utils/textConverter";
import { Container } from "../shared-ui/container";
import { withBasePath } from "@/lib/utils";

export type WorkflowSection = {
  title: string;
  image: string;
  description?: string;
  highlights?: string[];
};

type WorkflowProps = {
  workflow: WorkflowSection;
};

const DEFAULT_HIGHLIGHTS = [
  "Discovery & planning",
  "Design & rapid development",
  "QA, launch, and continuous support",
];

const Workflow = ({ workflow }: WorkflowProps) => {
  if (!workflow?.title && !workflow?.image) return null;

  const hasDescription = Boolean(workflow?.description?.trim());
  const highlights =
    Array.isArray(workflow?.highlights) && workflow.highlights.length > 0
      ? workflow.highlights
      : DEFAULT_HIGHLIGHTS;

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <div className="mt-4">
            {markdownify(
              workflow.title,
              "h2",
              "mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl",
            )}
          </div>

          {hasDescription ? (
            <div className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {markdownify(workflow.description!, "p")}
            </div>
          ) : null}
        </div>

        {/* highlights */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm font-medium text-foreground shadow-sm backdrop-blur"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* visual */}
        {workflow.image ? (
          <div className="mx-auto mt-10 max-w-6xl md:mt-12">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background shadow-xl shadow-black/5">
              <Image
                src={withBasePath(workflow.image)}
                alt={workflow.title || "Workflow image"}
                width={1920}
                height={900}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 1200px"
                priority={false}
              />
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
};

export default Workflow;
