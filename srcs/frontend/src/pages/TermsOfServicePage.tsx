import { Box, Heading, Text, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';

const sectionHeadingStyle = {
    size: 'md' as const,
    color: 'white'
};

export default function TermsOfServicePage() {
    const isLoggedIn = !!localStorage.getItem('access_token');

    return (
        <Box minH="100vh" w="100%" bg="#0a0a0f" color="gray.300">
            {!isLoggedIn && <PublicNavbar />}
            <Box display="flex" flexDirection="column" alignItems="center" style={{ textAlign: 'left' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: '800px' }}>
                    <Box w="100%" mx="auto" px={{ base: 6, md: 12 }} pt={{ base: 10, md: 14 }} pb="120px">
                        <Stack gap={10} align="stretch">

                            <Box>
                                <Heading textAlign="left" size="lg" mb={4} color="white">
                                    Terms of Service
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    These Terms of Service govern your use of Sigma, our task management and team collaboration platform.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    1. Acceptance of Terms
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    By creating an account or using Sigma, you agree to these Terms and to use the platform in accordance with applicable laws and project rules. These Terms constitute a binding agreement between you and the Sigma team.
                                </Text>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    We may update these Terms at any time. Continued use of Sigma after updates means you accept the revised Terms. If you do not agree to any changes, you must stop using the platform and request account deletion.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    2. Account Responsibilities
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    As a user of Sigma, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
                                </Text>
                                <Box as="ul" pl={5} color="inherit" mb={4}>
                                    <Box as="li" mb={2} lineHeight="1.8">Provide accurate and up-to-date information when registering and maintain current contact details.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Keep your login credentials secure and do not share them with unauthorized users or in unencrypted communication.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Be responsible for activity performed through your account and immediately notify us of unauthorized access.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Use your account only for lawful purposes and in accordance with these Terms.</Box>
                                </Box>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    Sigma is not liable for any loss or damage resulting from unauthorized access due to your failure to maintain secure credentials.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    3. Acceptable Use
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    You agree not to use Sigma in ways that could harm, disrupt, or negatively affect the platform or other users. Specifically, you agree not to:
                                </Text>
                                <Box as="ol" pl={5} color="inherit" mb={4}>
                                    <Box as="li" mb={2} lineHeight="1.8">Use the application for illegal activities or violate any applicable laws or regulations.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Upload, distribute, or create malicious software, viruses, worms, or any code intended to harm systems or data.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Send spam, scams, chain letters, phishing attempts, or abusive messages to other users or teams.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Harass, threaten, defame, or discriminate against other users based on protected characteristics.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Attempt to access, hack, or exploit the platform, its infrastructure, or other users' data without authorization.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Share or copy other users' work, credentials, or sensitive information without permission.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Disrupt service through denial-of-service attacks, resource exhaustion, or intentional overuse of platform resources.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Circumvent security measures, reverse-engineer the platform, or attempt to gain unauthorized access to restricted features.</Box>
                                </Box>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    Violations may result in immediate suspension or termination of your account without warning.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    4. User Content and Intellectual Property
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    You retain ownership of all content you create or upload to Sigma, including projects, tasks, comments, documents, and files. By uploading or sharing content, you grant Sigma a non-exclusive license to host, process, display, and transmit your content to provide the service.
                                </Text>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    Upon account termination, your personal data will be deleted as per our Privacy Policy. However, content you shared in team projects remains in those projects for other team members to access, unless you explicitly delete it beforehand. The platform itself, including its code, design, features, and documentation, remains the property of the Sigma team. You may not copy, distribute, modify, or create derivative works of the platform without explicit permission.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    5. Service Availability and Maintenance
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    Sigma is provided on an "as-is" and "as-available" basis without guarantees of continuous availability. We may update, modify, improve, suspend, or discontinue features or the entire service at any time with or without notice.
                                </Text>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    We may perform scheduled or emergency maintenance that temporarily interrupts service. We aim to minimize downtime and will attempt to schedule maintenance during off-peak hours, but we do not guarantee specific availability windows or provide advance notice for emergency repairs. The service is not backed by a Service Level Agreement (SLA), and we make no uptime guarantees.
                                </Text>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    Regular backups are performed for disaster recovery, but backup retention is limited to 30 days. We recommend users maintain their own backup copies of critical data. We are not liable for data loss due to service interruptions, maintenance, or any other cause.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    6. Suspension, Termination, and Dispute Resolution
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    We may suspend, restrict, or terminate your access to Sigma immediately if we determine (in our sole discretion) that you have:
                                </Text>
                                <Box as="ul" pl={5} color="inherit" mb={4}>
                                    <Box as="li" mb={2} lineHeight="1.8">Violated these Terms or applicable laws.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Jeopardized the security of the platform, other users, or data.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Disrupted the experience of other users through abusive, harassing, or disruptive behavior.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">Engaged in unauthorized access, fraud, or misrepresentation.</Box>
                                </Box>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    You may request account deletion at any time. Upon deletion, your personal data will be removed within 30 days, though content in shared projects will remain visible to other team members.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    7. Limitation of Liability
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    To the fullest extent permitted by law, Sigma and its team are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform, including but not limited to loss of profits, data loss, business interruption, or any other damage, even if advised of the possibility of such damages.
                                </Text>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    We do not warrant that the platform will be uninterrupted, secure, or error-free. We do not guarantee that defects will be corrected or that the service will meet your specific needs. Use of the platform is at your own risk.
                                </Text>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    In no event shall Sigma's total liability to you exceed the amount you have paid for the service in the past 12 months, or $100, whichever is less.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    8. Changes to These Terms
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit" mb={3}>
                                    We may update these Terms at any time. Changes will be effective immediately upon posting to the platform. Your continued use of Sigma after updates indicates acceptance of the revised Terms. We will make reasonable efforts to notify users of significant changes, but it is your responsibility to review the Terms regularly.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    9. Contact and Dispute Resolution
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    For questions about these Terms, contact the project maintainers or the team responsible for the deployment.
                                </Text>
                            </Box>
                        </Stack>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
}
