import { useState } from 'react';
import { Box, Text, Textarea, Button, VStack, HStack, Avatar, Spinner, Input } from '@chakra-ui/react';
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger } from './ui/dialog';
import { useComments } from '../hooks/useComments';
import { useEditTask } from '../hooks/useEditTask';
import type { Task } from '../../../../shared/srcs/types';
import { LuPaperclip, LuCalendar, LuPencil, LuX, LuMessageSquareReply } from 'react-icons/lu';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: number;
  canEdit: boolean;
  onTaskUpdate: () => void;
}

export default function TaskDetailsModal({ isOpen, onClose, task, projectId, canEdit, onTaskUpdate }: TaskDetailsModalProps) {
  const [newComment, setNewComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [replyingTo, setReplyingTo] = useState<{id: number, username: string} | null>(null);

  const { comments, isLoading, isSubmitting, postComment } = useComments(task?.id, projectId, isOpen);
  
  const {
    isEditingTitle, setIsEditingTitle, editTitle, setEditTitle,
    isEditingDesc, setIsEditingDesc, editDesc, setEditDesc,
    isEditingDeadline, setIsEditingDeadline, editDeadline, setEditDeadline,
    handleUpdate, cancelEdit
  } = useEditTask(task, onTaskUpdate);

  const handleCommentSubmit = async () => {
    const success = await postComment(newComment, selectedFile, replyingTo?.id);
    if (success) {
      setNewComment('');
      setSelectedFile(null);
      setReplyingTo(null);
    }
  };

  const extractFileName = (url: string) => {
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    const nameParts = fullName.split('-');
    if (nameParts.length > 2) {
      return nameParts.slice(2).join('-');
    }
    return fullName;
  };

  if (!task) return null;

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center" size="lg">
      <DialogContent _dark={{ bg: "gray.800" }}>
        <DialogHeader>
          {isEditingTitle && canEdit ? (
            <HStack w="full" mr={8}>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} size="sm" bg="white" _dark={{bg: "gray.700"}} />
              <Button size="xs" colorPalette="green" onClick={() => handleUpdate('title')}>Save</Button>
              <Button size="xs" variant="ghost" onClick={() => cancelEdit('title')}>Cancel</Button>
            </HStack>
          ) : (
            <DialogTitle 
              cursor={canEdit ? "pointer" : "default"} 
              onClick={() => canEdit && setIsEditingTitle(true)}
              _hover={canEdit ? { color: "purple.500" } : {}}
              display="flex"
              alignItems="center"
              gap={2}
            >
              {task.title} {canEdit && <LuPencil size={16} style={{opacity: 0.5}} />}
            </DialogTitle>
          )}
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody pb={6}>
          <VStack align="stretch" gap={6}>
            
            <Box bg="gray.50" _dark={{ bg: "gray.900" }} p={4} borderRadius="md" borderLeft="4px solid" borderColor="purple.500">
              
              {isEditingDeadline && canEdit ? (
                <HStack mb={2}>
                  <Input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} size="sm" w="auto" bg="white" _dark={{bg: "gray.700"}} />
                  <Button size="xs" colorPalette="green" onClick={() => handleUpdate('deadline')}>Save</Button>
                  <Button size="xs" variant="ghost" onClick={() => cancelEdit('deadline')}>Cancel</Button>
                </HStack>
              ) : (
                <HStack 
                  color={task.deadline ? "red.500" : "gray.400"} 
                  _dark={{ color: task.deadline ? "red.400" : "gray.500" }} 
                  mb={task.description || isEditingDesc ? 2 : 0}
                  cursor={canEdit ? "pointer" : "default"} 
                  onClick={() => canEdit && setIsEditingDeadline(true)}
                  _hover={canEdit ? { opacity: 0.8 } : {}}
                >
                  <LuCalendar size={16} />
                  <Text fontSize="sm" fontWeight="bold">
                    {task.deadline ? `Deadline: ${new Date(task.deadline).toLocaleDateString()}` : (canEdit ? 'Set deadline...' : 'No deadline')}
                  </Text>
                  {canEdit && <LuPencil size={14} style={{opacity: 0.5}} />}
                </HStack>
              )}

              {isEditingDesc && canEdit ? (
                <VStack align="start" mt={2} gap={2}>
                  <Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} size="sm" bg="white" _dark={{bg: "gray.700"}} rows={4} />
                  <HStack>
                    <Button size="xs" colorPalette="green" onClick={() => handleUpdate('description')}>Save</Button>
                    <Button size="xs" variant="ghost" onClick={() => cancelEdit('description')}>Cancel</Button>
                  </HStack>
                </VStack>
              ) : (
                <Text 
                  fontSize="sm" 
                  cursor={canEdit ? "pointer" : "default"} 
                  onClick={() => canEdit && setIsEditingDesc(true)}
                  _hover={canEdit ? { bg: "gray.100", _dark: { bg: "gray.800" }, borderRadius: "md" } : {}}
                  p={canEdit ? 1 : 0}
                  mt={canEdit ? -1 : 0}
                  color={task.description ? "inherit" : "gray.400"}
                >
                  {task.description || (canEdit ? 'Click to add a description...' : '')}
                </Text>
              )}

            </Box>

            <VStack align="stretch" gap={4} maxH="350px" overflowY="auto" p={1}>
              <Text fontWeight="bold" fontSize="sm" color="gray.500">Comments</Text>
              {isLoading ? (
                <Spinner size="sm" alignSelf="center" />
              ) : comments.length === 0 ? (
                <Text fontSize="sm" color="gray.500" fontStyle="italic">No comments yet.</Text>
              ) : (
                comments.map(comment => (
                  <HStack key={comment.id} align="start" gap={3}>
                    <Avatar.Root 
                      size="sm" 
                      bg="purple.500" 
                      color="white" 
                      borderRadius="full" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center" 
                      fontWeight="bold"
                    >
                      <Avatar.Image src={comment.user?.avatar || undefined} borderRadius="full" />
                      <Avatar.Fallback bg="transparent">
                        {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    
                    <Box bg="gray.100" _dark={{ bg: "gray.700" }} p={3} borderRadius="lg" flex={1}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" fontWeight="bold">{comment.user?.username}</Text>
                        <HStack gap={3}>
                          <Text fontSize="xs" color="gray.500">{new Date(comment.createdAt).toLocaleString()}</Text>
                          <Button size="xs" variant="ghost" colorPalette="purple" h="auto" p={0} onClick={() => setReplyingTo({id: comment.id, username: comment.user?.username || 'User'})}>
                            <LuMessageSquareReply /> Reply
                          </Button>
                        </HStack>
                      </HStack>
                      <Text fontSize="sm" whiteSpace="pre-wrap">{comment.content}</Text>
                      {comment.attachments && comment.attachments.length > 0 && (
                        <VStack align="start" mt={2} gap={1}>
                          {comment.attachments.map((url, i) => (
                            <Button key={i} asChild size="xs" variant="outline" colorPalette="purple">
                              <a href={url} download={extractFileName(url)} target="_blank" rel="noopener noreferrer">
                                <LuPaperclip /> {extractFileName(url)}
                              </a>
                            </Button>
                          ))}
                        </VStack>
                      )}

                      {comment.replies && comment.replies.length > 0 && (
                        <VStack align="start" mt={3} gap={2} pl={3} borderLeft="2px solid" borderColor="gray.300" _dark={{ borderColor: "gray.600" }}>
                          {comment.replies.map(reply => (
                            <HStack key={reply.id} align="start" gap={2} w="full">
                              <Avatar.Root size="xs" bg="gray.400" color="white" borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold">
                                <Avatar.Image src={reply.user?.avatar || undefined} borderRadius="full" />
                                <Avatar.Fallback bg="transparent">{reply.user?.username?.charAt(0).toUpperCase() || '?'}</Avatar.Fallback>
                              </Avatar.Root>
                              <Box bg="white" _dark={{ bg: "gray.800" }} p={2} borderRadius="md" flex={1}>
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="xs" fontWeight="bold">{reply.user?.username}</Text>
                                  <Text fontSize="xs" color="gray.500">{new Date(reply.createdAt).toLocaleString()}</Text>
                                </HStack>
                                <Text fontSize="sm" whiteSpace="pre-wrap">{reply.content}</Text>
                                {reply.attachments && reply.attachments.length > 0 && (
                                  <VStack align="start" mt={2} gap={1}>
                                    {reply.attachments.map((url, i) => (
                                      <Button key={i} asChild size="xs" variant="outline" colorPalette="purple">
                                        <a href={url} download={extractFileName(url)} target="_blank" rel="noopener noreferrer">
                                          <LuPaperclip /> {extractFileName(url)}
                                        </a>
                                      </Button>
                                    ))}
                                  </VStack>
                                )}
                              </Box>
                            </HStack>
                          ))}
                        </VStack>
                      )}
                    </Box>
                  </HStack>
                ))
              )}
            </VStack>

            <VStack align="stretch" gap={2}>
              {replyingTo && (
                <HStack justify="space-between" bg="purple.50" _dark={{ bg: "purple.900" }} p={2} borderRadius="md">
                  <Text fontSize="xs" color="purple.700" _dark={{ color: "purple.200" }} fontWeight="bold">
                    Replying to {replyingTo.username}...
                  </Text>
                  <Button size="xs" variant="ghost" colorPalette="purple" h="auto" p={0} onClick={() => setReplyingTo(null)}>
                    <LuX size={16} />
                  </Button>
                </HStack>
              )}
              <Textarea 
                placeholder={replyingTo ? "Write your reply..." : "Write a comment..."}
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                rows={3} 
                _dark={{ borderColor: "gray.600" }}
              />
              <HStack justify="space-between">
                <input 
                  type="file" 
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                  style={{ fontSize: '12px' }}
                />
                <Button size="sm" colorPalette="purple" onClick={handleCommentSubmit} loading={isSubmitting} disabled={!newComment.trim()}>
                  {replyingTo ? "Post Reply" : "Post Comment"}
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}