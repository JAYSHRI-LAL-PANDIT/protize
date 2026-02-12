import { markdownify } from "@/lib/utils/textConverter";
import Image from "next/image";
import { Container } from "../shared-ui/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type FeatureItem = {
  name: string;
  icon?: string;
  content?: string;
};

export type FeatureSection = {
  title: string;
  features: FeatureItem[];
};

type HomeFeaturesProps = {
  feature: FeatureSection;
};

const HomeFeatures = ({ feature }: HomeFeaturesProps) => {
  if (
    !feature ||
    !Array.isArray(feature.features) ||
    feature.features.length === 0
  ) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-primary-foreground">
      <Container className="py-10 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mt-4">
            {markdownify(
              feature.title,
              "h2",
              "text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl",
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {feature.features.map((item, i) => (
            <Card
              key={`feature-${i}-${item.name}`}
              className="group rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardHeader className="pb-0">
                <div className="mb-4 flex items-center justify-center">
                  {item.icon && (
                    <Image
                      src={item.icon}
                      width={24}
                      height={24}
                      alt={`${item.name} icon`}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                </div>

                <CardTitle className="text-lg md:text-xl text-center">
                  {item.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                {item.content ? (
                  <CardDescription className="text-sm text-center leading-relaxed md:text-base">
                    {item.content}
                  </CardDescription>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HomeFeatures;
