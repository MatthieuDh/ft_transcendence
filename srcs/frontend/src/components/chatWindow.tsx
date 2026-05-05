import { Box, Flex, Input, Button, Text, VStack } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import type { Message } from '../../../../shared/srcs/types/message';

interface ChatWindowProps {
  messages: Message[];
  sendMessage: (content: string) => Promise<boolean>;
  isSending: boolean;
  currentUserId: number;
}

export default function ChatWindow({ messages, sendMessage, isSending, currentUserId }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const success = await sendMessage(inputValue);
    if (success) {
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Flex direction="column" h="100%">
      
      <Box p={3} bg="purple.500" color="white" borderTopRadius="lg">
        <Text fontWeight="bold">Project Chat</Text>
      </Box>

      <VStack flex={1} p={4} overflowY="auto" gap={3} bg="gray.50" _dark={{ bg: "gray.900" }} alignItems="flex-start">
        {messages.length === 0 ? (
          <Text color="gray.500" fontSize="sm" alignSelf="center" mt={4}>
            no messages yet in this project.
          </Text>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.userId === currentUserId;
            const timestamp = msg.Time || msg.createdAt || Date.now(); 
            const timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <Box 
                key={msg.id || index} 
                bg={isMine ? "purple.100" : "gray.200"} 
                _dark={{ bg: isMine ? "purple.800" : "gray.700", color: "white" }} 
                p={2} 
                borderRadius="md" 
                maxW="80%" 
                alignSelf={isMine ? "flex-end" : "flex-start"}
              >
                {!isMine && (
                  <Text fontSize="xs" fontWeight="bold" color="purple.600" _dark={{ color: "purple.300" }} mb={1}>
                    {msg.user?.username || `User ${msg.userId}`}
                  </Text>
                )}
                <Text fontSize="sm">{msg.content}</Text>
                <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} textAlign="right" mt={1}>
                  {timeString}
                </Text>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </VStack>

      <Flex p={3} bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} borderBottomRadius="lg" borderTop="1px solid" borderColor="gray.200">
        <Input 
          size="sm" 
          placeholder="Typ een bericht..." 
          mr={2} 
          borderRadius="full" 
          focusRingColor="purple.500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSending}
        />
        <Button 
          size="sm" 
          colorPalette="purple" 
          borderRadius="full"
          onClick={handleSend}
          loading={isSending}
        >
          send
        </Button>
      </Flex>
      
    </Flex>
  );
}