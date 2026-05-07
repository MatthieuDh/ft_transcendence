import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { Box, Flex, Heading, Text, Button, VStack, Spinner, Grid, HStack, Badge } from '@chakra-ui/react';
import { LuPlus, LuFolder, LuListTodo } from 'react-icons/lu';

import { useMainPageData } from '../hooks/useMainData';
import { ProjectCard, TaskCard } from '../components/CardData';
import CreateProjectModal from '../components/createProjectModal';

const customScrollbar = {
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': { background: 'var(--chakra-colors-gray-200)', borderRadius: '10px' },
  _dark: { '&::-webkit-scrollbar-thumb': { background: 'var(--chakra-colors-gray-600)' } }
};

export default function MainPage() {
  const navigate = useNavigate();
  const { projects, sortedTasks, isLoading, refresh } = useMainPageData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTasks = sortedTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) return <Flex h="100%" justify="center" align="center"><Spinner size="xl" color="purple.500" /></Flex>;

  return (
    <Flex direction="column" gap={8} h="calc(100vh - 120px)" maxW="1600px" mx="auto" overflow="hidden">
      
      <Flex justify="space-between" align="center" bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.100" _dark={{ bg: "gray.800", borderColor: "gray.700" }}>
        <Box>
          <Heading size="xl" mb={2}>My Workspace</Heading>
          <Text color="gray.500">Manage your projects and keep track of your tasks.</Text>
        </Box>
        <Button colorPalette="purple" size="lg" borderRadius="xl" onClick={() => setIsModalOpen(true)}>
          <LuPlus /> New Project
        </Button>
      </Flex>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={8} alignItems="start" flex={1} minH={0}>
        
        <Flex direction="column" h="100%" minH={0}>
          <SectionHeader title="My Projects" count={filteredProjects.length} icon={<LuFolder />} color="purple" />
          <VStack align="stretch" gap={3} overflowY="auto" pr={3} css={customScrollbar} flex={1} pb={4}>
            {filteredProjects.length === 0 ? <Text color="gray.500">No projects found.</Text> : 
              filteredProjects.map(p => <ProjectCard key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />)
            }
          </VStack>
        </Flex>

        <Flex direction="column" h="100%" minH={0}>
          <SectionHeader title="My Tasks" count={filteredTasks.length} icon={<LuListTodo />} color="orange" />
          <VStack align="stretch" gap={3} overflowY="auto" pr={3} css={customScrollbar} flex={1} pb={4}>
            {filteredTasks.length === 0 ? <Text color="gray.500">No tasks found.</Text> : 
              filteredTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => navigate(`/project/${t.projectId}`)} />)
            }
          </VStack>
        </Flex>

      </Grid>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={refresh} />
    </Flex>
  );
}

function SectionHeader({ title, count, icon, color }: any) {
  return (
    <HStack justify="space-between" mb={5}>
      <HStack gap={3}>
        <Box p={2} bg={`${color}.100`} color={`${color}.600`} borderRadius="lg" _dark={{ bg: `${color}.900`, color: `${color}.200` }}>{icon}</Box>
        <Heading size="md">{title}</Heading>
      </HStack>
      <Badge colorPalette={color} variant="subtle" borderRadius="full" px={2}>{count}</Badge>
    </HStack>
  );
}