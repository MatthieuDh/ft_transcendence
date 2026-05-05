import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, Input, Textarea, VStack, HStack, SimpleGrid, Card, Badge, Spinner } from '@chakra-ui/react';
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogCloseTrigger } from '../components/ui/dialog';
import { projectService, taskService } from '../api/services';
import type { Project, Task } from '../../../../shared/srcs/types';
import { LuPlus, LuFolder, LuListTodo } from 'react-icons/lu';

export default function MainPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        projectService.getAll(),
        taskService.getMyTasks()
      ]);
      
      const projectsData = Array.isArray(projectsRes.data) 
        ? projectsRes.data 
        : (projectsRes.data as any).data || [];
      
      const tasksData = Array.isArray(tasksRes.data)
        ? tasksRes.data
        : (tasksRes.data as any).data || [];

      setProjects(projectsData);
      setMyTasks(tasksData);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await projectService.create({
        name: newProjectName,
        description: newProjectDesc || undefined,
        deadline: newProjectDeadline ? new Date(newProjectDeadline).toISOString() : undefined,
      });
      
      const newProject = res.data;
      
      setIsCreateModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      setNewProjectDeadline('');
      
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error("Failed to create project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex h="100%" justify="center" align="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={8} h="100%">
      
      <Flex justify="space-between" align="center" bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" _dark={{ bg: "gray.800", borderColor: "gray.700" }}>
        <Box>
          <Heading size="lg" mb={1}>My Workspace</Heading>
          <Text color="gray.500">Manage your projects and tasks in one place.</Text>
        </Box>
        <Button colorPalette="purple" size="lg" onClick={() => setIsCreateModalOpen(true)}>
          <LuPlus /> New Project
        </Button>
      </Flex>

      <Box>
        <HStack mb={4} gap={2}>
          <LuFolder size={20} color="#aa3bff" />
          <Heading size="md">My Projects</Heading>
          <Badge colorPalette="purple" borderRadius="full">{projects.length}</Badge>
        </HStack>
        
        {projects.length === 0 ? (
          <Box p={8} textAlign="center" bg="gray.50" borderRadius="lg" border="1px dashed" borderColor="gray.300" _dark={{ bg: "gray.800", borderColor: "gray.600" }}>
            <Text color="gray.500">No projects yet. Create one to get started!</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={4}>
            {projects.map(project => (
              <Card.Root 
                key={project.id} 
                onClick={() => navigate(`/project/${project.id}`)}
                variant="elevated" 
                cursor="pointer"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)', transition: 'all 0.2s', borderColor: 'purple.400' }}
                border="1px solid"
                borderColor="transparent"
              >
                <Card.Body>
                  <Heading size="sm" mb={2} truncate>{project.name}</Heading>
                  <Text fontSize="sm" color="gray.500" mb={4} lineClamp={2}>
                    {project.description || "No description provided."}
                  </Text>
                  <HStack justify="space-between" mt="auto">
                    <Badge variant="subtle" colorPalette={project.status === 'COMPLETED' ? 'green' : project.status === 'ACTIVE' ? 'blue' : 'gray'}>
                      {project.status}
                    </Badge>
                  </HStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        )}
      </Box>

      <Box flex={1}>
        <HStack mb={4} gap={2}>
          <LuListTodo size={20} color="#aa3bff" />
          <Heading size="md">My Active Tasks</Heading>
          <Badge colorPalette="purple" borderRadius="full">{myTasks.filter(t => t.status !== 'DONE').length}</Badge>
        </HStack>

        {myTasks.length === 0 ? (
          <Box p={8} textAlign="center" bg="gray.50" borderRadius="lg" border="1px dashed" borderColor="gray.300" _dark={{ bg: "gray.800", borderColor: "gray.600" }}>
            <Text color="gray.500">You don't have any assigned tasks.</Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={3}>
            {myTasks.filter(t => t.status !== 'DONE').map(task => (
              <Box 
                key={task.id} 
                p={4} 
                bg="white" 
                _dark={{ bg: "gray.800", borderColor: "gray.700" }} 
                borderRadius="lg" 
                border="1px solid" 
                borderColor="gray.200"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Text fontWeight="bold">{task.title}</Text>
                  <HStack fontSize="xs" color="gray.500" mt={1}>
                    <Badge size="sm" variant="outline" colorPalette="gray">{task.project?.name || 'Unknown Project'}</Badge>
                    {task.deadline && <Text color="red.400">Deadline: {new Date(task.deadline).toLocaleDateString()}</Text>}
                  </HStack>
                </Box>
                <Button size="sm" variant="surface" colorPalette="purple" onClick={() => navigate(`/project/${task.projectId}`)}>
                  View Project
                </Button>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      <DialogRoot open={isCreateModalOpen} onOpenChange={(e) => !e.open && setIsCreateModalOpen(false)} placement="center">
        <DialogContent _dark={{ bg: "gray.800" }}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody pb={6}>
            <VStack align="stretch" gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Project Name *</Text>
                <Input 
                  placeholder="e.g. Website Redesign" 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)} 
                  bg="white" _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Description</Text>
                <Textarea 
                  placeholder="What is this project about?" 
                  value={newProjectDesc} 
                  onChange={(e) => setNewProjectDesc(e.target.value)} 
                  rows={3}
                  bg="white" _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Deadline</Text>
                <Input 
                  type="datetime-local" 
                  value={newProjectDeadline} 
                  onChange={(e) => setNewProjectDeadline(e.target.value)} 
                  bg="white" _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                />
              </Box>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button colorPalette="purple" onClick={handleCreateProject} loading={isSubmitting} disabled={!newProjectName.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

    </Flex>
  );
}