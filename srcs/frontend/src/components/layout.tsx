import { Outlet } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import { useState } from 'react';
import Sidebar from './sideBar';
import TopBar from './topBar';

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Flex minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Sidebar />
      <Flex direction="column" flex={1}>
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <Box
          as="main"
          flex={1}
          p={8}
          pb="88px"
          overflowY="auto"
          bg="gray.50"
          _dark={{ bg: 'rgba(10,10,15,0.85)' }}
        >
          <Outlet context={{ searchQuery }} />
        </Box>
      </Flex>
    </Flex>
  );
}
