import PrivacyPolicy from '@/features/legals/PrivacyPolicy';
import TermsOfService from '@/features/legals/TermsOfService';

function LegalsPage() {
  return (
    <div>
      <TermsOfService />
      <div></div>
      <PrivacyPolicy />
    </div>
  );
}

export default LegalsPage;
