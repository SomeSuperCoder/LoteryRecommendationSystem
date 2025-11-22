// ChatBubble.tsx
import type { ChatBubbleProps } from '@lib';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useBreakpointValue, Box } from '@chakra-ui/react';

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, children }) => {
  const isAssistant = role === 'assistant';
  const isUser = role === 'user';

  const bubbleBg = useColorModeValue(
    isAssistant ? '#FFFFFF' : isUser ? '#FFA500' : '#FFFFFF',
    isAssistant ? '#000000' : isUser ? '#FFA500' : '#000000'
  );
  const bubbleBorder = useColorModeValue(
    isAssistant ? '#808080' : isUser ? '#FFA500' : '#808080',
    isAssistant ? '#000000' : isUser ? '#FFA500' : '#000000'
  );
  const textColor = useColorModeValue(isUser ? '#000000' : '#000000', '#FFFFFF');

  // New: Shadow for assistant bubble in dark mode
  const bubbleShadow = useColorModeValue(
    isAssistant ? 'md' : 'none',
    isAssistant ? '0px 0px 10px rgba(255, 255, 255, 0.2)' : 'none'
  );

  const maxWidth = useBreakpointValue({ base: '100%', md: '80%' });

  const justifyContent = isUser ? 'flex-end' : isAssistant ? 'flex-start' : 'center';

  return (
    <Box display="flex" justifyContent={justifyContent}>
      <Box
        maxW={maxWidth}
        bg={bubbleBg}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={bubbleBorder}
        boxShadow={bubbleShadow} // Applied here
        p={{ base: 4, md: 5 }}
        color={textColor}
      >
        {children}
      </Box>
    </Box>
  );
};