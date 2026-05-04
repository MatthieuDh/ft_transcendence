import { Box, HStack, Text, Avatar, IconButton, VStack } from '@chakra-ui/react';
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody } from './ui/popover';
import { LuPlus, LuCheck } from 'react-icons/lu';
import { Tooltip } from './ui/tooltip';
import type { User, ProjectMember } from '../../../../shared/srcs/types';

interface TaskAssigneesProps {
  taskId: number;
  assignees: User[];
  projectMembers: ProjectMember[];
  onAssign: (taskId: number, userIds: number[]) => void;
}

export default function TaskAssignees({ taskId, assignees, projectMembers, onAssign }: TaskAssigneesProps) {
  
  const toggleAssignee = (userId: number) => {
    const isAssigned = assignees.some(a => a.id === userId);
    if (isAssigned) {
      onAssign(taskId, assignees.filter(a => a.id !== userId).map(a => a.id));
    } else {
      onAssign(taskId, [...assignees.map(a => a.id), userId]);
    }
  };

  return (
    <HStack gap={2} mb={3} wrap="wrap" align="center">
      
      {assignees.map((user) => (
        <Tooltip key={user.id} content={user.username} portalled>
          <Box position="relative" cursor="pointer" onClick={() => toggleAssignee(user.id)} role="group">
            <Avatar.Root size="sm">
              <Avatar.Image src={user.avatar || undefined} />
              <Avatar.Fallback boxSize="full" display="flex" alignItems="center" justifyContent="center" bg="purple.500" color="white" fontWeight="bold">
                {user.username.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            
            <Box
              position="absolute" top="0" left="0" w="full" h="full" bg="blackAlpha.600"
              borderRadius="full" opacity="0" _groupHover={{ opacity: 1 }}
              display="flex" alignItems="center" justifyContent="center" transition="all 0.2s"
            >
              <Text color="white" fontSize="xs" fontWeight="bold">✕</Text>
            </Box>
          </Box>
        </Tooltip>
      ))}

      <PopoverRoot positioning={{ placement: "bottom-start" }}>
        <PopoverTrigger asChild>
          <IconButton 
            size="xs" 
            variant="outline" 
            borderRadius="full" 
            aria-label="Add assignee"
            borderStyle="dashed"
            color="gray.500"
            _hover={{ bg: "purple.50", color: "purple.600", borderColor: "purple.400" }}
          >
            <LuPlus />
          </IconButton>
        </PopoverTrigger>

        <PopoverContent w="200px" p={0} overflow="hidden" boxShadow="lg" _dark={{ bg: "gray.800" }}>
          <Box p={2} borderBottom="1px solid" borderColor="gray.100" bg="gray.50" _dark={{ borderColor: "gray.700", bg: "gray.900" }}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500">Assign Members</Text>
          </Box>
          <PopoverBody p={0} maxH="200px" overflowY="auto">
            <VStack gap={0} align="stretch">
              
              {projectMembers.length === 0 && (
                <Text p={3} fontSize="sm" color="gray.500" textAlign="center">No members in project.</Text>
              )}

              {projectMembers.map(member => {
                const isAssigned = assignees.some(a => a.id === member.userId);
                
                return (
                  <HStack 
                    key={member.userId} 
                    p={2} 
                    cursor="pointer" 
                    _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                    onClick={() => toggleAssignee(member.userId)}
                    justify="space-between"
                  >
                    <HStack gap={2}>
                      <Avatar.Root size="xs">
                        <Avatar.Image src={member.user?.avatar || undefined} />
                        <Avatar.Fallback boxSize="full" display="flex" alignItems="center" justifyContent="center" bg="purple.500" color="white" fontWeight="bold">
                          {member.user?.username?.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Text fontSize="sm" fontWeight={isAssigned ? "bold" : "normal"}>
                        {member.user?.username || `User ${member.userId}`}
                      </Text>
                    </HStack>
                    
                    {isAssigned && <Box color="green.500"><LuCheck size={14}/></Box>}
                  </HStack>
                );
              })}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
      
    </HStack>
  );
}