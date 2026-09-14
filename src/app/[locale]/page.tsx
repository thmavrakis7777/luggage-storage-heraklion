import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { WalkInNotice } from '@/components/sections/WalkInNotice';
import { QuickBenefits } from '@/components/sections/QuickBenefits';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Pricing } from '@/components/sections/Pricing';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Location } from '@/components/sections/Location';
import { AirportTransfer } from '@/components/sections/AirportTransfer';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';

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
