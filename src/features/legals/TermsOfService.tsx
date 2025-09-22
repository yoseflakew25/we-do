import {
  Title,
  Header1,
  Header2,
  Header3,
  Content,
  List,
} from './TextComponents';
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6'>
        {/* Page Title */}
        <Title>Terms of Service and Use</Title>
        <Content>Last Updated: Sep 3, 2024</Content>

        <hr />
        <div className='h-4'></div>

        {/* Introduction */}
        <Header1>Welcome to HOOPOE!</Header1>
        <Content>
          HOOPOE ("HOOPOE," "we," "us," or "our") provides an online platform
          that connects organizations and opportunity seekers to facilitate
          participation in all kinds of opportunities. These Terms of Service
          and Use (the "Terms") govern your use of the HOOPOE website and
          services, including but not limited to the online opportunity matching
          services and other related services offered by HOOPOE (collectively
          referred to as the “Services”).
        </Content>
        <Content>
          By accessing or using the Services, you agree to comply with and be
          bound by these Terms. If you do not agree to these Terms, you may not
          use the Services.
        </Content>

        {/* HOOPOE Accounts Section */}
        <Header2>1. HOOPOE Accounts</Header2>
        <Header3>1.1. Registering for an Account:</Header3>
        <Content>
          To access certain features of the Services, you may be required to
          create an account ("Account") with HOOPOE. When creating an Account,
          you agree to:
        </Content>
        <List
          items={[
            'Provide accurate, current, and complete information.',
            'Maintain and promptly update your Account information to keep it accurate, current, and complete.',
            'Be responsible for the confidentiality of your Account and password, and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your Account.',
          ]}
        />
        <Content>
          If you are registering on behalf of an organization, you confirm that
          the organization has undergone and passed all required document and
          legality checks by HOOPOE. You must have the authority to bind that
          entity to these Terms.
        </Content>

        <Header3>1.2. Eligibility:</Header3>
        <Content>By registering for an Account, you represent that:</Content>
        <List
          items={[
            'You are at least 18 years old, or if you are under 18 years old, you have obtained the consent of your parent or legal guardian who agrees to be bound by these Terms on your behalf.',
            'Your use of the Services does not violate any applicable laws or regulations.',
            'If you are registering on behalf of an organization, the organization is a legally recognized entity in good standing, and all the information provided about the organization is accurate. The organization must have passed all required document and legality checks by HOOPOE before being approved and made available on the platform.',
          ]}
        />

        <Header3>1.3. Account Responsibilities:</Header3>
        <Content>
          You are responsible for maintaining the confidentiality of your
          Account credentials and are fully responsible for all activities that
          occur under your Account. You agree to:
        </Content>
        <List
          items={[
            'Immediately notify HOOPOE of any unauthorized use of your Account or any other breach of security.',
            'Ensure that you exit from your Account at the end of each session.',
            'Refrain from sharing your Account credentials with others.',
          ]}
        />
        <Content>
          HOOPOE E cannot and will not be liable for any loss or damage arising
          from your failure to comply with these obligations.
        </Content>

        {/* Use of Services Section */}
        <Header2>2. Use of Services</Header2>
        <Header3>2.1. Use of the Platform:</Header3>
        <Content>
          As a user of the Services, you agree to use the platform in accordance
          with the following:
        </Content>
        <List
          items={[
            'Organizations may use the Services to create, post, and manage opportunities.',
            'Opportunity seekers may use the Services to search, apply for, and engage in opportunities.',
            'Both Organizations and opportunity seekers may provide feedback and ratings based on their experience with each other.',
          ]}
        />

        <Header3>2.2. Prohibited Activities:</Header3>
        <Content>
          You agree not to engage in the following prohibited activities:
        </Content>
        <List
          items={[
            'Using the Services for any illegal or unauthorized purpose.',
            'Engaging in any form of automated data collection, including without limitation, harvesting, data mining, or scraping.',
            'Attempting to gain unauthorized access to any portion of the Services or any other systems or networks connected to the Services.',
            "Engaging in any conduct that could damage, disable, overburden, or impair the Services or interfere with any other party's use and enjoyment of the Services.",
            'Impersonating any person or entity or otherwise misrepresenting your affiliation with a person or entity.',
            'Posting content that is unlawful, defamatory, abusive, obscene, harassing, or otherwise objectionable.',
          ]}
        />

        {/* Interactions with Other Users */}
        <Header2>3. Interactions with Other Users</Header2>
        <Header3>3.1. Your Responsibility:</Header3>
        <Content>
          You are solely responsible for your interactions with other users of
          the Services, including Organizations and opportunity seekers. HOOPOE
          assesses the accuracy of information provided by organizations but
          does not screen individual users or verify the accuracy of information
          they provide. You are responsible for conducting your own due
          diligence before engaging with other users. Once you enter into an
          arrangement, you assume all responsibility for any interactions under
          that agreement.
        </Content>

        <Header3>3.2. Disputes:</Header3>
        <Content>
          HOOPOE E reserves the right, but is not obligated, to monitor
          interactions and disputes between you and other HOOPOE . While HOOPOE
          verifies organizational information for accuracy, it does not take
          part in the resolution of disputes arising from interactions between
          opportunity seekers and organizations. You agree to release HOOPOE
          from any claims, demands, and damages arising from disputes with other
          users or parties.
        </Content>

        <Content>
          Additionally, it is the responsibility of the organization to
          thoroughly review applications, conduct interviews, assess applicants,
          and ultimately accept opportunity seekers. Any disputes that may arise
          post-acceptance are solely the responsibility of the organization and
          the opportunity seeker involved.
        </Content>

        {/* Additional Sections */}
        <Header2>4. Content Provided by Users</Header2>

        <Header3>4.1. Posting Opportunities:</Header3>
        <Content>
          The Services allow organizations to upload, submit, store, send, or
          receive content related to all sorts of opportunities ("User
          Content"). Organizations retain ownership of any intellectual property
          rights that they hold in that content. In short, what belongs to the
          organization stays with the organization.
        </Content>

        <Header3>4.2. License Grant:</Header3>
        <Content>
          Organizations are solely responsible for the content they post on the
          platform. HOOPOE does not verify the accuracy or completeness of the
          content provided by the organizations nor does it endorse any content
          posted by organizations. Organizations must ensure the accuracy,
          legality, and appropriateness of the content they provide.
        </Content>

        <Header3>4.3. User Responsibilities:</Header3>
        <Content>
          Organizations are solely responsible for the content they post on the
          platform. HOOPOE does not verify the accuracy or completeness of the
          content provided by the organizations nor does it endorse any content
          posted by organizations. Organizations must ensure the accuracy,
          legality, and appropriateness of the content they provide.
        </Content>
        <Content>
          Opportunity seekers do not post content but can apply to the
          opportunities listed by the organizations. Opportunity seekers are
          responsible for ensuring that their applications and interactions
          comply with HOOPOE’s terms and the specific requirements of the
          opportunities.
        </Content>

        {/* Privacy and Data Security */}
        <Header2>5. Privacy and Data Security</Header2>
        <Content>
          Your privacy is important to us. Our Privacy Policy explains how we
          collect, use, and share your personal information. By using the
          Services, you consent to our collection, use, and sharing of personal
          information as described in our Privacy Policy.
        </Content>

        {/* Termination Section */}
        <Header2>6. Termination</Header2>
        <Header3>6.1. Termination by You:</Header3>
        <Content>
          You may terminate your Account at any time by contacting us or by
          following the instructions on the platform.
        </Content>

        <Header3>6.2. Termination by HOOPOE:</Header3>
        <Content>
          We may terminate or suspend your access to the Services at any time,
          with or without cause, with or without notice, effective immediately.
          If we terminate your access without cause, we may, but are not
          obligated to, refund a prorated portion of any fees paid by you for
          the portion of the Services not received after termination.
        </Content>

        {/* Footer Section */}
        <Header2>Contact Us</Header2>
        <Content>
          If you have any questions about these Terms or the Services, please
          contact us at{' '}
        </Content>
        <Content>
          Email:{' '}
          <a href='mailto:contact-akil@a2sv.org' className='text-blue-600'>
            contact-akil@a2sv.org
          </a>
          <br />
          Phone:{' '}
          <a href='tel:+251930774196' className='text-blue-600'>
            +251-930-774-196
          </a>
        </Content>
      </div>
    </div>
  );
};

export default TermsOfService;
