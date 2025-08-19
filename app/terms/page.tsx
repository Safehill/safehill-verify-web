'use client';

import type React from 'react';
import MessageView from '@/components/shared/MessageView';
import Section from '@/components/shared/Section';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Section
        item={{
          icon: null,
          title: '',
          mainContent: (
            <>
              <p className="my-5">
                You must be at least Seventeen (17) years old to use the App. If
                you are not yet 17 years old, please do not use the App.
              </p>
              <p className="my-5">
                We believe strongly that your content should remain your
                property and, as described below, Safehill requires a license
                only to legally display them through the App. We will not use
                content without your permission and you may revoke your
                permission for display on the App at any time. Safehill will not
                sell or share your content to anyone.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: 'Definition of Terms',
          mainContent: (
            <>
              <p className="my-5">
                Definition of Terms “App” means this site and associated sites
                or applications including any and all audio and/or visual
                elements thereof, created, licensed or owned by Safehill or by
                Safehill’s approved third party providers (“Third Party
                Provider”), including, without limitation, any text, graphics,
                images, illustrations, photographs, animations, applications,
                video, audio or audiovisual works, designs, logos, and other
                information and content made available through the App, as well
                as all underlying technical elements of all of the foregoing,
                including without limitation, source code, script, object code,
                software, computer programs, and other sets of statements and
                instructions. “User Content” means any images, pictures, or
                other media uploaded by you or other users of the App.
              </p>
              <p className="my-5">
                “IPR” means any rights in or to, but not limited to, copyrights,
                patents, trademarks, brand names, trade names, business names,
                know-how or confidential information and any other rights in
                respect of any other industrial or intellectual property,
                whether registrable or not and wherever existing in the world
                and including without limitation all rights to apply for
                registrations of any of the foregoing rights;
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '1. User Conduct',
          mainContent: (
            <>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                1.1. Compliance with Laws and Regulations:
              </div>
              <p className="my-5">
                You agree to comply with all applicable laws, rules, and
                regulations in your use of our platform. You are solely
                responsible for ensuring that your use of our platform is
                lawful.
              </p>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                1.2 Prohibited Activities:
              </div>
              <p className="my-5">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="list-disc ml-5">
                <li>Violating any applicable laws, rules, or regulations;</li>
                <li>
                  Impersonating any person or entity or falsely representing
                  your affiliation with any person or entity;
                </li>
                <li>
                  Posting, transmitting, or disseminating any unlawful, harmful,
                  obscene, offensive, or otherwise objectionable content;
                </li>
                <li>
                  Interfering with or disrupting the integrity or performance of
                  our platform or any related servers or networks;
                </li>
                <li>
                  Accessing or attempting to access data or information that you
                  are not authorized to access;
                </li>
                <li>
                  Engaging in any activities that could harm, disable,
                  overburden, or impair our platform or interfere with other
                  users’ enjoyment or use of our platform.
                </li>
              </ul>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                1.3 User Submissions:
              </div>
              <p className="my-5">
                During your use of the app, you will be able to upload User
                Content, comments, messages or other materials or files,
                including, without limitation, names or likenesses (all whether
                concerning you or a third party) (collectively, the
                “Submissions”) to the App, whether or not requested to do so by
                Safehill. You shall be deemed to have granted Safehill a
                worldwide, royalty-free, non-exclusive, transferable (as
                described herein), licensable, license to cache, copy,
                distribute, transmit, publicly display, the Submissions on the
                App. You will own all IPR in and to your user submissions, you
                are just licensing the Submissions to Safehill for display
                purposes on the app.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '2. Intellectual Property',
          mainContent: (
            <>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                2.1. Ownership of Content
              </div>
              <p className="my-5">
                Safehill does not own user content and will not display, sell or
                share user content in any place other than the app. User content
                can be removed by the users that own the content at any time.
                All non user content on our platform, including but not limited
                to text, graphics, logos, images, and software, is the property
                of Safehill or its licensors and is protected by copyright,
                trademark, and other intellectual property laws.
              </p>
              <p className="my-5">
                The App and all IPR therein is owned by Safehill and/or its
                content providers (including its users who retain ownership of
                their content) and other licensors, and are subject to
                protection under the relevant intellectual property laws
                throughout the world. Except as expressly set forth in these
                Terms or as otherwise permitted in writing by Safehill, you
                agree not to: (1) commercialize, capture, transfer, upload,
                distribute, sell, license, modify, manipulate, reproduce,
                perform, publicly display, create derivative works from or based
                upon, or otherwise exploit the App and the IPR, in whole or in
                part, on any other website or in any medium now known or
                hereafter developed; and (2) remove or modify any trade names,
                product names, logos, trademarks, copyrights or other
                proprietary notices, legends, symbols or labels on the App (each
                of the foregoing, “Unauthorized Conduct”).
              </p>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                2.2 Limited License:
              </div>
              <p className="my-5">
                We grant you a limited, non-exclusive, non-transferable, and
                revocable license to access and use our platform for personal,
                non-commercial purposes. You may not modify, reproduce,
                distribute, transmit, display, perform, or create derivative
                works from any content on our platform without our prior written
                consent.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '3. Privacy',
          mainContent: (
            <>
              <p className="my-5">
                Your privacy is important to us. Please refer to our{' '}
                <a href="/privacy">Privacy Policy</a> for information on how we
                collect, use, store, and disclose your personal information.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '4. Third-Party Links and Content',
          mainContent: (
            <>
              <p className="my-5">
                Our platform may contain links to third-party websites or
                services that are not owned or controlled by Safehill. We do not
                endorse or assume any responsibility for the content, privacy
                policies, or practices of any third-party website or service.
                You access and use such third-party websites or services at your
                own risk.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '5. Disclaimer of Warranties and Limitation of Liability',
          mainContent: (
            <>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                5.1 No Warranty:
              </div>
              <p className="my-5">
                Our platform is provided on an &quot;as is&quot; and &quot;as
                available&quot; basis. We do not warrant that our platform will
                be uninterrupted, error-free, or free from viruses or other
                harmful components. We make no representations or warranties of
                any kind, whether express or implied, regarding the accuracy,
                reliability, or completeness of any content on our platform.
              </p>
              <div className="font-display text-lg md:text-xl tracking-[-0.02em] my-5">
                5.2 Limitation of Liability:
              </div>
              <p className="my-5">
                To the fullest extent permitted by applicable law, Safehill and
                its officers, directors, employees, agents, and affiliates shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or in
                connection with your use of our platform, including but not
                limited to loss of profits, data, or reputation, even if we have
                been advised of the possibility of such damages.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '6. Indemnification',
          mainContent: (
            <>
              <p className="my-5">
                You agree to indemnify and hold harmless Safehill and its
                officers, directors, employees, agents, and affiliates from and
                against any claims, liabilities, damages, losses, and expenses,
                including without limitation reasonable attorney’s fees and
                costs, arising out of or in connection with your use of our
                platform or any violation of this Agreement.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '7. Amendments',
          mainContent: (
            <>
              <p className="my-5">
                We reserve the right to amend or modify this Agreement at any
                time. Any changes will be effective immediately upon posting on
                our platform. Your continued use of our platform after any such
                modifications shall constitute your acceptance of the modified
                Agreement.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '8. Termination',
          mainContent: (
            <>
              <p className="my-5">
                We may terminate or suspend your access to our platform, with or
                without cause, at any time and without prior notice. Upon
                termination, your right to access and use our platform will
                cease immediately.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '9. Governing Law and Dispute Resolution',
          mainContent: (
            <>
              <p className="my-5">
                This Agreement shall be governed by and construed in accordance
                with the laws of United States and your submission to the
                exclusive jurisdiction and venue of the state and federal courts
                located in the State of California in San Francisco county . Any
                dispute, controversy, or claim arising out of or relating to
                this Agreement shall be resolved through arbitration in
                accordance with the rules of San Francisco, California.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '10. Severability',
          mainContent: (
            <>
              <p className="my-5">
                If any provision of this Agreement is found to be invalid,
                illegal, or unenforceable, the remaining provisions shall not be
                affected and shall continue in full force and effect.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '11. Entire Agreement',
          mainContent: (
            <>
              <p className="my-5">
                This Agreement constitutes the entire agreement between you and
                Safehill and supersedes any prior agreements, understandings, or
                representations, whether oral or written.
              </p>
            </>
          ),
        }}
      />
      <Section
        item={{
          icon: null,
          title: '12. Contact Us',
          mainContent: (
            <>
              <p className="my-5">
                If you have any questions or concerns regarding this Agreement,
                please contact us at{' '}
                <a href="mailto:support@safehill.io">support@safehill.io</a>
              </p>
            </>
          ),
        }}
      />
    </>
  );
};

export default function TermsPage() {
  return (
    <div
      className="animate-fade-up text-4xl tracking-[-0.02em] md:text-2xl md:leading-[5rem] px-4 sm:px-8 md:px-20 lg:px-60"
      style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
    >
      <MessageView message="Terms of Use Agreement" sizeClass={6} />
      <div>
        <div className="text-center text-lg md:text-xl font-light my-20 px-5">
          This Terms of Use Agreement (&quot;Agreement&quot;) governs your
          access to and use of our platform and services. By using our platform,
          you agree to be bound by the terms and conditions set forth in this
          Agreement.
        </div>
        <PrivacyPolicy />
      </div>
    </div>
  );
}
