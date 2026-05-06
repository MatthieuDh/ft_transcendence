import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/react';

export default function Footer() {
    return (
        <Box
            as="footer"
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            zIndex={20}
            borderTop="1px solid"
            borderColor="gray.200"
            bg="white/90"
            backdropFilter="blur(12px)"
            _dark={{ bg: 'gray.950/90', borderColor: 'gray.700' }}
        >
            <Container maxW="7xl" py={4}>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align={{ base: 'start', md: 'center' }}
                    justify="space-between"
                    gap={3}
                >
                    <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
                        © {new Date().getFullYear()} Sigma. Built for focused task management.
                    </Text>

                    <HStack gap={5} fontSize="sm" fontWeight="medium">
                        <Link
                            asChild
                            color="gray.600"
                            _dark={{ color: 'gray.300' }}
                            _hover={{ color: 'purple.500', textDecoration: 'none' }}
                        >
                            <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
                        </Link>

                        <Link
                            asChild
                            color="gray.600"
                            _dark={{ color: 'gray.300' }}
                            _hover={{ color: 'purple.500', textDecoration: 'none' }}
                        >
                            <RouterLink to="/terms-of-service">Terms of Service</RouterLink>
                        </Link>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
}
