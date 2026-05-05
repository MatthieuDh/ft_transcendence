import type { User, ProjectMembershipRef } from '../../../../shared/srcs/types';
import { Box, HStack, VStack, Avatar, Text, Heading, Badge, Flex } from '@chakra-ui/react';
import { LuMail, LuCalendar, LuFolder } from 'react-icons/lu';

interface ProfileProps {
  user: User;
}

function Profile({ user }: ProfileProps) {
  const projectCount = user.projectMemberships?.length ?? 0;

  return (
    <VStack gap={4} align="stretch">
      <Box
        borderRadius="xl" overflow="hidden"
        boxShadow="sm" borderWidth="1px" borderColor="gray.100"
        _dark={{ borderColor: "gray.700" }}
        bg="white" _dark_bg="gray.800"
      >
        <Box
          h="100px"
          bgGradient="to-r"
          gradientFrom="purple.500"
          gradientTo="blue.500"
          position="relative"
        />
        <Box px={6} pb={6}>
          <Flex justify="space-between" align="flex-end" mt="-40px" mb={4}>
            <Avatar.Root size="2xl" borderWidth="4px" borderColor="white" _dark={{ borderColor: "gray.800" }} boxShadow="md">
              <Avatar.Image src={user.avatar ?? undefined} />
              <Avatar.Fallback
                fontSize="2xl" fontWeight="bold"
                bg="purple.100" color="purple.700"
                _dark={{ bg: "purple.800", color: "purple.200" }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            {user.globalRole === 'ADMIN' && (
              <Badge colorPalette="purple" variant="solid" borderRadius="full" px={3}>Admin</Badge>
            )}
          </Flex>

          <Heading size="lg" mb={1}>{user.username}</Heading>

          <VStack align="start" gap={2} mt={3}>
            <HStack gap={2} color="gray.500" fontSize="sm">
              <LuMail size={14} />
              <Text>{user.email}</Text>
            </HStack>
            <HStack gap={2} color="gray.500" fontSize="sm">
              <LuCalendar size={14} />
              <Text>
                Lid sinds {new Date(user.createdAt).toLocaleDateString('nl-BE', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </Text>
            </HStack>
          </VStack>

          <HStack gap={4} mt={5} pt={4} borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.700" }}>
            <Box textAlign="center">
              <Text fontWeight="bold" fontSize="xl" color="purple.500">{projectCount}</Text>
              <Text fontSize="xs" color="gray.500">Projecten</Text>
            </Box>
          </HStack>
        </Box>
      </Box>

      <Box
        bg="white" _dark={{ bg: "gray.800" }}
        borderRadius="xl" boxShadow="sm"
        borderWidth="1px" borderColor="gray.100" _dark_borderColor="gray.700"
        p={6}
      >
        <HStack mb={4} gap={2}>
          <LuFolder size={18} />
          <Heading size="sm">Projecten</Heading>
        </HStack>
        {user.projectMemberships && user.projectMemberships.length > 0 ? (
          <VStack align="stretch" gap={2}>
            {(user.projectMemberships as ProjectMembershipRef[]).map((membership) => (
              <Flex
                key={membership.id}
                align="center" justify="space-between"
                p={3} borderRadius="md"
                bg="gray.50" _dark={{ bg: "gray.700" }}
              >
                <Text fontSize="sm" fontWeight="medium">{membership.project?.name ?? 'Onbekend project'}</Text>
                {membership.role && (
                  <Badge
                    colorPalette={membership.role === 'PROJECT_LEADER' ? 'purple' : 'gray'}
                    variant="subtle" fontSize="xs"
                  >
                    {membership.role === 'PROJECT_LEADER' ? '👑 Leider' : 'Lid'}
                  </Badge>
                )}
              </Flex>
            ))}
          </VStack>
        ) : (
          <Flex direction="column" align="center" py={8} gap={2}>
            <Text fontSize="2xl">📁</Text>
            <Text fontSize="sm" color="gray.400">Nog geen projecten</Text>
          </Flex>
        )}
      </Box>
    </VStack>
  );
}

export default Profile;
