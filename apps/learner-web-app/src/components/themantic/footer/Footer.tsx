'use client';

import React, { useState } from 'react';
import { Box, Typography, Link, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const Footer = () => {
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);

  const handleOpenPrivacyModal = () => {
    setOpenPrivacyModal(true);
  };

  const handleClosePrivacyModal = () => {
    setOpenPrivacyModal(false);
  };

  return (
    <Box
      component="footer"
      className='bs-px-5 bs-pt-3 bs-pb-3'
      sx={{
        backgroundColor: '#fff',
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Box>
        <Box>
          <Box
            mb={1}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <img
              height={'34px'}
              width={'104px'}
              src="/images/pradigi1.png"
              alt="PraDigi"
            // height={40}
            />
            <Box
              sx={{
                mt: { xs: 2, md: 0 },
                textAlign: { xs: 'center', md: 'right' },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    fontWeight: 400,
                    color: '#000000',
                    lineHeight: 1.3,
                  }}
                >
                  Experimento India is a part of Project Jigyaasa.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '13px', sm: '14px' },
                fontWeight: 400,
                color: '#000000',
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Useful links:
            </Typography>
            <Box
              sx={{
                display: 'flex',

                flexWrap: 'wrap',
                gap: { xs: 0.5, sm: 1 },
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              {[
                { text: 'Pratham', href: 'https://www.pratham.org/' },
                {
                  text: 'Pratham Open School',
                  // href: 'https://www.prathamopenschool.org/catalog/contents/1000001',
                  href: 'https://www.prathamopenschool.org/',
                },
                {
                  text: 'Experimento India',
                  href: 'https://www.siemens-stiftung.org/en/projects/experimento/stem-education-for-innovation-experimento-india/',
                },
                {
                  text: 'Siemens Stiftung Media Portal',
                  href: 'https://medienportal.siemens-stiftung.org/en/experimento-matrix',
                },
                {
                  text: 'CREA',
                  href: 'https://crea-portaldemedios.siemens-stiftung.org/experimento',
                },
                {
                  text: 'Hour of Engineering',
                  href: 'https://hourofengineering.com/',
                },
              ].map((link, index, arr) => (
                <React.Fragment key={link.text}>
                  <Link
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: { xs: '11px', sm: '12px' },
                      fontWeight: 400,
                      color: '#000000',
                      lineHeight: { xs: 1.4, sm: 1.2 },
                    }}
                  >
                    {link.text}
                  </Link>
                  {index < arr.length - 1 && (
                    <Typography color="text.secondary">|</Typography>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                fontWeight: 400,
                color: '#000000',
                marginTop: '10px !important',
              }}
            >
              All resources on the website are licensed under a CC-BY-NC-SA 4.0
              or CC-BY-SA 4.0 International License. Please refer to individual
              content to find more.
            </Box>
            <Box>
              <Box
                sx={{
                  mt: { xs: 2, sm: 0, md: 0 },
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'end' },
                }}
              >
                <img
                  src="/images/footer-icons.png"
                  alt="footer-icons"
                  width={104}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
              <Box
                onClick={handleOpenPrivacyModal}
                sx={{
                  fontSize: { xs: '10px', sm: '10px', md: '10px' },
                  fontWeight: 400,
                  marginTop: '5px',
                  color: '#000000',
                  textAlign: { xs: 'center', md: 'right' },
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Privacy Guidelines
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: { xs: 1, md: 1 },
        }}
      >
        <Box width="100%">
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '12px', md: '12px' },
              fontWeight: 400,
              color: '#000000',
              textAlign: 'center',
            }}
          >
            © 2025 Pratham
          </Typography>
        </Box>
      </Box>

      {/* Privacy Guidelines Modal */}
      <Dialog
        open={openPrivacyModal}
        onClose={handleClosePrivacyModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            pb: 2,
          }}
        >
          PRIVACY GUIDELINES
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            component="div"
            sx={{
              fontSize: '14px',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              '& p': {
                mb: 2,
              },
            }}
          >
            <Typography component="p" sx={{ mb: 2 }}>
              Pratham Education Foundation (&quot;Pratham&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is one of the largest non-
              governmental organisations (NGOs) working to improve the quality of education in India.
              Started with the objective of providing pre-school education to children in the slums of Mumbai,
              over the years, we have grown in  both scope and size while working towards  the mission of
              &quot;Every Child in School &amp; Learning Well&quot;.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              These Privacy Guidelines (&quot;guidelines&quot;) set out to explain how we collect, use and store any data
              including personally identifiable data that you give us when you use our websites or any other
              digital medium and other offline sources of our organization.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              We encourage you to read and understand these guidelines in connection with the use of our
              websites, social media platforms and digital applications (&quot;digital platforms&quot;).
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              1. Applicability
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              These Privacy guidelines applies to visitors (&quot;you&quot;, &quot;yours&quot;) to our digital platforms.
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              2. Your Consent
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              By visiting and/or using our digital platforms you agree and give consent to collect, use, 
              store, disclose and share your data in accordance with these guidelines.
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              3. Data We Collect
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              i. Contact Data (personal and non-personal) such as:
            </Typography>
            <Typography component="ul" sx={{ pl: 3, mb: 2 }}>
              <li>contact and profile information,</li>
              <li>account and authentication information from third-party integrated services</li>
              <li>location information</li>
              <li>information about your browser or device</li>
              <li>donation and applicant data</li>
              <li>non-personal information which may be linked to your Personal Information</li>
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              ii. Information you post on our digital platforms or on social media sites owned by a third
              party.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              iii. Information from Integrated Sign-On Services: Integrated Sign-on Services mean
              when   you   register   through   or   otherwise   grant   access   to   a   third-party   social
              networking or integrated service such as Facebook, LinkedIn, Instagram Google or
              similar single sign-on services. If you have claimed your data as personal data at the
              time of registration, we shall treat it as personal data.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              iv. Usage and Preference Information: We collect information as to how you interact with
              our digital  platforms, preferences  expressed and settings chosen, your user activity
              and browsing history within our digital platforms and across third-party sites and
              online services, including those sites that include our pixels (&quot;Pixels&quot;), widgets, plug-
              ins, buttons, or related services or through the use of cookies for enhancement of our
              services.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              v. Stored information and files: Our digital platforms may with your consent also access
              metadata   and   other   information   associated   with   other   files   stored   on   your
              mobile/computer device. This may include, for example, photographs, audio and video
              clips, personal contacts and address book information.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              vi. Other information: If you use our digital platforms, we may collect information about
              your IP address and the browser you&apos;re using. We might look at what site you came
              from, duration of time spent on our platform, pages accessed or what site you visit
              when you leave us. We might  also collect  the type of mobile device you are using,  or
              the version of the operating system your computer or device is running.
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              4. How We Use Collected Data
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              We use the information we collect to improve the teaching learning methods, 
              curriculums and enhance user experience.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              For this purpose, we use tools such as Google Analytics, which help us gather 
              insights about:
            </Typography>
            <Typography component="ul" sx={{ pl: 3, mb: 1 }}>
              <li>Pages visited</li>
              <li>Time spent on the site</li>
              <li>Traffic sources</li>
              <li>Device and browser details</li>
              <li>Geographic location (non-identifiable)</li>
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Google Analytics collects this information through cookies, but it does not 
              personally identify users. The insights gained are used strictly to improve our 
              website.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              i. We may use your contact data for purposes which may include but shall be limited
              to maintaining our database, record keeping, reporting, or to communicate with you
              when necessary.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              ii. to contact you for any engagement and for feedback purposes, to communicate with
              you about your account and respond to inquiries.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              iii. to confirm your registration on our digital platforms and their usage.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              iv. to operate, maintain, enhance, and provide all of the features of our digital platforms.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              v. for security and safeguarding purposes.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              vi. to understand the usage trends and preferences, to improve the functioning of our 
              digital platforms.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              vii. to improve our content enabling your participation in our programs.
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              5. Sharing Data with Third Parties
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              We may share non-personally identifiable data, such as aggregated traffic statistics,
              with third-party services like Google Analytics. Google may process this data on 
              our behalf to help us analyze website traffic and usage patterns.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Additionally, Google may use the data collected via Analytics to personalize ads 
              within its ad network. However, you can manage how your data is used or opt out of
              tracking by visiting Google&apos;s Ads Settings or installing the Google Analytics Opt-Out
              Browser Add-on.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Please refer to Google&apos;s Privacy Policy for more details about how they handle 
              collected data.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              We may disclose collected data as follows:
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              i. with the third party when it is visible to others on our digital platforms by default.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              ii. with social networks like Facebook, Instagram, Linkedin and Google, where you 
              explicitly agree to disclose information.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              iii. to comply with the applicable laws to protect your and our privacy.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Please note that the above-mentioned third parties are not governed by us or the terms of
              these guidelines. We recommend you review the guidelines of any third party application or
              service before authorizing access to your account information on our digital platforms.
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              6. Cookies
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Our website uses cookies to enhance user experience and enable certain 
              functionalities. Among these cookies, we use Google Analytics cookies to collect 
              information about how visitors use our website. These cookies track:
            </Typography>
            <Typography component="ul" sx={{ pl: 3, mb: 1 }}>
              <li>Session duration</li>
              <li>Pages viewed</li>
              <li>Clicks and navigation</li>
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              The data collected by Google Analytics cookies is anonymous and used only for 
              statistical analysis to improve our website&apos;s performance and functionality.
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              If you wish to manage or disable cookies, you can do so through your browser 
              settings. Additionally, you can opt out of Google Analytics tracking by installing the 
              Google Analytics Opt-Out Browser Add-on.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              Cookie refers to a small text file that is stored on a user&apos;s computer for record-keeping
              purposes. The primary purpose of  cookies  is to analyse how users move within the
              website. The web browser retains the cookie for a specific amount of time while a user
              visits the website. Your data will be collected automatically when you visit our digital
              platforms, register on any of our online portal/s, data collected via Cookies, aligned with
              the cookie settings on your browser. To understand further about our Cookie guidelines,
              please refer to our Cookie    Guidelines  
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              7. Security and Safeguarding of Data
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              i. We aim to secure the collected data against loss, alteration, and unauthorised or illegal
              sharing or access by any party (apart from the ones stated in this guidelines) through the
              entire process of collection, use, retention, storage, sharing, updation and deletion of
              collected data.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              ii. We will never share your personal data with or to any individual or organization without
              your advance permission or unless ordered by a court of law.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              In the event that any information under our control is compromised as a result of a breach
              of security, we will take reasonable steps to investigate the situation and will notify you of
              the security incident in accordance with applicable laws and regulations via a Data
              Breach Notification.
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              8. Links to other websites
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              Our digital platforms may link to and may be linked by websites/platforms operated by
              other entities or individuals. Some of these websites/platforms, such  as Pratham&apos;s
              Facebook, Instagram, Twitter, Linkedin Page may be co-branded with our name or logo.
              These Privacy guidelines do not apply to, and we cannot always control the activities of,
              such other third-party websites/platforms. You should consult the respective privacy
              policies of those third-party websites/platforms.
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              9. Updation/Deletion of Data
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
              In case you wish to delete/update your personal data, please contact   Pratham&apos;s
              authorized person i.e. the DPO (
              <Link href="mailto:dataprotectionofficer@pratham.org" target="_blank" sx={{ color: '#1976d2', textDecorationColor: '#1976d2' }}>
                dataprotectionofficer@pratham.org
              </Link>
              ). After the receipt of
              your updation/deletion request, your personal data shall be deleted/updated from its
              storage platform within 15 (fifteen) working days subject to retention of your data for any
              legal requirements, and or updated as the case may be. 
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              10. Dispute, Reporting and Redressal Mechanism
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              In the event you come across any breach of data and non-compliance of this guidelines, 
              please report to our Data Protection Officer with the following contact details:
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Data Protection Officer (DPO) 
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Pratham Education Foundation
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Delhi Office: B4/59, 1st Floor, Safdarjung Enclave,
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              New Delhi-110029
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
              Email:{' '}
              <Link href="mailto:dataprotectionofficer@pratham.org" target="_blank" sx={{ color: '#1976d2', textDecorationColor: '#1976d2' }}>
                dataprotectionofficer@pratham.org
              </Link>
            </Typography>
            
            <Typography component="p" sx={{ mb: 2 }}>
              Phone no: 011-26177200
            </Typography>
            <Typography component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
              11. Change/Update of guidelines
            </Typography>
            <Typography component="p" sx={{ mb: 0 }}>
              We may change these guidelines from time to time. The updated version of this 
              guidelines shall be uploaded on this page regularly.
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrivacyModal} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Footer;
