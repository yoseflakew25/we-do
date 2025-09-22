'use client';

import BrowseOpportunity from '@/features/landing-page-v2/BrowseOpportunity';
import DownloadMobile from '@/features/landing-page-v2/DownloadMobile';
import FactsAndFigures from '@/features/landing-page-v2/FactsAndFigures';
import ForOrganizations from '@/features/landing-page-v2/ForOrganizations';
import ForVolunteers from '@/features/landing-page-v2/ForVolunteers';
import GetYourIdeal from '@/features/landing-page-v2/GetYourIdeal';
import HeroSection from '@/features/landing-page-v2/HeroSection';
import OurPartners from '@/features/landing-page-v2/OurPartners';
import ForThrive from '@/features/landing-page-v2/WeThrive';
import Footer from '@/features/landing-page/components/Footer';
import PriceListing from '@/features/organization/pricing/PriceListing';

function LandingPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Gradient */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <div className='xl:container flex flex-col xl:mb-32 lg:mb-24 md:mb-16 sm:mb-10 mt-32 mb-6 xl:gap-32 lg:gap-24 md:gap-16 sm:gap-10 gap-6'>        
          <ForOrganizations />
          <GetYourIdeal />
          <ForVolunteers />
          <BrowseOpportunity />
          <PriceListing/>
          <ForThrive />
          <FactsAndFigures />
          <OurPartners />
          <DownloadMobile />

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
