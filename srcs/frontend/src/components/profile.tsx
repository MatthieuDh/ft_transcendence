import type { User } from '@transcendence/shared/srcs/types/user';
import { Card, HStack, VStack, Avatar, Text, Heading, List, Tooltip } from '@chakra-ui/react';

interface ProfileProps {
  user: User;
  roleSelect?: React.ReactNode;
  editProfileButton?: React.ReactNode;
}

function Profile({ user, roleSelect, editProfileButton }: ProfileProps) {
  return (
    <VStack gap={4} align="stretch">
      <Card.Root>
        <Card.Body>
          <HStack gap={4} align="start">
            <Avatar.Root size="2xl">
              <Avatar.Image src={user.avatar ?? undefined} />
              <Avatar.Fallback>{user.username?.charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar.Root>
            <VStack align="start" gap={5} flex={1}>
              <Heading size="md" color="fg.default">{user.username}</Heading>
              <Text color="fg.muted">{user.email}</Text>
              <Text color="fg.muted">
                Member since {new Date(user.createdAt).toLocaleDateString('en-GB', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </Text>
            </VStack>
            {(roleSelect || editProfileButton) && (
              <VStack align="end " gap={2} ml="auto">
                {roleSelect}
                {editProfileButton}
              </VStack>
            )}
          </HStack>
        </Card.Body>
      </Card.Root>

    {/*Projects*/}
    <Card.Root>
        <Card.Header>
            <Heading size="md" color= "fg.default">Projects</Heading>
        </Card.Header>
        <Card.Body>
        {user.projectMemberships && user.projectMemberships.length > 0 ? (
          <List.Root mt={4}>
            {user.projectMemberships.map((membership) => (
              <List.Item key={membership.id}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Text cursor="default">{membership.project?.name ?? 'Unknown project'}</Text>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <VStack align="start" gap={1}>
                      <Text fontWeight="bold">{membership.project?.name}</Text>
                      <Text>{membership.project?.description ?? 'No description'}</Text>
                      <Text>
                        {membership.project?.deadline
                        ? `Deadline: ${new Date(membership.project.deadline).toLocaleDateString('en-GB')}`
                        : 'No deadline set'}
                      </Text>
                    </VStack>
                  </Tooltip.Content>
                </Tooltip.Root>
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