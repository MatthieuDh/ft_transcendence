import type { User, ProjectMembershipRef } from '../../../../shared/srcs/types';
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
            <Avatar.Root size="2xl">
              <Avatar.Image src={user.avatar ?? undefined} />
              <Avatar.Fallback>{user.username?.charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar.Root>

            <VStack align="start" gap={5}>
              <Heading size="md" color="fg.default">{user.username}</Heading>
              <Text color="fg.muted">{user.email}</Text>
              <Text color="fg.muted">
                Member since {new Date(user.createdAt).toLocaleDateString('en-GB', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </Text>
            </VStack>
          </HStack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Heading size="md" color="fg.default">Projects</Heading>
        </Card.Header>
        <Card.Body>
          {user.projectMemberships && user.projectMemberships.length > 0 ? (
            <List.Root mt={4}>
              {(user.projectMemberships as ProjectMembershipRef[]).map((membership) => (
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
