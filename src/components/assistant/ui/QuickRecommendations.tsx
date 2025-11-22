// QuickRecommendations.tsx
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
  const cardBg = useColorModeValue('#FFFFFF', '#000000');
  const cardBorder = useColorModeValue('#808080', '#000000');
  const cardShadow = useColorModeValue('sm', '0px 0px 10px rgba(255, 255, 255, 0.2)'); // White shadow for dark theme
  
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

  const textColor = useColorModeValue('#000000', '#FFFFFF');
  const spinnerColor = '#FFA500';
  const badgePriceBg = '#FFA500';
  const badgePriceColor = '#000000';
  const badgeRiskColor = '#000000';
  const badgeTypeBorder = '#671600';
  const badgeTypeColor = useColorModeValue('#000000', '#FFFFFF');
  const buttonBg = '#671600';
  const buttonColor = '#FFFFFF';

  if (isLoading) {
    return (
      <Stack>
        <Heading size="sm">Смотрю, с чего лучше начать…</Heading>
        <Box py={2}>
          <Center flexDirection="column">
            <Spinner size="md" color={spinnerColor} mb={3} />
            <Text fontSize="sm" color={textColor} textAlign="center">
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
            boxShadow={cardShadow} // Applied here
          >
            <Stack>
              <Heading size="xs">{lottery.name}</Heading>
              <Text fontSize="xs" color={textColor}>
                {lottery.description}
              </Text>
              <HStack mt={1} wrap="wrap">
                <Badge bg={badgePriceBg} color={badgePriceColor}>{lottery.minPrice} ₽</Badge>
                <Badge
                  bg={
                    lottery.risk === 'low' ? '#FFF42A' : lottery.risk === 'medium' ? '#FFA500' : '#FF4D4D'
                  }
                  color={badgeRiskColor}
                >
                  Риск: {lottery.risk}
                </Badge>
                <Badge variant="outline" fontSize="0.65rem" borderColor={badgeTypeBorder} color={badgeTypeColor}>
                  {lottery.drawType === 'draw' ? 'Тиражная' : 'Моментальная'}
                </Badge>
              </HStack>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <HStack justify="space-between" pt={2}>
        <Text fontSize="sm" color={textColor}>
          Если эти варианты не заходят — давай настроим подбор под тебя.
        </Text>
        <Button bg={buttonBg} color={buttonColor} size="sm" onClick={handleStartQuestionnaire}>
          Настроить под себя
        </Button>
      </HStack>
    </Stack>
  );
};