import { EcosystemExperience } from "@/components/experience/ecosystem-experience";
import {
  ecosystems,
  getEcosystem,
} from "@/features/ecosystems/catalog";
import { notFound } from "next/navigation";

type ExperiencePageProps = {
  params: Promise<{ ecosystem: string }>;
};

export const instant = false;

export function generateStaticParams() {
  return ecosystems.map(({ slug }) => ({ ecosystem: slug }));
}

export default async function ExperiencePage({
  params,
}: ExperiencePageProps) {
  const { ecosystem: slug } = await params;
  const ecosystem = getEcosystem(slug);

  if (!ecosystem) {
    notFound();
  }

  return <EcosystemExperience key={ecosystem.slug} ecosystem={ecosystem} />;
}
