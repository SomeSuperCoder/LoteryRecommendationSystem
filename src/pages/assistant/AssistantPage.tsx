import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import { Assistant } from '@/components/assistant/Assistant'; 
import { useColorModeValue } from '@/components/ui/color-mode'; 
import AiratOnBarrel from "@lib/assets/images/AiratOnBarrel.png";

const AssistantPage: React.FC = () => {
  const textColor = useColorModeValue('black', 'white');

  const sidebarGradient = useColorModeValue(
    "linear(to-br, purple.600, blue.600, teal.400)",
    "linear(to-br, gray.800, gray.700, gray.600)" 
  );

  return (
    <Flex
      h="100%" 
      w="100%"     
      bg="transparent"
      p={{ base: 0, lg: 6 }}
      overflow="hidden"
      flex="1"
    >
      <Flex
        w="100%"
        h="100%"
        bg="transparent" 
        borderRadius={{ base: '0', lg: '3xl' }}
        overflow="hidden" 
      >
        <Box
          w={{ base: '0', lg: '20%', xl: '18%' }}
          display={{ base: 'none', lg: 'flex' }}
          bgGradient={sidebarGradient}
          position="relative"
          flexDirection="column"
          color={textColor}
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            opacity={0.1}
            bgImage="url('https://www.transparenttextures.com/patterns/cubes.png')" 
          />

          <Box 
            w="full" 
            p={8} 
            mt={10} 
            zIndex={1}
          >
            <Box 
              w="full" 
              h="200px"
            />
          </Box>

          <Box
            position="absolute"
            // Изменено: Устанавливаем bottom в 0, чтобы убрать отступ, но оставить обрезку 
            // (обрезано будет то, что ниже 0 из-за overflow: hidden родительского блока)
            bottom="0" 
            left="50%"
            transform="translateX(-50%)"
            w="90%"
            maxW="300px"
            zIndex={0}
          >
            <Image 
              src={AiratOnBarrel} 
              w="100%" 
              h="auto" 
              objectFit="contain"
            />
          </Box>
        </Box>

        <Box 
          flex="1" 
          h="100%"
          bg="transparent" 
          position="relative"
          // Откат: Удален добавленный ранее pb, чтобы вернуться к исходному состоянию Assistant
        >
          <Assistant />
        </Box>
      </Flex>
    </Flex>
  );
};

export default AssistantPage;