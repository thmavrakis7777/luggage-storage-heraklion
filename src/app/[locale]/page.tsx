import { setRequestLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { WalkInNotice } from '@/components/sections/WalkInNotice';
import { QuickBenefits } from '@/components/sections/QuickBenefits';

const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks').then((m) => m.HowItWorks));
const Pricing = dynamic(() => import('@/components/sections/Pricing').then((m) => m.Pricing));
const WhyChooseUs = dynamic(() => import('@/components/sections/WhyChooseUs').then((m) => m.WhyChooseUs));
const Location = dynamic(() => import('@/components/sections/Location').then((m) => m.Location));
const AirportTransfer = dynamic(() =>
  import('@/components/sections/AirportTransfer').then((m) => m.AirportTransfer)
);
const FAQ = dynamic(() => import('@/components/sections/FAQ').then((m) => m.FAQ));
const FinalCTA = dynamic(() => import('@/components/sections/FinalCTA').then((m) => m.FinalCTA));

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faq.items' });

  const faqKeys = ['size', 'security', 'payment', 'discount', 'groups', 'account'] as const;
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqKeys.map((key) => ({
      '@type': 'Question',
      name: t(`${key}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`${key}.answer`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <QuickBenefits />
      <WalkInNotice />
      <HowItWorks />
      <Pricing />
      <WhyChooseUs />
      <Location />
      <AirportTransfer />
      <FAQ />
      <FinalCTA />
    </>
  );
}
