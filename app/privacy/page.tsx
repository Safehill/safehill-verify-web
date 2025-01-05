'use client';

import React from 'react';
import MessageView from '@/components/shared/MessageView';
import { Item } from '@/components/home/ItemizedListProps';

const Section = ({ item }: { item: Item }) => {
  return (
    <div className="w-full my-10">
      <div className="font-display text-xl md:text-3xl tracking-[-0.02em]">
        {item.title}
      </div>

      <div className="mt-4 text-sm md:text-base font-light">{item.content}</div>
    </div>
  );
};

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Section
        item={{
          icon: null,
          title: '1. Information Collection',
          content: (
            <>
              <p className="my-5">
                Safehill collects information about you only if we have a reason
                for such collection, such as to provide you with a user account,
                to communicate with you, or to improve our App. Information is
                collected in the following ways:
              </p>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                1.1. User-provided Information:
              </div>
              <p className="my-5">
                When creating a user account (“User Account”), we collect Name
                and Phone number which can be categorized as Personally
                Identifiable Information (&quot;PII&quot;). Safehill uses the
                phone numbers for verification and only stores a
                cryptographically secure hashed representation of the phone
                number from that point forward.
              </p>
              <p className="my-5">
                You have the option to grant Safehill access to your contacts on
                your device. By doing so, Safehill will generate
                cryptographically secure identifiers using the phone numbers in
                your address book to assist you in locating your contacts within
                the app. These cryptographically secure identifiers are not
                saved anywhere. However, when you invite individuals using their
                phone numbers, we securely store the numbers as hashed
                representations on our servers to link them to you when they
                join Safehill.
              </p>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                1.2. Automatically Collected Information
              </div>
              <p className="my-5">
                We will also collect unidentified and non-identifiable
                information (“Anonymous Information”) does not enable Safehill
                to identify the visitor or user from whom it was collected. The
                Anonymous Information collected by Safehill may consist of the
                date, time, length and non-precise location of your visit.
                Safehill will not aggregate, use or share Anonymous Information
                with third parties for marketing or advertising purposes.
              </p>
              <p className="my-5">
                You may review, amend or delete any and all information
                associated with your User Account by signing into your account
                on the App and clicking on &quot;Destroy my account&quot;. You
                may also request the deactivation of your User Account and any
                uploaded content by sending an e-mail to support@safehill.io.
                Please note that permanently deleting your Safehill User Account
                erases all of your information from our system. After completing
                this process your User Account and all its data will be removed
                permanently, and Safehill will not be able to restore your User
                Account or retrieve your data in the future.
              </p>
              <p className="my-5">
                We use the information we collect (both Anonymous Information
                and PII) to operate and improve the App. We do not share your
                PII with outside parties except to the extent necessary to
                operate our App, such as to process credit card information. We
                use Twilio and Apple to authenticate who you are and your
                payment information. Please click through for their privacy
                policies. In the future, we may sell to, buy, merge with, or
                partner with other businesses. In such transactions, Anonymous
                Information and PII may be among the transferred assets.
              </p>
              <p className="my-5">
                Safehill will not sell, license, rent, or otherwise disclose
                your PII except as stated herein, unless under the following
                circumstances: (1) you have affirmatively given your consent;
                (2) we previously notified you of the disclosure in this Privacy
                Policy or when you provided your information on the App; (3) we
                are compelled by law, legal process, or court order to disclose;
                (4) disclosure is required to identify, contact, or bring legal
                action against someone who may cause harm to, or interference
                with, Safehill’s rights or property, our users, or anyone else;
                or (5) to respond to an inquiry, request or complaint that you
                have made. Safehill may cooperate with Internet service
                providers to identify users whenever required to comply with
                law, to enforce compliance with this Privacy Policy or our
                Terms, or to protect the App, our customers and others.
              </p>
              <p className="my-5">
                A third-party payment processor collects and processes financial
                information on our behalf; we do not collect or retain your
                payment information. If any Anonymous Information is linked to
                PII, it will be treated as PII as long as the connection exists.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '2. Information Use',
          content: (
            <>
              <p className="my-5">
                Safehill is an industry leader in protecting and safeguarding
                your data from unauthorized use, disclosure and to prohibit
                possible security breaches of the App. Even though no website,
                application, computer system or online communication is
                completely secure, any unauthorized access to our systems will
                not disclose any unencrypted user information other than Name.
                In addition to standard encryption offered by protocols such as
                SSL and the operating system, we use and combine state of the
                art encryption techniques to protect any data that is stored or
                transferred over the network. Safehill will NOT have access to
                the keys.
              </p>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                2.1. Encryption:
              </div>
              <p className="my-5">
                All data collected by Safehill is encrypted end to end. This
                encryption ensures that your information is protected and only
                accessible by you and authorized personnel.
              </p>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                2.2. Service Improvement:
              </div>
              <p className="my-5">
                We may use the information we collect to enhance and improve our
                services, develop new features, and conduct research and
                analysis.
              </p>
              <p className="my-5">
                Safehill will take commercially reasonable steps to use
                heightened security technologies to protect the transmission and
                storage of transactional information to the App. Such heightened
                security measures may include the secure transmission and
                encryption of all supplied sensitive financial or other
                transaction-related information. Safehill does not handle any
                such information directly but uses Apple’s secure system. Check
                out Apple’s privacy policy{' '}
                <a href="https://www.apple.com/legal/privacy/">here</a>.
              </p>
              <p className="my-5">
                Unless otherwise specified, whenever you make a payment, your
                financial and other transaction-related information will only be
                used to process your transaction and will not be stored on our
                servers or used for marketing purposes.
              </p>
              <p className="my-5">
                Data will be maintained, processed and stored by Safehill in the
                United States of America or other jurisdictions, as necessary,
                for proper delivery of the services or as required by law. PII
                is kept only as long as necessary to provide you with access to
                the App and for legitimate and essential business purposes, such
                as maintaining your account, and making data-driven business
                decisions about new features and offerings.
              </p>
              <p className="my-5">
                If you are located in countries that fall under the scope of the
                European General Data Protection Regulation (“GDPR”), data
                protection laws give you rights with respect to your personal
                data, subject to exemptions provided by law. These rights
                include:
              </p>
              <ul className="list-disc ml-5">
                <li>The right to request access to your personal data;</li>
                <li>
                  The right to request correction or deletion of your personal
                  data;
                </li>
                <li>
                  The right to object to the use and processing of your personal
                  data;
                </li>
                <li>
                  The right to request that Safehill limit its use and
                  processing of your personal data;
                </li>
                <li>The right to request portability of your personal data;</li>
                <li>
                  The right to make a complaint to a governmental supervisory
                  authority;
                </li>
              </ul>
              <p className="my-5">
                Safehill strives to provide these rights to all visitors and
                users. Please email us at support@safehill.io with any requests,
                questions, or concerns.
              </p>
              <p className="my-5">
                In accordance with Article 77 of the General Data Protection
                Regulation, you have the right to lodge complaints about the
                data processing activities carried out to the UK Information
                Commissioner’s Office, or the data protection regulator in the
                country where you actually live and work, or where an alleged
                infringement of the GDPR has taken place. Alternatively, you may
                seek a remedy through the courts if you believe your rights have
                been breached.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title:
            '3. Legal Basis Under EU General Data Protection Regulation for Processing Information of EU Residents.',
          content: (
            <>
              <p className="my-5">
                Where you have consented to data processing, by using this App,
                your consent provides the legal basis to process your PII. You
                may withdraw your consent at any time by emailing
                <a href="mailto:support@safehill.io">support@safehill.io</a>.
              </p>
              <p className="my-5">
                We may process your PII where it is necessary to use such PII in
                order to perform our obligations under any contract with you
                (for example, to comply with the Terms and Conditions, which you
                accept by browsing our website and/or in order to provide the
                App to you).
              </p>
              <p className="my-5">
                We may process your PII on the basis of our legitimate
                interests, such as providing and developing interesting features
                for our Users, operating and improving the App, developing new
                services, providing customer service, and market research. We
                also use your PII to keep our App safe and secure, to protect
                against fraud, spam and abuse. Where we rely on legitimate
                interests to process your PII, you have the right to object to
                such processing (you can ask us to stop). You can contact us at
                <a href="mailto:support@safehill.io">support@safehill.io</a> to
                object to such processing. We may also process your PII on the
                basis of our legal obligations.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '4. Cookies and Third-Party Providers',
          content: (
            <>
              <p className="my-5">Safehill does not use cookies.</p>
              <p className="my-5">
                This Privacy Policy does not govern the privacy practices of
                third parties who gather information directly from you when you
                visit their site or app. The App may embed or contain links for
                third party websites. Similarly, third-party websites may embed
                or contain links and advertisements for the App. Safehill cannot
                control and is not responsible for the privacy practices or
                content on any non- Safehill websites. Safehill is therefore not
                liable for your use of and exposure to such third-party websites
                and any content or advertisements they contain. You should
                familiarize yourself with the privacy policies and terms of use
                of these third parties to better understand their information
                management policies.
              </p>

              <p className="my-5">
                If you choose to opt in to receive communications from a third
                party, any information you provide to said third party, will be
                subject to the privacy policy of the third party. If you later
                decide to opt out, you should contact the third party directly.
              </p>
              <p className="my-5">
                Where permitted by local data laws, Safehill may disclose or
                otherwise allow others to access your PII pursuant to a legal
                request, such as a subpoena, legal proceedings, search warrant
                or court order, or in compliance with applicable law. If we have
                a good faith belief that the law requires disclosure, we may
                disclose your PII, with or without notice to you.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '5. Children and Privacy',
          content: (
            <>
              <p className="my-5">
                This App is NOT intended to be used by children under the age of
                17 in the United States and under the age of 17 in the European
                Union. Safehill recognizes the importance of maintaining the
                privacy of children, especially those under the age of 16.
                Safehill is committed to complying with all applicable laws and
                regulations regarding children, including the Children’s Online
                Privacy Protection Act (“COPPA”), 15 U.S.C. § 6501, et seq.
              </p>
              <p className="my-5">
                Except in limited circumstances allowed by COPPA, Safehill does
                not and will not knowingly request, collect, store, maintain, or
                share any personally identifiable information of children under
                the age of 16, without first obtaining the consent of a legal
                guardian. In those limited instances, Safehill will only collect
                reasonably necessary information, and Safehill will not share
                with third parties any personally identifiable information of a
                child under the age of 16 without the explicit consent of a
                legal guardian, or as permitted by COPPA or other applicable
                law.
              </p>
              <p className="my-5">
                You may revoke your consent and request the removal of your
                child’s information at any time. If you are the legal guardian
                of a child under the age of 16 and discover that your child has
                submitted their personally identifiable information without
                securing your consent, Safehill will use commercially reasonable
                efforts to remove this information. If at any point you wish to
                review, amend, or request the removal of your child’s
                information, please send an e-mail to{' '}
                <a href="mailto:support@safehill.io">support@safehill.io</a> and
                provide the name and account information for your child’s user
                account.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '6. Notification of Changes',
          content: (
            <>
              <p className="my-5">
                Safehill may at any time and in its sole discretion, add,
                modify, or remove any feature, function or portion of the App,
                the Terms, and/or the Privacy Policy, in whole or in part, with
                or without notice to you, prior or otherwise. Any changes to the
                Privacy Policy will be effective as of the posting date.
                Safehill will provide prominent notice on the App of any major
                changes to the Privacy Policy. Your continued use of the App
                after Safehill posts any modifications to the Privacy Policy
                shall be deemed your explicit acceptance of those modifications
                and shall constitute your agreement to comply with the Privacy
                Policy, as modified.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '7. Notice to California Users',
          content: (
            <>
              <p className="my-5">
                California Civil Code Section 1798.83 permits users who are
                California residents and who have provided with "personal
                information&quot; (as that term is defined in Section 1798.83)
                to request certain information about the disclosure of that
                information to third parties for their direct marketing
                purposes. If you are a California resident with questions
                regarding this, or how the Safehill reviews and processes any
                request from you to amend your personal information, please
                contact us as{' '}
                <a href="mailto:support@safehill.io">support@safehill.io</a>.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '8. Contacting us',
          content: (
            <>
              <p className="my-5">
                If there are any questions regarding this Privacy Policy you may
                contact us using the information below.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '9. Notice to EU users',
          content: (
            <>
              <p className="my-5">
                The GDPR of the European Union permits users who are residents
                and who have provided with personal information to request
                certain information about the disclosure of that information to
                third parties for their direct marketing purposes. If you are a
                EU resident you have the right to complain to national or local
                data protection offices (you can find a list here
                https://edpb.europa.eu/about-edpb/about-edpb/members_en) and
                with any questions regarding this, or how the Safehill reviews
                and processes any request from you to amend your personal
                information, please contact us as support@safehill.io.
              </p>
              <p className="my-5">
                Safehill Inc., Attn: Legal Department‍{' '}
                <a href="mailto:support@safehill.io">support@safehill.io</a>
              </p>
            </>
          ),
        }}
      />
    </>
  );
};

export default function PrivacyPage() {
  return (
    <div
      className="animate-fade-up text-4xl tracking-[-0.02em] md:text-2xl md:leading-[5rem] px-4 sm:px-8 md:px-20 lg:px-60"
      style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
    >
      <MessageView message="Privacy Policy" sizeClass={6} />
      <div>
        <div className="text-center text-sm md:text-sm font-light my-5">
          <b>Effective Date:</b> Feb 1, 2024
        </div>
        <div className="text-center text-lg md:text-xl font-light my-20 px-5">
          At Safehill, the privacy and security of your data is paramount.
          <br />
          <br />
          This Privacy Policy outlines how we collect, use, store, and disclose
          the information we receive from our users.
          <br />
          <br />
          By using our platform, you agree to the practices described in this
          policy.
        </div>
        <PrivacyPolicy />
      </div>
    </div>
  );
}
