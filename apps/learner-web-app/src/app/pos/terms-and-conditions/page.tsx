'use client';

import React from 'react';
import Layout from '@learner/components/pos/Layout';
import { Box, Typography, useMediaQuery } from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';

const TermsAndConditions = () => {
  const mediaMD = useMediaQuery('(max-width: 900px)');

  return (
    <Layout>
      <Box sx={{ background: '#F3F3F3' }}>
        <Box
          data-no-invert={true}
          sx={{
            width: '100%',
            height: '400px',
            backgroundImage: 'url(/images/about-banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              variant={mediaMD ? 'h1' : 'body7'}
              component="h1"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                textAlign: 'center',
                color: '#fff',
                mb: 1,
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                lineHeight: 1.4,
                px: { xs: 2, md: 4 },
              }}
            >
              <SpeakableText>
                Terms And Conditions For Content On Pratham Open School
              </SpeakableText>
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            background: '#fff',
            padding: { xs: '30px 16px', md: '60px 40px' },
            mx: { xs: '16px', md: 7 },
            mt: 8,
            mb: 8,
          }}
        >
          {/* Section 1: Introduction */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              1. Introduction
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
              }}
            >
              Pratham Education Foundation ("Pratham", "we", "our", "us") is one
              of the largest non-governmental organisations (NGOs) working to
              improve the quality of education in India. Started with the
              objective of providing pre-school education to children in the
              slums of Mumbai, over the years, we have grown in both scope and
              size while working towards the mission of "Every Child in School &
              Learning Well". These terms and conditions sets out to explain and
              govern the terms for usage of our website w.r.t content that is
              provided to you by us through this website. Please read these
              terms and conditions carefully before using this website. These
              terms and conditions apply to all visitors, users and others who
              wish to access our website ("you", "yours", "user"). By accessing
              or using or browsing our website through any means shall signify
              your acceptance of the terms and conditions and you agree to be
              bound by the terms and conditions set forth below.
            </Typography>
          </Box>

          {/* Section 2: Intellectual Property */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              2. Intellectual Property
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
                mb: 2,
              }}
            >
              All the content of our website is owned, updated, controlled and
              maintained by us and is protected by copyright and other
              applicable intellectual property laws. Our website contains
              information, illustrations, artwork, text, video, audio,
              photographs, images or pictures ("Materials") used only for
              informational purposes. The material shall be used only for
              non-commercial purposes on a non-exclusive basis. Accessing the
              material does not result in any transfer of ownership of the
              content or related technology to you or any party. All
              intellectual property rights remain with us. You must not modify,
              tweak, edit or use the Materials for any other purpose without our
              written consent. By using and/or downloading any Materials from
              our website, you will be deemed to have agreed to the following
              terms:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                  }}
                >
                  Trademark Information
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                  }}
                >
                  Copyright- Ownership of Materials
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                  }}
                >
                  Enforcement of Intellectual Property Rights
                </Typography>
              </li>
            </Box>

            {/* 2.1 Trademark Information */}
            <Box sx={{ ml: { xs: 2, md: 3 }, mb: 2 }}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '18px', md: '20px' },
                  mb: 1.5,
                  color: '#1E1B16',
                }}
              >
                2.1 Trademark Information
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  lineHeight: 1.8,
                  color: '#4A4A4A',
                  textAlign: 'justify',
                }}
              >
                The word PRATHAM and all other related PRATHAM wordmarks and
                logos ("Pratham Marks") are registered trademarks of Pratham.
                All products' or service names or logos referenced in our
                website are either trademarks or registered trademarks of
                Pratham. The absence of a product or service name or logo from
                this list does not constitute a waiver of PRATHAM's trademark or
                other intellectual property rights concerning that name or logo
                or product. All other company names/logos/trademarks mentioned
                in our website may be trademarks of their respective owners. Use
                of Pratham Marks for commercial purposes is strictly prohibited.
              </Typography>
            </Box>

            {/* 2.2 Ownership of Materials- Copyright */}
            <Box sx={{ ml: { xs: 2, md: 3 }, mb: 2 }}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '18px', md: '20px' },
                  mb: 1.5,
                  color: '#1E1B16',
                }}
              >
                2.2 Ownership of Materials- Copyright
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  lineHeight: 1.8,
                  color: '#4A4A4A',
                  textAlign: 'justify',
                }}
              >
                The Material contained in our website is copyrighted and/or we
                have rights to such material. The material must not be
                distributed, modified, reproduced in whole or in part without
                our written consent prior to usage. The material can only be
                used for non-commercial purposes. Upon receiving consent from us
                for usage, you must give appropriate credit to Pratham and
                acknowledge the material's source when displaying it on your
                platforms, mobile applications, TV, webcasts, or any other
                channels of communication.
              </Typography>
            </Box>

            {/* 2.3 Enforcement of Intellectual Property Rights */}
            <Box sx={{ ml: { xs: 2, md: 3 }, mb: 2 }}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '18px', md: '20px' },
                  mb: 1.5,
                  color: '#1E1B16',
                }}
              >
                2.3 Enforcement of Intellectual Property Rights
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  lineHeight: 1.8,
                  color: '#4A4A4A',
                  textAlign: 'justify',
                }}
              >
                We actively enforce our intellectual property rights to the
                fullest extent of the law.
              </Typography>
            </Box>
          </Box>

          {/* Section 3: Warranties and Disclaimers */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              3. Warranties and Disclaimers
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
              }}
            >
              The information contained on our website is for general
              information, and are subject to change. The information and
              Materials contained herein, including text, graphics, links or
              other items are provided "as is," and "as available". You are
              therefore requested to verify this information before you act upon
              it. By accessing this website, you agree that we will not be
              liable for any mistake, omission, inaccuracy, typographical
              errors, direct or indirect loss arising from the use of
              information and material contained in the website. We make no
              warranty that the contents of the website are free from infection
              by virus or any malicious code which has contaminating and
              destructive properties.
            </Typography>
          </Box>

          {/* Section 4: Review and Updates */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              4. Review and Updates
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
              }}
            >
              The information contained in this website is subject to change
              without notice. We reserve the right to revise, change or modify
              these terms and conditions at any time by updating these terms and
              conditions on our website. Please remember to visit this page from
              time to time to review any amendments to the above terms and
              conditions.
            </Typography>
          </Box>

          {/* Section 5: Hyperlinking */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              5. Hyperlinking
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
                mb: 2,
              }}
            >
              <strong>Links to external Websites:</strong> Links to other
              Websites that have been included on our website are provided for
              public convenience only. We are not responsible for the contents
              or reliability of linked websites and does not necessarily endorse
              the view expressed within them. We cannot guarantee the
              availability of such linked pages. We cannot guarantee that these
              links will work all the time and we have no control over
              availability of linked pages. Also, we have no control over the
              availability/content of links to external Websites.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
              }}
            >
              <strong>Links to Our Website by other Websites:</strong> We do not
              object to you linking directly to the information that is hosted
              on our website and no prior permission is required for the same.
              Additionally, we do not allow your website to load our pages in
              frames. Our website's pages need to load in the window that just
              opened in your browser.
            </Typography>
          </Box>

          {/* Section 6: Privacy */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              6. Privacy
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
              }}
            >
              This website does not automatically capture any specific personal
              information from you, (like name, phone number or e-mail address),
              that allows us to identify you individually. Wherever the Website
              requests you to provide personal information, you will be informed
              for the particular purposes for which the information is gathered
              and adequate security measures will be taken to protect your
              personal information. For deletion of your information, you may
              raise a request to{' '}
              <a
                href="mailto:dataprotectionofficer@pratham.org"
                style={{ color: '#1976d2', textDecoration: 'none' }}
              >
                dataprotectionofficer@pratham.org
              </a>
              . We do not sell or share any personally identifiable information
              volunteered on the website site to any third party
              (public/private). Any information provided to this Website will be
              protected from loss, misuse, unauthorized access or disclosure,
              alteration, or destruction. We gather certain information about
              the User, such as Internet protocol (IP) addresses, domain name,
              browser type, operating system, the date and time of the visit and
              the pages visited. We make no attempt to link these addresses with
              the identity of individuals visiting our site unless an attempt to
              damage the site has been detected. If you come across any
              personally identifiable information while viewing the material
              available on our website, you shall comply with the Digital
              Personal Data Protection Act, 2023 and shall not use, download or
              share such information without our prior written consent.
            </Typography>
          </Box>

          {/* Section 7: Prohibited Uses */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              7. Prohibited Uses
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
                mb: 2,
              }}
            >
              You may use our website only for lawful purposes and in accordance
              with the terms and conditions and agree not to use our website for
              the following purposes:
            </Typography>
            <Box component="ol" sx={{ pl: 3, mb: 2 }}>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  In any way that violates any applicable national or
                  international law or regulation.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  For the purpose of exploiting, hurting, or attempting to abuse
                  any party (company, individual or minor) in any manner.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  To not modify, edit, tweak the material available on our
                  website and not use or share such material for any commercial
                  purposes.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  To send, or arrange for the sending of, any kind of
                  advertisement, whether it be through "junk mail," "chain
                  letters," "spam," or another similar practice.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  To impersonate or attempt to impersonate us, our employee,
                  another user, or any other person or entity.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  In any way that infringes upon the rights of others, or in any
                  way directly or in connection with is illegal, threatening,
                  fraudulent, or harmful.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  To engage in any other conduct that restricts or inhibits
                  anyone's use or enjoyment of the website or which may harm or
                  offend us or users of this website or expose them to
                  liability.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  You will not, without our prior written consent, "frame" or
                  "mirror" any portion of the website.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  Neither you nor anyone else may alter, adapt, sublicense,
                  translate, sell, reverse engineer, decode, decompile, or
                  otherwise disassemble any part of the website or any software
                  utilised on it;
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  Use any device, software, or routine that interferes with the
                  proper working of website.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  Introduce any viruses, trojan horses, worms, logic bombs, or
                  other material which is malicious or technologically harmful.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  Attempt to gain unauthorised access to, interfere with,
                  damage, or disrupt any parts of the website, the server on
                  which the website is stored, or any server, computer, or
                  database connected to website.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  Take any action that may damage or falsify our rating/reviews.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  Otherwise attempt to interfere with the proper working of
                  website.
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    lineHeight: 1.8,
                    color: '#4A4A4A',
                    mb: 1,
                  }}
                >
                  You will not, without our express prior written consent, imply
                  or state that any statements you make are supported by us.
                </Typography>
              </li>
            </Box>
          </Box>

          {/* Section 8: Dispute Resolution */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              8. Dispute Resolution
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
              }}
            >
              These terms and conditions shall be governed by and construed in
              accordance with Indian Laws. Any dispute arising under these terms
              and conditions shall be subject to exclusive jurisdiction of
              Courts of Mumbai, India.
            </Typography>
          </Box>

          {/* Section 9: Contact Us */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '20px', md: '24px' },
                mb: 2,
                color: '#1E1B16',
              }}
            >
              9. Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                lineHeight: 1.8,
                color: '#4A4A4A',
                textAlign: 'justify',
              }}
            >
              Please send your feedback, comments, requests for any support to
              the{' '}
              <a
                href="mailto:dataprotectionofficer@pratham.org"
                style={{ color: '#1976d2', textDecoration: 'none' }}
              >
                dataprotectionofficer@pratham.org
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default TermsAndConditions;
