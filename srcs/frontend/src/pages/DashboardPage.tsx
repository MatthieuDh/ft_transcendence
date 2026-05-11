import { useState, type ReactNode } from 'react';
import { useDashboard } from '../hooks/useDashboard.ts';
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuDownload, LuRefreshCw, LuTriangleAlert } from 'react-icons/lu';
import { dashboardMetrics } from '../api/services';
import {
  ProjectStatus,
  TaskStatus,
  type DashboardFilters,
  type ProjectRiskLevel,
} from '../../../../shared/srcs/types';
import { DonutChart } from '../components/ui/donut-chart.tsx';

function StatLine({ label, value }: { label: string; value: string | number }) {
  return (
    <HStack justify="space-between" w="100%">
      <Text fontSize="sm">{label}</Text>
      <Text fontWeight="bold">{value}</Text>
    </HStack>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={1}>
        {label}
      </Text>
      {children}
    </Box>
  );
}

function formatEnumLabel(value: string) {
  return value.replace(/_/g, ' ');
}

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isExporting, setIsExporting] = useState(false);
  const { metrics, currentUser, isLoading, error, reloadDashboard } = useDashboard(filters);

  if (isLoading) {
    return (
      <Flex h="100vh" justify="center" align="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  const isForbidden =
    !currentUser ||
    (typeof error === 'string' && /(forbidden|unauthorized|403|401)/i.test(error));

  if (isForbidden) {
    return (
      <Flex h="100vh" justify="center" align="center" direction="column" gap={3} px={6} textAlign="center">
        <Text fontWeight="bold" fontSize="lg">
          Forbidden
        </Text>
        <Text fontSize="sm">
          You do not have permission to view this dashboard.
        </Text>
        {error && <Text fontSize="sm">{error}</Text>}
      </Flex>
    );
  }

  if (!metrics) {
    return (
      <Flex h="100vh" justify="center" align="center" direction="column" gap={4}>
        <Text fontWeight="bold">Failed to load dashboard metrics.</Text>
        {error && <Text fontSize="sm">{error}</Text>}
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
  const averageProjectDays = metrics.averageProjectAgeDays;

  const updateFilter = <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K] | undefined,
  ) => {
    setFilters((prev) => {
      const next = { ...prev } as DashboardFilters;
      if (value === undefined || value === null || value === '') {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      const response = await dashboardMetrics.exportMetrics(filters, format);
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `dashboard-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } catch (exportError) {
      console.error('Export failed:', exportError);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Flex h="100%" direction="column" gap={6} align="stretch">
      {error && (
        <Box
          p={4}
          borderRadius="md"
        >
          <HStack gap={2}>
            <LuTriangleAlert size={20} />
            <VStack align="flex-start" gap={0}>
              <Text fontWeight="bold">
                Error Loading Dashboard
              </Text>
              <Text fontSize="sm">
                {error}
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}

      <Card.Root>
        <Card.Body p={6}>
          <Flex justify="space-between" align={{ base: 'stretch', md: 'center' }} gap={4} wrap="wrap">
            <Box>
              <Heading size="lg">Dashboard</Heading>
              <Text>Project and task analytics overview</Text>
            </Box>

            <HStack gap={2} wrap="wrap">
              <Button onClick={() => void reloadDashboard()} loading={isLoading}>
                <LuRefreshCw /> Refresh
              </Button>
              <Button onClick={() => void handleExport('csv')} loading={isExporting}>
                <LuDownload /> CSV
              </Button>
            </HStack>
          </Flex>

          <Grid
            mt={6}
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(5, 1fr)' }}
            gap={4}
          >
            <FilterField label="From">
              <Input
                type="date"
                size="sm"
                value={filters.from ?? ''}
                onChange={(e) => updateFilter('from', e.target.value || undefined)}
              />
            </FilterField>

            <FilterField label="To">
              <Input
                type="date"
                size="sm"
                value={filters.to ?? ''}
                onChange={(e) => updateFilter('to', e.target.value || undefined)}
              />
            </FilterField>

            <FilterField label="Member ID">
              <Input
                type="number"
                size="sm"
                value={filters.memberId ?? ''}
                onChange={(e) => updateFilter('memberId', e.target.value ? Number(e.target.value) : undefined)}
              />
            </FilterField>

            <FilterField label="Project status">
              <NativeSelect.Root>
                <NativeSelect.Field
                  w="100%"
                  value={filters.projectStatus ?? ''}
                  onChange={(e) => updateFilter('projectStatus', e.target.value ? (e.target.value as ProjectStatus) : undefined)}
                >
                  <option value="">All project statuses</option>
                  {Object.values(ProjectStatus).map((status) => (
                    <option key={status} value={status}>
                      {formatEnumLabel(status)}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </FilterField>

            <FilterField label="Task status">
              <NativeSelect.Root>
                <NativeSelect.Field
                  w="100%"
                  value={filters.taskStatus ?? ''}
                  onChange={(e) => updateFilter('taskStatus', e.target.value ? (e.target.value as TaskStatus) : undefined)}
                >
                  <option value="">All task statuses</option>
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {formatEnumLabel(status)}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </FilterField>
          </Grid>
        </Card.Body>
      </Card.Root>

      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={6}
        alignItems="stretch"
      >
        <Grid minH="360px" placeItems="center">
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

        <Card.Root minH="360px">
          <Card.Body p={6}>
            <VStack align="stretch" gap={4} h="100%">
              <Heading size="md">Project stats</Heading>
              <VStack align="stretch" gap={2}>
                <StatLine label="Total projects" value={metrics.totalProjects} />
                <StatLine label="Completed" value={metrics.completedProjects} />
                <StatLine label="In progress" value={inProgressProjects} />
                <StatLine label="At risk" value={riskyProjects} />
              </VStack>

              <Box mt="auto" pt={4} borderTop="1px solid">
                <Text fontSize="sm">
                  Average number of days
                </Text>
                <Heading size="lg">
                  {averageProjectDays !== undefined ? `${averageProjectDays.toFixed(1)} days` : '—'}
                </Heading>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

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