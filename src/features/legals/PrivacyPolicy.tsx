import { Title, Header1, Header2, Content, List } from './TextComponents';
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div id='privacy-policy' className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6'>
        {/* Page Title */}
        <Title>Privacy Policy</Title>
        <Content>Last Updated: Sep 3, 2024</Content>

        {/* Introduction */}
        <Content>
          This Privacy Policy describes how HOOPOE collects, uses, and shares
          your personal information when you use our services.
        </Content>

        {/* Information We Collect Section */}
        <Header1>1. Personal Information We Collect</Header1>
        <Content>
          Personal information you may provide to us through the Service or
          otherwise includes:
        </Content>
        <List
          items={[
            'Contact Data: Such as your first and last name, email address, phone number, and other contact details.',
            'Demographic Data: Including your city, state, country of residence, postal code, and age.',
            'Profile Data: Including the username and password that you may set to establish an online account, profile picture, interests, skills, preferences, and any other information added to your profile.',
            'Communications Data: Based on our exchanges with you, including when you contact us through the Service or otherwise.',
            'Opportunity seeker Data: Related to opportunities, such as opportunity name, description, location, required skills, timing, and commitment information.',
            'Legal Documentation: For organizations, required legal documents to verify the organization’s legitimacy.',
          ]}
        />

        {/* How We Use Your Information Section */}
        <Header1>2. How We Use Your Personal Information</Header1>
        <Content>
          We may use your personal information for the following purposes or as
          otherwise described at the time of collection:
        </Content>
        <List
          items={[
            'Service Delivery and Operations: Provide, maintain, and improve our platform and services.',
            'User Verification: Verify organization profiles and approve legitimate organizations for the platform.',
            'Communication: Communicate with you about HOOPOE, including service updates, security alerts, and support.',
            'Personalization: Tailor the platform experience according to your preferences and interests.',
            'Compliance and Security: Comply with legal obligations and protect the rights and safety of our users and the platform.',
          ]}
        />

        {/* Sharing Information Section */}
        <Header1>3. How We Share Your Personal Information</Header1>
        <Content>
          We may share your personal information with the following parties:
        </Content>
        <List
          items={[
            'Service Providers: Third parties that provide services on our behalf, such as hosting, information technology, customer support, and email delivery.',
            'Organizations and opportunity seekers: Relevant information is shared between organizations and opportunity seekers to facilitate all sorts of opportunities.',
            'Authorities and Others: Law enforcement, government authorities, and private parties, as necessary or appropriate.',
            'Professional Advisors: Such as lawyers, auditors, and insurers, where necessary in the course of the professional services they render to us.',
            'Business Transferees: We may disclose personal information in connection with an actual or prospective business transaction.',
          ]}
        />

        {/* Your Choices Section */}
        <Header1>4. Your Choices</Header1>
        <Content>Access or Update Your Information:</Content>
        <Content>
          If you have registered for an account with us, you may review and
          update certain account information by logging into the account.
        </Content>
        <Content>Opt-Out of Communications:</Content>
        <Content>
          You may opt-out of marketing-related emails by following the opt-out
          or unsubscribe instructions at the bottom of the email, or by
          contacting us.
        </Content>

        {/* Additional Privacy Policy Sections */}
        <Header1>5. Data Security</Header1>
        <Content>
          We employ technical, organizational, and physical safeguards designed
          to protect the personal information we collect. However, security risk
          is inherent in all internet and information technologies, and we
          cannot guarantee the security of your personal information.
        </Content>

        <Header1>6. International Data Transfers</Header1>
        <Content>
          We are headquartered in Ethiopia and may use service providers that
          operate in other countries. Your personal information may be
          transferred to these countries where privacy laws may not be as
          protective as those in your state, province, or country.
        </Content>

        <Header1>7. Children’s Privacy</Header1>
        <Content>
          We do not knowingly collect personal information from children under
          the age of 13 without parental consent. If we learn that we have
          collected such information without consent, we will delete it.
        </Content>

        <Header1>8. Changes to This Privacy Policy</Header1>
        <Content>
          We reserve the right to modify this Privacy Policy at any time. If we
          make material changes, we will notify you by updating the date of this
          Privacy Policy and posting it on the Service or through other
          appropriate means.
        </Content>

        <Header2>Contact Us</Header2>
        <Content>
          If you have any questions about this Privacy Policy or our practices,
          please contact us at
        </Content>
        <Content>
          Email:{' '}
          <a href='mailto:contact-akil@a2sv.org' className='text-blue-600'>
            contact-akil@a2sv.org
          </a>
          <br />
          Phone:{' '}
          <a href='tel:+251930774196' className='text-blue-600'>
            +251-936-266-674
          </a>
        </Content>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
