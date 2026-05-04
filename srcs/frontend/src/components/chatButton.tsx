import { Box, IconButton, Flex, useDisclosure } from '@chakra-ui/react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import ChatWindow from './chatWindow';
interface ChatButtonProps {
  projectId: number;     
  currentUserId: number;
}

export default function ChatButton({ projectId, currentUserId }: ChatButtonProps) {
  const unreadmessages = 2;
  const { open, onToggle } = useDisclosure();

  return (
    <Box position="fixed" bottom="30px" right="30px" zIndex={1000}>
      {unreadmessages > 0 && (
        <Flex
          position="absolute"
          top="-4px"
          right="-4px"
          bg="red.500"
          color="white"
          w="24px"
          h="24px"
          borderRadius="full"
          justify="center"
          align="center"
          fontSize="xs"
          fontWeight="bold"
          zIndex={1001}
          boxShadow="md"
        >
          {unreadmessages}
        </Flex>
      )}

      <IconButton
        aria-label="Open chat"
        size="lg"
        w="64px"
        h="64px"
        colorPalette="purple"
        borderRadius="full"
        boxShadow="xl"
        onClick={onToggle}
      >
          <IoChatbubbleEllipses size={24} />      </IconButton>

      {open && (
        <Box
          position="absolute"
          bottom="80px"
          right="0"
          w="320px"
          h="450px"
          bg="white"
          _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
          boxShadow="2xl"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <ChatWindow projectId={projectId} currentUserId={currentUserId} />
        </Box>
      )}
    </Box>
  );
}