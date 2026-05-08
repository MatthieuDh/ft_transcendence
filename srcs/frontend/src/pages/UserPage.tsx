import { 
  Box, 
  Heading, 
  Table, 
  Badge, 
  HStack, 
  Text, 
  Spinner, 
  Flex,
  Button,
  Avatar
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import { LuExternalLink } from "react-icons/lu";

export default function UsersPage() {
  const { users, isLoading } = useUsers();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Flex h="100%" align="center" justify="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="xl" 
      boxShadow="sm" 
      border="1px solid" 
      borderColor="gray.200" 
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
    >
      <Heading size="lg" mb={6}>Platform Users</Heading>

      <Box overflowX="auto">
        <Table.Root variant="line" size="md">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>User</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Global Role</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id} _hover={{ bg: "gray.50", _dark: { bg: "gray.900/50" } }}>
                <Table.Cell>
                  <HStack 
                    gap={3} 
                    cursor="pointer" 
                    onClick={() => navigate(`/profile/${user.id}`)}
                    _hover={{ color: "purple.500" }}
                  >
                    <Avatar.Root size="sm">
                      <Avatar.Image src={user.avatar || undefined} />
                      <Avatar.Fallback boxSize="full" display="flex" alignItems="center" justifyContent="center" bg="purple.500" color="white" fontSize="xs" fontWeight="bold">
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Text fontWeight="medium">{user.username}</Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell color="gray.500">{user.email}</Table.Cell>
                <Table.Cell>
                  <Badge 
                    colorPalette={user.globalRole === 'ADMIN' ? 'red' : 'blue'} 
                    variant="subtle"
                  >
                    {user.globalRole}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <LuExternalLink /> View Profile
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}