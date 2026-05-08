import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Flex, Heading, HStack } from '@chakra-ui/react';

export default function PublicNavbar() {
    const navigate = useNavigate();

    return (
        <Box
            as="header"
            position="sticky"
            top={0}
            zIndex={100}
            bg="rgba(10,10,15,0.8)"
            backdropFilter="blur(12px)"
            borderBottom="1px solid"
            borderColor="rgba(255,255,255,0.08)"
        >
            <Container maxW="7xl" py={4}>
                <Flex align="center" justify="space-between" gap={4}>
                    <RouterLink to="/">
                        <HStack gap={3} cursor="pointer">
                            <Box
                                w={3}
                                h={3}
                                borderRadius="full"
                                bg="purple.500"
                                boxShadow="0 0 24px rgba(168, 85, 247, 0.95)"
                            />
                            <Heading size="md" letterSpacing="-0.04em" color="white">
                                Sigma
                            </Heading>
                        </HStack>
                    </RouterLink>

                    <HStack gap={3}>
                        <Button
                            variant="ghost"
                            color="gray.300"
                            _hover={{ bg: 'whiteAlpha.100' }}
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </Button>
                        <Button
                            colorPalette="purple"
                            bg="purple.500"
                            _hover={{ bg: 'purple.400' }}
                            boxShadow="0 0 30px rgba(168, 85, 247, 0.25)"
                            onClick={() => navigate('/register')}
                        >
                            Get Started
                        </Button>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}
