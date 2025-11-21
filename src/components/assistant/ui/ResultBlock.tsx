// src/components/assistant/ui/ResultBlock.tsx
import React from 'react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Stack, Heading, SimpleGrid, Box, HStack, Badge, Text, Button } from '@chakra-ui/react';
import { ResultsBlockProps, explainMatch } from '@/lib';

export const ResultsBlock: React.FC<ResultsBlockProps> = ({
  profile,
  bestLotteries,
  onGoRefine,
}) => {
  if (!profile) return null;

  const cardBg = useColorModeValue('white', 'gray.900');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack>
      <Heading size="sm">По твоим ответам лучше всего подошли эти лотереи:</Heading>

      <SimpleGrid columns={{ base: 1, md: bestLotteries.length === 2 ? 2 : 3 }} gap="10px">
        {bestLotteries.map((lottery) => (
          <Box
            key={lottery.id}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="xl"
            p={4}
            bg={cardBg}
            boxShadow="sm"
          >
            <Stack>
              <Heading size="xs">{lottery.name}</Heading>
              <HStack>
                <Badge colorScheme="blue">{lottery.minPrice} ₽</Badge>
                <Badge
                  colorScheme={
                    lottery.risk === 'low' ? 'green' : lottery.risk === 'medium' ? 'yellow' : 'red'
                  }
                >
                  Риск: {lottery.risk}
                </Badge>
                <Badge variant="outline" fontSize="0.65rem">
                  {lottery.drawType === 'draw' ? 'Тиражная' : 'Моментальная'}
                </Badge>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {lottery.description}
              </Text>
              <Text fontSize="xs">{explainMatch(profile, lottery)}</Text>

              <Box pt={1}>
                <Text fontSize="0.65rem" color="gray.500" mb={1}>
                  Особенности:
                </Text>
                <Stack fontSize="0.7rem">
                  {lottery.features.map((f) => (
                    <Text key={f}>• {f}</Text>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <HStack justify="space-between" pt={1}>
        <Text fontSize="sm" color="gray.500">
          Теперь ещё несколько уточняющих вопросов — и выберем один лучший вариант.
        </Text>
        <Button colorScheme="purple" size="sm" onClick={onGoRefine}>
          Уточнить и выбрать один
        </Button>
      </HStack>
    </Stack>
  );
};
