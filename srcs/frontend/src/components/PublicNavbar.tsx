import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Flex, HStack } from '@chakra-ui/react';
import Logo from './logo';

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
                        <Box cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
                            {/* Hier roepen we jullie ECHTE logo aan, met witte tekst voor de dark mode header! */}
                            <Logo height="28px" iconColor="#a855f7" textColor="white" />
                        </Box>
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