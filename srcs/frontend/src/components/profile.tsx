import type { User } from '@transcendence/shared/srcs/types/user';
import { Card, HStack, VStack, Avatar, Text, Heading, List } from '@chakra-ui/react';

interface ProfileProps {
  user: User;
}

function Profile({ user }: ProfileProps) {
  return (
    <VStack gap={4} align="stretch">
    <Card.Root>
      <Card.Body>

        <HStack gap={4}>
          {/* left: avatar */}
          <Avatar.Root size="2xl">
            <Avatar.Image src={user.avatar ?? undefined} />
            <Avatar.Fallback>{user.username?.charAt(0).toUpperCase()}</Avatar.Fallback>
          </Avatar.Root>

          {/* right: info stacked */}
          <VStack align="start" gap={5}>
            <Heading size="md" color="fg.default">{user.username}</Heading>
            <Text color="fg.muted">{user.email}</Text>
            <Text color="fg.muted">
              Member since {new Date(user.createdAt).toLocaleDateString('en-GB', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</Text>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>

    {/*Projects*/}
    <Card.Root>
        <Card.Header>
            <Heading size="md" color= "fg.default">Projects</Heading>
        </Card.Header>
        <Card.Body>
        {user.projectMembership && user.projectMembership.length > 0 ? (
          <List.Root mt={4}>
            {user.projectMembership.map((membership) => (
              <List.Item key={membership.id}>
                {membership.project?.name ?? 'Unknown project'}
              </List.Item>
            ))}
          </List.Root>
        ) : (
          <Text mt={4}>No projects yet</Text>
        )}
        </Card.Body>
    </Card.Root>
    </VStack>
  );
}

export default Profile;