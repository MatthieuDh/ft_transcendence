import { Box, Container, Heading, ListItem, OrderedList, Text, UnorderedList, Stack } from '@chakra-ui/react';

const sectionStyle = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'gray.200',
  borderRadius: '2xl',
  p: { base: 5, md: 8 },
  _dark: { bg: 'gray.800', borderColor: 'gray.700' }
};

export default function PrivacyPolicyPage() {
  return (
    <Box minH="100vh" bg="gray.50" py={10} pb="110px" _dark={{ bg: 'gray.900' }}>
      <Container maxW="4xl">
        <Stack gap={6}>
          <Box {...sectionStyle}>
            <Heading size="xl" mb={3} color="gray.800" _dark={{ color: 'white' }}>
              Privacy Policy
            </Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              This Privacy Policy explains how Sigma collects, uses, and protects your information in our task management application.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>Information We Collect</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }} mb={4}>
              We only collect information needed to provide and improve the service.
            </Text>
            <UnorderedList spacing={2} pl={5} color="gray.600" _dark={{ color: 'gray.300' }}>
              <ListItem><strong>Email address</strong> for account creation, login, and notifications.</ListItem>
              <ListItem><strong>Hashed password</strong> to secure your account credentials.</ListItem>
              <ListItem><strong>Avatar</strong> or profile image to personalize your account.</ListItem>
              <ListItem><strong>Project and task data</strong> such as titles, descriptions, assignments, due dates, and status updates.</ListItem>
              <ListItem><strong>Chat messages</strong> and collaboration content shared within the application.</ListItem>
            </UnorderedList>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>How We Use Your Information</Heading>
            <OrderedList spacing={2} pl={5} color="gray.600" _dark={{ color: 'gray.300' }}>
              <ListItem>To create and manage your user account.</ListItem>
              <ListItem>To let you organize projects, tasks, comments, and team communication.</ListItem>
              <ListItem>To send notifications related to your activity and workspace updates.</ListItem>
              <ListItem>To keep the application secure, reliable, and prevent abuse.</ListItem>
            </OrderedList>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>Data Retention and Security</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              We store data only for as long as it is needed to operate the service or meet legal requirements. Passwords are stored in hashed form and access to the application data is restricted to authorized users and services.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>Your Choices</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              You can update your profile information, manage your uploaded avatar, and request account deletion according to the project’s account management policies.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>Contact</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              If you have questions about this Privacy Policy, please contact the project administrators or your team’s maintainer.
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}