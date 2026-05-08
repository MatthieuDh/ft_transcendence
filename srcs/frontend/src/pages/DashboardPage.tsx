import { useDashboard } from '../hooks/useDashboard.ts';
import {
  Box,
  Flex,
  Text,
  Grid,
  Spinner,
  HStack,
  VStack,
  Card,
  Heading,
} from '@chakra-ui/react';
import {
  LuTriangleAlert,
} from 'react-icons/lu';
import type { ProjectRiskLevel } from '../../../../shared/srcs/types';
import { DonutChart } from '../components/ui/donut-chart.tsx';

function StatLine({ label, value }: { label: string; value: string | number }) {
  return (
    <HStack justify="space-between" w="100%">
      <Text fontSize="sm">
        {label}
      </Text>
      <Text fontWeight="bold">
        {value}
      </Text>
    </HStack>
  );
}

export default function DashboardPage() {
  const { metrics, currentUser, isLoading, error } = useDashboard({});

  if (!currentUser) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }
  if (isLoading) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (!metrics) {
    return (
      <Flex h="100vh" justify="center" align="center" direction="column" gap={4}>
        <Text fontWeight="bold">Failed to load dashboard metrics.</Text>
        {error && <Text color="red.600" fontSize="sm">{error}</Text>}
      </Flex>
    );
  }

  const riskCounts = metrics.projectHealthList.reduce<Record<ProjectRiskLevel, number>>(
    (acc, project) => {
      acc[project.risk] += 1;
      return acc;
    },
    { HEALTHY: 0, WATCH: 0, AT_RISK: 0, CRITICAL: 0 }
  );

  const inProgressProjects = Math.max(metrics.totalProjects - metrics.completedProjects, 0);
  const riskyProjects = riskCounts.AT_RISK + riskCounts.CRITICAL;

  return (
    <Flex h="100%" direction="column" gap={6} align="stretch">
      {error && (
        <Box
          bg="red.100"
          p={4}
          borderRadius="md"
          border="1px solid"
          borderColor="red.300"
        >
          <HStack gap={2}>
            <LuTriangleAlert color="red" size={20} />
            <VStack align="flex-start" gap={0}>
              <Text fontWeight="bold" color="red.800">
                Error Loading Dashboard
              </Text>
              <Text fontSize="sm" color="red.700">
                {error}
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}

      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={6}
        alignItems="stretch"
      >
        <Grid
          minH="360px"
          placeItems="center"
        >
          <DonutChart
            title="Projects"
            centerLabel={metrics.totalProjects}
            size={260}
            segments={[
              { value: metrics.completedProjects, color: '#3182CE', label: 'Completed' },
              { value: inProgressProjects, color: '#38A169', label: 'In Progress' },
            ]}
          />
        </Grid>

        <Grid minH="360px" placeItems="center">
          <DonutChart
            title="Tasks"
            centerLabel={metrics.totalTasks || 0}
            size={260}
            segments={[
              { value: metrics.completedTasks || 0, color: '#38A169', label: 'Completed' },
              { value: metrics.overdueTasks || 0, color: '#E53E3E', label: 'Overdue' },
              { value: metrics.pendingOverLimit || 0, color: '#DD6B20', label: 'Pending' },
            ]}
          />
        </Grid>

        <Card.Root
          minH="360px"
          boxShadow="sm"
          border="1px solid"
        >
          <Card.Body p={6}>
            <VStack align="stretch" gap={3} flex="1">
              <Heading size="md">Avg time per stage (days)</Heading>
              <StatLine label="Todo" value={metrics.avgTimePerStage.TODO} />
              <StatLine label="In progess" value={metrics.avgTimePerStage.IN_PROGRESS} />
              <StatLine label="Pending" value={metrics.avgTimePerStage.PENDING} />
              <StatLine label="Done" value={metrics.avgTimePerStage.DONE} />
            </VStack>
          </Card.Body>
        </Card.Root>

        <Grid minH="360px" placeItems="center">
          <DonutChart
            title="Project Risks"
            centerLabel={metrics.totalProjects}
            size={260}
            segments={[
              { value: riskCounts.CRITICAL, color: '#E53E3E', label: 'Critical' },
              { value: riskCounts.AT_RISK, color: '#DD6B20', label: 'At Risk' },
              { value: riskCounts.WATCH, color: '#D69E2E', label: 'Watch' },
              { value: riskCounts.HEALTHY, color: '#38A169', label: 'Healthy' },
            ]}
          />
        </Grid>
      </Grid>

    </Flex>
  );
}