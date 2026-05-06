import { Box, Container, Heading, ListItem, OrderedList, Text, UnorderedList, Stack } from '@chakra-ui/react';

const sectionStyle = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'gray.200',
  borderRadius: '2xl',
  p: { base: 5, md: 8 },
  _dark: { bg: 'gray.800', borderColor: 'gray.700' }
};

export default function TermsOfServicePage() {
  return (
    <Box minH="100vh" bg="gray.50" py={10} pb="110px" _dark={{ bg: 'gray.900' }}>
      <Container maxW="4xl">
        <Stack gap={6}>
          <Box {...sectionStyle}>
            <Heading size="xl" mb={3} color="gray.800" _dark={{ color: 'white' }}>
              Terms of Service
            </Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              These Terms of Service govern your use of Sigma, our task management and team collaboration platform.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>1. Acceptance of Terms</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              By creating an account or using Sigma, you agree to these Terms and to use the platform in accordance with applicable laws and project rules.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>2. Account Responsibilities</Heading>
            <UnorderedList spacing={2} pl={5} color="gray.600" _dark={{ color: 'gray.300' }}>
              <ListItem>Provide accurate and up-to-date information when registering.</ListItem>
              <ListItem>Keep your login credentials secure and do not share them with unauthorized users.</ListItem>
              <ListItem>Be responsible for activity performed through your account.</ListItem>
            </UnorderedList>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>3. Acceptable Use</Heading>
            <OrderedList spacing={2} pl={5} color="gray.600" _dark={{ color: 'gray.300' }}>
              <ListItem>Use the application only for lawful task and project collaboration.</ListItem>
              <ListItem>Do not upload malicious content, spam, or abusive messages.</ListItem>
              <ListItem>Respect the privacy and work of other users in your workspace.</ListItem>
              <ListItem>Do not attempt to access data or features without proper authorization.</ListItem>
            </OrderedList>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>4. User Content</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              You remain responsible for the content you submit, including project data, tasks, comments, attachments, and chat messages. You grant Sigma the right to host and process this content as needed to provide the service.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>5. Service Availability</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              The service is provided on an as-is and as-available basis. We may update, change, or temporarily interrupt the platform for maintenance, security, or feature improvements.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>6. Suspension and Termination</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              We may suspend or terminate access if a user violates these Terms, jeopardizes the security of the platform, or disrupts the experience of other users.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>7. Changes to These Terms</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              These Terms may be updated as the project evolves. Continued use of Sigma after updates means you accept the revised Terms.
            </Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading size="md" mb={3}>8. Contact</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
              For questions about these Terms, contact the project maintainers or the team responsible for the deployment.
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}