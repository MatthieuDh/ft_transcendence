import { Outlet } from 'react-router-dom'
import { Flex, Box } from '@chakra-ui/react'
import Sidebar from './sideBar'
import TopBar from './topBar'

export default function Layout() {
  return (
    <Flex minH="100vh" bg="gray.50" _dark={{ bg: "gray.950" }}>
      <Sidebar />
      <Flex direction="column" flex={1} overflow="hidden">
        <TopBar />
        <Box as="main" flex={1} p={8} overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}
