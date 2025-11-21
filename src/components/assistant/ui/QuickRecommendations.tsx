// src/components/assistant/ui/QuickRecommendations.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { getInitialLotteries } from '@/lib';
import {
  Stack,
  Heading,
  SimpleGrid,
  Text,
  Box,
  HStack,
  Badge,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';

interface QuickRecommendationsProps {
  hasStartedQuestionnaire: boolean;
  setHasStartedQuestionnaire: (hasStartedQuestionnaire: boolean) => void;
}

export const QuickRecommendations: React.FC<QuickRecommendationsProps> = ({
  hasStartedQuestionnaire,
  setHasStartedQuestionnaire,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const initialLotteries = useMemo(() => getInitialLotteries(), []);
  const cardBg = useColorModeValue('white', 'gray.900');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // симулируем загрузку данных от ассистента
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const handleStartQuestionnaire = () => {
    if (!hasStartedQuestionnaire) {
      setHasStartedQuestionnaire(true);
    }
  };

  if (isLoading) {
    return (
      <Stack>
        <Heading size="sm">Смотрю, с чего лучше начать…</Heading>
        <Box py={2}>
          <Center flexDirection="column">
            <Spinner size="md" color="blue.400" mb={3} />
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Собираю несколько стартовых вариантов лотерей.
            </Text>
          </Center>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack>
      <Heading size="sm">Я нашёл несколько вариантов, с которых можно начать 👇</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="10px">
        {initialLotteries.map((lottery) => (
          <Box
            key={lottery.id}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="xl"
            p={3}
            bg={cardBg}
            boxShadow="sm"
          >
            <Stack>
              <Heading size="xs">{lottery.name}</Heading>
              <Text fontSize="xs" color="gray.500">
                {lottery.description}
              </Text>
              <HStack mt={1} wrap="wrap">
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
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <HStack justify="space-between" pt={2}>
        <Text fontSize="sm" color="gray.500">
          Если эти варианты не заходят — давай настроим подбор под тебя.
        </Text>
        <Button colorScheme="blue" size="sm" onClick={handleStartQuestionnaire}>
          Настроить под себя
        </Button>
      </HStack>
    </Stack>
  );
};
