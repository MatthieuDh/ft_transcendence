import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Flex, Heading, Text, Badge, Grid, Card, VStack, HStack, Spinner, Button } from '@chakra-ui/react';
import { LuPlus, LuX, LuTrash } from 'react-icons/lu';
import ChatButton from '../components/chatButton';
import AddMemberMenu from '../components/addMember';
import TaskAssignees from '../components/taskAssigness';
import CreateTaskModal from '../components/createTaskModal';
import TaskDetailsModal from '../components/taskDetail';
import { useProjectDetails } from '../hooks/useProjectDetails';
import { TaskStatus } from '../../../../shared/srcs/types/task';
import { ProjectStatus } from '../../../../shared/srcs/types/project';
import type { ProjectMember } from '../../../../shared/srcs/types/project';
import type { Task } from '../../../../shared/srcs/types';
import { Tooltip } from '../components/ui/tooltip';

const columns = [
  { id: TaskStatus.TODO, label: 'To Do', color: 'gray' },
  { id: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'blue' },
  { id: TaskStatus.PENDING_EVALUATION, label: 'Review', color: 'orange' },
  { id: TaskStatus.DONE, label: 'Done', color: 'green' },
];

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'gray',
  [TaskStatus.IN_PROGRESS]: 'blue',
  [TaskStatus.PENDING_EVALUATION]: 'orange',
  [TaskStatus.DONE]: 'green',
};

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, tasks, currentUser, isLoading, reloadProject, changeTaskStatus, changeProjectStatus, assignTaskMember, removeProjectMember, removeTask, deleteProject } = useProjectDetails(Number(projectId));

  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus | null>(null);
  const [selectedTaskForComments, setSelectedTaskForComments] = useState<Task | null>(null);

  if (isLoading) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (!project || !currentUser) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Text fontWeight="bold">Project not found or unauthorized.</Text>
      </Flex>
    );
  }

  const handleTaskCreated = async () => {
    setCreateTaskStatus(null);
    await reloadProject();
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const success = await deleteProject();
      if (success) {
        navigate('/');
      }
    }
  };

  const isProjectLeader = project?.members?.find(m => m.userId === currentUser?.id)?.role === 'PROJECT_LEADER';
  const isAdmin = currentUser?.globalRole === 'ADMIN';
  const isMember = project?.members?.some(m => m.userId === currentUser?.id);
  
  const canManage = isProjectLeader || isAdmin;
  const canUpdate = isMember || isAdmin;

  const liveTask = selectedTaskForComments ? tasks.find(t => t.id === selectedTaskForComments.id) || selectedTaskForComments : null;

  return (
    <Flex h="100%" direction="column" gap={6} position="relative" align="stretch">
      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" _dark={{ bg: "gray.800", borderColor: "gray.700" }}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} w="100%" gap={4}>
          <Box textAlign="left">
            <Heading size="lg" mb={1}>{project.name}</Heading>
            <Text color="gray.500" fontSize="md" mb={4}>
              {project.description || "No description available."}
            </Text>
            <HStack gap={2} flexWrap="wrap">
              {project.members?.map(member => (
                <Badge
                  key={member.id}
                  variant="subtle"
                  colorPalette="gray"
                  borderRadius="full"
                  px={3}
                  py={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text>{member.user?.username || `User ${member.userId}`}</Text>
                  {member.role === 'PROJECT_LEADER' && <Text>👑</Text>}

                  {canManage && (
                    <Box
                      as="span"
                      color="gray.400"
                      _hover={{ color: "red.500" }}
                      cursor="pointer"
                      onClick={() => removeProjectMember(member.userId)}
                      display="flex"
                      alignItems="center"
                    >
                      <LuX size={14} />
                    </Box>
                  )}
                </Badge>
              ))}
            </HStack>
          </Box>

          <VStack align={{ base: "flex-start", md: "flex-end" }} gap={3}>
            <Box bg="purple.100" color="purple.800" _dark={{ bg: "purple.900", color: "purple.200" }} px={3} py={1} borderRadius="md" display="inline-block">
              <select
                value={project.status}
                onChange={(e) => changeProjectStatus(e.target.value as ProjectStatus)}
                style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer', outline: 'none', fontSize: '14px' }}
                disabled={!canUpdate}
              >
                <option value={ProjectStatus.PLANNING} style={{ color: 'black' }}>PLANNING</option>
                <option value={ProjectStatus.ACTIVE} style={{ color: 'black' }}>ACTIVE</option>
                <option value={ProjectStatus.COMPLETED} style={{ color: 'black' }}>COMPLETED</option>
              </select>
            </Box>
            {canManage && (
              <HStack gap={2}>
                <Button size="sm" variant="subtle" colorPalette="red" onClick={handleDeleteProject}>
                  <LuTrash /> Delete
                </Button>
                <AddMemberMenu
                  projectId={project.id}
                  existingMembers={project.members || []}
                  onMemberAdded={reloadProject}
                />
              </HStack>
            )}
          </VStack>
        </Flex>
      </Box>

      <Grid 
        templateColumns={{ 
          base: "minmax(0, 1fr)", 
          md: "repeat(2, minmax(0, 1fr))", 
          lg: "repeat(4, minmax(0, 1fr))" 
        }} 
        gap={4} 
        w="full"
        alignItems="stretch"
      >
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasks}
            projectMembers={project.members || []}
            canDelete={canManage}
            onStatusChange={changeTaskStatus}
            onAssign={assignTaskMember}
            onDelete={removeTask}
            onOpenComments={setSelectedTaskForComments}
            onAddTask={() => setCreateTaskStatus(column.id)}
          />
        ))}
      </Grid>

      <CreateTaskModal
        isOpen={createTaskStatus !== null}
        onClose={() => setCreateTaskStatus(null)}
        projectId={project.id}
        initialStatus={createTaskStatus || TaskStatus.TODO}
        onSuccess={handleTaskCreated}
      />

      <TaskDetailsModal
        isOpen={selectedTaskForComments !== null}
        onClose={() => setSelectedTaskForComments(null)}
        task={liveTask}
        projectId={project.id}
        canEdit={canUpdate}
        onTaskUpdate={reloadProject}
      />

      <ChatButton projectId={project.id} currentUserId={currentUser.id} />
    </Flex>
  );
}

function TaskColumn({
  column,
  tasks,
  projectMembers,
  canDelete,
  onStatusChange,
  onAssign,
  onDelete,
  onOpenComments,
  onAddTask,
}: {
  column: { id: TaskStatus; label: string; color: string };
  tasks: Task[];
  projectMembers: ProjectMember[];
  canDelete: boolean;
  onStatusChange: (id: number, s: TaskStatus) => void;
  onAssign: (taskId: number, userIds: number[]) => void;
  onDelete: (id: number) => void;
  onOpenComments: (task: Task) => void;
  onAddTask: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const columnTasks = tasks.filter((task) => task.status === column.id);

  return (
    <VStack
      w="full"
      h="100%"
      bg={dragOver ? 'gray.200' : 'gray.100'}
      _dark={{ bg: dragOver ? 'gray.800' : 'gray.900' }}
      p={4}
      borderRadius="lg"
      minH={{ base: "auto", lg: "500px" }}
      alignItems="stretch"
      border={dragOver ? '2px dashed' : '1px solid'}
      borderColor={dragOver ? `${column.color}.400` : 'transparent'}
      transition="background-color 0.15s ease, border-color 0.15s ease"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = Number(e.dataTransfer.getData('taskId'));
        if (taskId) {
          onStatusChange(taskId, column.id);
        }
      }}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontWeight="bold" color={`${column.color}.600`} _dark={{ color: `${column.color}.300` }} textAlign="left">
          {column.label}
        </Text>
        <Badge colorPalette={column.color} borderRadius="full">
          {columnTasks.length}
        </Badge>
      </Flex>

      {columnTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          projectMembers={projectMembers}
          canDelete={canDelete}
          onStatusChange={onStatusChange}
          onAssign={onAssign}
          onDelete={onDelete}
          onOpenComments={() => onOpenComments(task)}
        />
      ))}

      <Button
        variant="ghost"
        color="gray.500"
        justifyContent="flex-start"
        w="full"
        mt={2}
        _hover={{ bg: 'gray.200', color: 'gray.800', _dark: { bg: 'gray.800', color: 'white' } }}
        onClick={onAddTask}
      >
        <LuPlus /> Add Task
      </Button>
    </VStack>
  );
}

function TaskCard({
  task,
  projectMembers,
  canDelete,
  onStatusChange,
  onAssign,
  onDelete,
  onOpenComments,
}: {
  task: Task,
  projectMembers: ProjectMember[],
  canDelete: boolean,
  onStatusChange: (id: number, s: TaskStatus) => void,
  onAssign: (taskId: number, userIds: number[]) => void,
  onDelete: (id: number) => void,
  onOpenComments: () => void,
}) {
  const cardColor = statusColors[task.status] || 'gray';
  const assignees = task.assignees || [];

  const tooltipContent = (
    <Box p={2} maxW="250px">
      {task.description && <Text fontSize="sm" mb={task.deadline ? 2 : 0}>{task.description}</Text>}
      {task.deadline && (
        <Text fontSize="xs" fontWeight="bold" color="red.300">
          Deadline: {new Date(task.deadline).toLocaleDateString()}
        </Text>
      )}
      {!task.description && !task.deadline && <Text fontSize="sm" fontStyle="italic">No extra details</Text>}
    </Box>
  );

  return (
    <Card.Root
      size="sm"
      variant="elevated"
      borderLeft="4px solid"
      borderColor={`${cardColor}.500`}
      _hover={{ shadow: 'md', transform: 'translateY(-2px)', transition: 'all 0.2s' }}
      position="relative"
      draggable={true}
      cursor="grab"
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData('taskId', String(task.id));
      }}
      onClick={onOpenComments}
      mb={2}
    >
      <Card.Body>

        {canDelete && (
          <Box
            position="absolute"
            top={2}
            right={2}
            color="gray.300"
            _hover={{ color: "red.500" }}
            zIndex={2}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <LuX size={18} />
          </Box>
        )}

        <Tooltip content={tooltipContent} positioning={{ placement: "top" }} showArrow portalled>
          <Text fontWeight="medium" mb={3} pr={5} textAlign="left" w="full" display="block" truncate>
            {task.title}
          </Text>
        </Tooltip>

        <Box onClick={(e) => e.stopPropagation()}>
          <TaskAssignees
            taskId={task.id}
            assignees={assignees as any}
            projectMembers={projectMembers}
            onAssign={onAssign}
          />
        </Box>

        <HStack justify="space-between" align="center" mt={2}>
          <Badge variant="subtle" colorPalette={cardColor}>#{task.id}</Badge>

          <Box
            onClick={(e) => e.stopPropagation()}
            color={`${cardColor}.600`}
            _dark={{ color: task.status === TaskStatus.TODO ? "white" : `${cardColor}.300` }}
            bg="transparent"
            _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
            px={2} py={1} borderRadius="md" transition="background 0.2s"
          >
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'transparent', fontSize: '11px', cursor: 'pointer', outline: 'none', fontWeight: 'bold', color: 'inherit' }}
            >
              {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </Box>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}