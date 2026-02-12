import Cta, { CtaSection } from "@/components/home/Cta";
import HomeHero, { HomeBanner } from "@/components/home/hero";
import HomeFeatures, { FeatureSection } from "@/components/home/HomeFeatures";
import Services, { ServiceItem } from "@/components/home/Services";
import Workflow, { WorkflowSection } from "@/components/home/Workflow";
import { getListPage } from "@/lib/contentParser";

type HomeFrontmatter = {
  banner?: HomeBanner;
  feature?: FeatureSection;
  services?: ServiceItem[];
  workflow?: WorkflowSection;
  call_to_action?: CtaSection;
};

export default async function Index() {
  const homePage = await getListPage("content/_index.md");
  const frontmatter = (homePage.frontmatter ?? {}) as HomeFrontmatter;

  const banner = frontmatter.banner!;
  const feature = frontmatter.feature!;
  const services = frontmatter.services!;
  const workflow = frontmatter.workflow!;
  const cta = frontmatter.call_to_action!;

  return (
    <section>
      <HomeHero banner={banner} />
      <HomeFeatures feature={feature} />
      <Services services={services} />
      <Workflow workflow={workflow} />
      <Cta cta={cta} />
    </section>
  );
}
