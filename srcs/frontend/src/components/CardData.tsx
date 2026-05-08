import { Box, HStack, VStack, Text, Heading, Badge, Card, Avatar } from '@chakra-ui/react';
import { LuFolder, LuClock, LuCalendarDays, LuArrowRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import type { Project, Task } from '../../../../shared/srcs/types';

export function ProjectCard({ project, onClick }: { project: Project, onClick: () => void }) {
  return (
    <Card.Root onClick={onClick} variant="outline" cursor="pointer" borderRadius="2xl" bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} _hover={{ borderColor: 'purple.400', shadow: 'sm', transform: 'translateY(-2px)' }} transition="all 0.2s">
      <Card.Body p={4}>
        <HStack justify="space-between" align="start" mb={2}>
          <HStack gap={3}>
            <Box p={2} bg="gray.50" borderRadius="md" _dark={{ bg: "gray.700" }}><LuFolder size={18} color="purple.500" /></Box>
            <Box>
              <Heading size="sm" truncate>{project.name}</Heading>
              <Text fontSize="xs" color="gray.500" lineClamp={1}>{project.description || "No description provided."}</Text>
            </Box>
          </HStack>
          <Badge variant="subtle" colorPalette={project.status === 'COMPLETED' ? 'green' : project.status === 'ACTIVE' ? 'blue' : 'gray'} borderRadius="full" px={2}>{project.status}</Badge>
        </HStack>
        <HStack justify="space-between" mt={3}>
          <HStack color="gray.400" fontSize="xs" fontWeight="bold">
            <LuCalendarDays size={12} />
            <Text>{project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No deadline'}</Text>
          </HStack>
          <Text fontSize="xs" color="purple.500" fontWeight="bold" display="flex" alignItems="center" gap={1}>View <LuArrowRight size={12} /></Text>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

export function TaskCard({ task, onClick }: { task: Task, onClick: () => void }) {
  const navigate = useNavigate();
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'DONE';
  const isDone = task.status === 'DONE';
  
  const assigneeData = (task as any).assignees?.[0] || (task as any).assignee?.[0];
  const actualUser = assigneeData?.user || assigneeData;
  
  const assigneeName = actualUser?.username || "Unassigned";
  const assigneeAvatar = actualUser?.avatar || undefined;
  const assigneeId = actualUser?.id || undefined;

  return (
    <Card.Root
      onClick={onClick}
      variant="outline"
      cursor="pointer"
      borderRadius="2xl"
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      _hover={{ borderColor: 'purple.400', shadow: 'sm', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      opacity={isDone ? 0.6 : 1}
    >
      <Card.Body p={4}>
        <HStack justify="space-between" align="start" mb={2}>
          <Heading size="sm" textDecoration={isDone ? "line-through" : "none"} truncate>{task.title}</Heading>
          <Badge size="sm" variant="subtle" colorPalette={isDone ? 'green' : task.status === 'TODO' ? 'gray' : task.status === 'PENDING_EVALUATION' ? 'orange' : 'blue'}>
            {task.status.replace('_', ' ')}
          </Badge>
        </HStack>
        <HStack justify="space-between" mt={3}>
          <HStack gap={2}>
            <Avatar.Root 
              size="xs" 
              borderRadius="full" 
              overflow="hidden"
              cursor={assigneeId ? "pointer" : "default"}
              onClick={(e) => {
                if (assigneeId) {
                  e.stopPropagation();
                  navigate(`/profile/${assigneeId}`);
                }
              }}
              _hover={assigneeId ? { opacity: 0.7 } : {}}
            >
              <Avatar.Image src={assigneeAvatar} />
              <Avatar.Fallback boxSize="full" display="flex" alignItems="center" justifyContent="center" bg={assigneeName === "Unassigned" ? "gray.400" : "purple.500"} color="white" fontSize="10px" fontWeight="bold">
                {assigneeName.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <VStack align="start" gap={0}>
              <Text fontSize="xs" fontWeight="bold" color="gray.700" _dark={{ color: "gray.200" }} lineClamp={1}>{(task as any).project?.name || 'No Project'}</Text>
              <Text fontSize="10px" color="gray.500">{assigneeName}</Text>
            </VStack>
          </HStack>
          {task.deadline && (
            <HStack color={isDone ? "green.500" : isOverdue ? "red.500" : "gray.400"} fontSize="xs" fontWeight="bold">
              <LuClock size={12} />
              <Text>{new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
            </HStack>
          )}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
