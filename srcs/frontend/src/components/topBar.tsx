import { Flex, HStack, Box, Heading } from "@chakra-ui/react";
import { ColorModeButton } from "./ui/color-mode";
import { useLocation } from "react-router-dom";

export default function TopBar() {
  const location = useLocation();

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '') return 'Dashboard';
    const parts = path.split('/').filter(Boolean);
    const mainPath = parts[0];
    return mainPath.charAt(0).toUpperCase() + mainPath.slice(1);
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <Flex
      as="header"
      w="full"
      h="72px"
      align="center"
      justify="space-between"
      px={8}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
    >
      
      <Heading 
        size="lg" 
        fontWeight="bold" 
        color="gray.800" 
        _dark={{ color: "white" }}
      >
        {pageTitle}
      </Heading>

      <HStack gap={6}>
        
        <Box cursor="pointer" fontSize="xl" _hover={{ opacity: 0.7 }}>
          🔔
        </Box>

        <ColorModeButton />

        <Box
          w="40px"
          h="40px"
          bg="purple.500"
          color="white"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          cursor="pointer"
          _hover={{ bg: "purple.600" }}
        >
          S
        </Box>
        
      </HStack>
    </Flex>
  );
}