import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Badge, Button, Container, Flex, Heading, HStack, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/react';
import { LuLayoutDashboard, LuUsers, LuMessageSquare, LuZap, LuShield } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import Footer from '../components/Footer';
import PublicNavbar from '../components/PublicNavbar';
import { DarkMode } from '../components/ui/color-mode';

const features: Array<{
    title: string;
    description: string;
    icon: IconType;
}> = [
        {
            title: 'Kanban Boards',
            description: 'Drag tasks across columns. Visualize your entire workflow at a glance.',
            icon: LuLayoutDashboard,
        },
        {
            title: 'Real-time Collaboration',
            description: 'Work together with your team instantly. Changes sync across all members live.',
            icon: LuUsers,
        },
        {
            title: 'Built-in Chat',
            description: 'Communicate in context. Every project has its own chat so nothing gets lost.',
            icon: LuMessageSquare,
        },
        {
            title: 'Role Management',
            description: 'Control who can do what. Assign project leaders and manage team access with ease.',
            icon: LuShield,
        },
        {
            title: 'Task Tracking',
            description: 'Deadlines, assignees, comments and status in one place. Never lose track of progress.',
            icon: LuZap,
        },
        {
            title: 'Secure by default',
            description: 'HTTPS everywhere, hashed credentials, JWT authentication. Your data stays yours.',
            icon: LuShield,
        },
    ];

function FeatureCard({ title, description, icon: Icon }: { title: string; description: string; icon: IconType }) {
    return (
        <Box
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="2xl"
            p={6}
            h="full"
            transition="all 0.25s ease"
            _hover={{
                borderColor: 'purple.500',
                transform: 'translateY(-4px)',
                boxShadow: '0 0 0 1px rgba(168, 85, 247, 0.35), 0 20px 60px rgba(0, 0, 0, 0.35)',
            }}
        >
            <VStack align="start" gap={4}>
                <Box
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    w={12}
                    h={12}
                    borderRadius="xl"
                    bg="purple.500/12"
                    color="purple.300"
                    border="1px solid"
                    borderColor="purple.500/20"
                >
                    <Icon size={24} />
                </Box>

                <Stack gap={2} align="start">
                    <Heading size="md" color="white">
                        {title}
                    </Heading>
                    <Text color="gray.400" lineHeight="1.7">
                        {description}
                    </Text>
                </Stack>
            </VStack>
        </Box>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <DarkMode>
            <Box minH="100vh" position="relative" overflow="hidden" bg="#0a0a0f" color="white" pb="110px">
                <Box
                    position="absolute"
                    inset={0}
                    bgGradient="radial(circle at top, rgba(168, 85, 247, 0.14), transparent 38%), radial(circle at 80% 20%, rgba(126, 34, 206, 0.08), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 30%)"
                    pointerEvents="none"
                />

                <motion.div
                    style={{
                        position: 'absolute',
                        top: '12%',
                        left: '50%',
                        width: 'min(640px, 80vw)',
                        height: 'min(640px, 80vw)',
                        borderRadius: '9999px',
                        background: 'rgba(168, 85, 247, 0.55)',
                        opacity: 0.22,
                        filter: 'blur(120px)',
                        pointerEvents: 'none',
                        transform: 'translateX(-50%)',
                    }}
                    initial={{ y: -20 }}
                    animate={{ y: [20, -20, 20] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />

                <Box position="relative" zIndex={1}>
                    <PublicNavbar />

                    <Container maxW="7xl">
                        <Flex minH="calc(100vh - 96px)" align="center" justify="center" py={{ base: 20, md: 28 }}>
                            <VStack textAlign="center" gap={8} maxW="5xl" position="relative">
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                                    <Badge
                                        px={4}
                                        py={2}
                                        borderRadius="full"
                                        border="1px solid"
                                        borderColor="purple.500/30"
                                        bg="purple.500/10"
                                        color="purple.200"
                                        boxShadow="0 0 24px rgba(168, 85, 247, 0.15)"
                                    >
                                        ✦ Built for focused teams
                                    </Badge>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                    <Heading
                                        size="6xl"
                                        lineHeight="1.02"
                                        letterSpacing="-0.06em"
                                        maxW="4xl"
                                        mx="auto"
                                        color="white"
                                        textWrap="balance"
                                        fontWeight="semibold"
                                        fontSize={{ base: '4xl', md: '5xl', xl: '6xl' }}
                                    >
                                        The workspace where
                                        <br />
                                        <span
                                            style={{
                                                background: 'linear-gradient(135deg, #9b59b6 0%, #6c3483 50%, #a855f7 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                display: 'inline',
                                            }}
                                        >
                                            great work
                                        </span>{' '}
                                        happens
                                    </Heading>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}>
                                    <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.400" lineHeight="1.9" maxW="2xl" mx="auto">
                                        The real treasure is the friends we make along the way.
                                    </Text>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                                    <HStack gap={4} flexWrap="wrap" justify="center">
                                        <Button
                                            size="lg"
                                            px={8}
                                            py={7}
                                            borderRadius="xl"
                                            colorPalette="purple"
                                            bg="purple.500"
                                            _hover={{ bg: 'purple.400', transform: 'translateY(-1px)' }}
                                            boxShadow="0 0 40px rgba(168, 85, 247, 0.30)"
                                            onClick={() => navigate('/register')}
                                        >
                                            Start for free
                                        </Button>
                                        <Button
                                            size="lg"
                                            px={8}
                                            py={7}
                                            borderRadius="xl"
                                            variant="outline"
                                            borderColor="whiteAlpha.300"
                                            color="white"
                                            bg="whiteAlpha.50"
                                            _hover={{ bg: 'whiteAlpha.100', borderColor: 'purple.300' }}
                                            onClick={() => navigate('/login')}
                                        >
                                            Sign in
                                        </Button>
                                    </HStack>
                                </motion.div>

                                <Text fontSize="sm" color="gray.600">
                                    No credit card required
                                </Text>
                            </VStack>
                        </Flex>

                        <Box as="section" py={{ base: 20, md: 28 }}>
                            <VStack gap={4} textAlign="center" maxW="3xl" mx="auto" mb={12}>
                                <Heading size="xl" letterSpacing="-0.04em" color="white">
                                    Everything your team needs
                                </Heading>
                                <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.400">
                                    Built around the way modern teams actually work
                                </Text>
                            </VStack>

                            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.25 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <FeatureCard {...feature} />
                                    </motion.div>
                                ))}
                            </SimpleGrid>
                        </Box>

                        <Box as="section" py={{ base: 20, md: 24 }}>
                            <Box p="1px" borderRadius="3xl" bgGradient="linear(to-r, purple.500, fuchsia.500, purple.500)">
                                <Box
                                    borderRadius="3xl"
                                    bg="rgba(9, 9, 14, 0.96)"
                                    border="1px solid"
                                    borderColor="whiteAlpha.100"
                                    px={{ base: 8, md: 14 }}
                                    py={{ base: 10, md: 14 }}
                                    textAlign="center"
                                >
                                    <Stack gap={4} align="center">
                                        <Heading size="xl" letterSpacing="-0.04em" color="white">
                                            Ready to get things done?
                                        </Heading>
                                        <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }}>
                                            Join your team on Sigma today.
                                        </Text>
                                        <Button
                                            size="lg"
                                            mt={2}
                                            px={8}
                                            py={7}
                                            borderRadius="xl"
                                            colorPalette="purple"
                                            bg="purple.500"
                                            _hover={{ bg: 'purple.400' }}
                                            boxShadow="0 0 40px rgba(168, 85, 247, 0.25)"
                                            onClick={() => navigate('/register')}
                                        >
                                            Get Started
                                        </Button>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    </Container>

                    <Footer />
                </Box>
            </Box>
        </DarkMode>
    );
}
