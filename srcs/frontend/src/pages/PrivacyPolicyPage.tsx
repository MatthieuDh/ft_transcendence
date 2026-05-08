import { Box, Heading, Text, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';

const sectionHeadingStyle = {
    size: 'md' as const,
    color: 'white'
};

export default function PrivacyPolicyPage() {
    const isLoggedIn = !!localStorage.getItem('access_token');

    return (
        <Box minH="100vh" w="100%" bg="#0a0a0f" color="gray.300">
            {!isLoggedIn && <PublicNavbar />}
            <Box display="flex" flexDirection="column" alignItems="center" style={{ textAlign: 'left' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: '800px' }}>
                    <Box w="100%" mx="auto" px={{ base: 6, md: 12 }} pt={{ base: 10, md: 14 }} pb="120px">
                        <Stack gap={10} align="stretch">
                            <Box borderBottom="1px solid rgba(255,255,255,0.08)" pb={6}>
                                <Heading textAlign="left" size="lg" mb={4} color="white">
                                    Privacy Policy
                                </Heading>
                                <Text lineHeight="1.8" color="gray.300">
                                    This Privacy Policy explains how Sigma collects, uses, and protects your information in our task management application.
                                </Text>
                            </Box>

                            <Box borderBottom="1px solid rgba(255,255,255,0.08)" pb={6}>
                                <Heading {...sectionHeadingStyle} mb={3}>
                                    1. Introduction
                                </Heading>
                                <Text lineHeight="1.8" color="gray.300">
                                    This Privacy Policy explains how Sigma collects, uses, and protects your information in our task management application.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    2. Data We Collect
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300" mb={4}>
                                    We only collect information needed to provide and improve the service. When you create an account and use Sigma, we collect the following types of data:
                                </Text>
                                <Box as="ul" pl={5} color="gray.300" mb={4}>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Authentication data:</strong> Email address, hashed password, and session tokens used for login and maintaining your session.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Profile information:</strong> Display name, avatar image, and any biographical information you provide.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Usage data:</strong> Login timestamps, IP addresses (for security monitoring), device information, and activity logs.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Project and collaboration data:</strong> Projects you create or join, tasks and their metadata, comments and attachments, chat messages, and real-time presence information.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Communication preferences:</strong> Notification settings, email preferences, and communication history.</Box>
                                </Box>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300">
                                    We do not sell or share your personal data with third parties for marketing purposes. Data is collected solely to operate the platform, improve user experience, and ensure security.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    3. How We Use Your Information
                                </Heading>
                                <Box as="ol" pl={5} color="gray.300">
                                    <Box as="li" mb={2} lineHeight="1.8">To authenticate your account and maintain your secure session.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">To create and manage your user account.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">To deliver core features: organize projects, tasks, comments, and enable team communication.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">To send notifications related to your activity, workspace updates, and important security alerts.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">To monitor for suspicious activity, prevent abuse, protect against unauthorized access, and maintain platform security.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">To improve the platform through usage analytics, error tracking, and feature optimization.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8">To comply with legal obligations and respond to valid legal requests.</Box>
                                </Box>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    4. Data Retention
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300" mb={4}>
                                    We retain data for different periods depending on its type and purpose:
                                </Text>
                                <Box as="ul" pl={5} color="gray.300" mb={4}>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Account data (email, password hash, profile):</strong> Retained for the duration of your account. Deleted within 30 days of account termination.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Project and task data:</strong> Retained as long as the project exists. Owners can delete projects, after which data is removed within 30 days.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Chat messages and comments:</strong> Retained as long as they exist in the platform. Users can delete their own messages; project admins can remove content.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Login logs and activity data:</strong> Retained for 90 days for security and troubleshooting purposes, then deleted.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Backups:</strong> Data may be retained in database backups for up to 30 days beyond deletion for disaster recovery purposes.</Box>
                                </Box>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    5. Security and Data Protection
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300">
                                    We implement industry-standard security measures to protect your information. Passwords are hashed using strong cryptographic algorithms and are never stored in plaintext. All communication between your device and our servers is encrypted using TLS/SSL. Access to user data is restricted to authorized team members and is logged for audit purposes. We regularly review our security practices and respond to threats. However, no system is completely secure; we encourage you to use strong, unique passwords and enable multi-factor authentication where available.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    6. Your Privacy Rights and Choices
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300" mb={3}>
                                    You have control over your information and can exercise the following rights:
                                </Text>
                                <Box as="ul" pl={5} color="gray.300" mb={4}>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Access:</strong> You can view, download, and export all your personal data and content from your account.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Update:</strong> You can update your profile information, including name, email, and avatar at any time.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Delete:</strong> You can request deletion of your account and associated personal data. We will delete your data within 30 days, except where required by law or backup systems.</Box>
                                    <Box as="li" mb={2} lineHeight="1.8"><strong>Opt-out:</strong> You can manage notification preferences and opt out of non-essential communications in your account settings.</Box>
                                </Box>
                                <Text textAlign="left" lineHeight="1.8" color="inherit">
                                    To exercise any of these rights, contact the project administrators or your team's maintainer with your request.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    7. Cookies and Session Tokens
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300" mb={3}>
                                    Sigma uses cookies and session tokens to maintain your login status and personalize your experience. Session tokens are created when you log in and expire when you log out or after a period of inactivity. These are essential for the application to function and cannot be disabled. You can manage cookies through your browser settings, though this may limit the platform's functionality.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    8. Third Party Services
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300" mb={3}>
                                    Sigma integrates with Google OAuth for optional sign-up and login. If you choose to authenticate via Google, your email address is retrieved and used to create or access your Sigma account. Google's privacy practices are governed by their Privacy Policy. We do not share your Sigma data with Google beyond what is necessary for authentication. Other than Google OAuth, we do not use third-party services to process your personal data.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    9. Changes to This Policy
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300" mb={3}>
                                    We may update this Privacy Policy from time to time. We will notify you of significant changes via email or by posting a notice on the platform. Your continued use of Sigma after changes indicates your acceptance of the updated policy.
                                </Text>
                            </Box>

                            <Box>
                                <Heading textAlign="left" {...sectionHeadingStyle} mb={3}>
                                    10. Contact
                                </Heading>
                                <Text textAlign="left" lineHeight="1.8" color="gray.300">
                                    If you have questions about this Privacy Policy, please contact the project administrators or your team’s maintainer.
                                </Text>
                            </Box>
                        </Stack>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
}
