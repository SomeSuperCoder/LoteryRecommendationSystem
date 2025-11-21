import { useColorModeValue } from '@/components/ui/color-mode';
import { Stack, Heading, Box, HStack, Badge, Text, Button } from '@chakra-ui/react';
import { explainMatch, handleRestart, FinalBlockProps } from '@lib';

export const FinalBlock: React.FC<FinalBlockProps> = ({
  profile,
  finalLottery,
  setProfile,
  setBestLottery,
  setFinalLottery,
  setHasStartedQuestionnaire,
  setIsLoadingResults,
  setHasResults,
  setHasRefine,
  setHasFinal,
  setIsLoadingFinal,
}) => {
  if (!finalLottery || !profile) return null;

  const cardBg = useColorModeValue('white', 'gray.900');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack>
      <Heading size="sm">С учётом всех ответов тебе больше всего подходит:</Heading>

      <Box
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="2xl"
        p={5}
        bg={cardBg}
        boxShadow="lg"
      >
        <Heading size="md" mb={2}>
          {finalLottery.name}
        </Heading>
        <HStack mb={3}>
          <Badge colorScheme="blue">{finalLottery.minPrice} ₽</Badge>
          <Badge
            colorScheme={
              finalLottery.risk === 'low'
                ? 'green'
                : finalLottery.risk === 'medium'
                ? 'yellow'
                : 'red'
            }
          >
            Риск: {finalLottery.risk}
          </Badge>
          <Badge variant="outline">
            {finalLottery.drawType === 'draw' ? 'Тиражная' : 'Моментальная'}
          </Badge>
          <Badge variant="outline">{finalLottery.format === 'online' ? 'Онлайн' : 'Оффлайн'}</Badge>
        </HStack>

        <Text mb={3}>{finalLottery.description}</Text>

        <Text fontSize="sm" fontWeight="semibold" mb={1}>
          Почему это подходит именно тебе:
        </Text>
        <Text fontSize="sm" mb={3}>
          {explainMatch(profile, finalLottery)}
        </Text>

        <Text fontSize="sm" color="gray.500" mb={2}>
          Особенности:
        </Text>
        <Stack fontSize="sm">
          {finalLottery.features.map((f) => (
            <Text key={f}>• {f}</Text>
          ))}
        </Stack>
      </Box>

      <Button
        variant="outline"
        size="sm"
        alignSelf="flex-start"
        onClick={() =>
          handleRestart(
            setProfile,
            setBestLottery,
            setFinalLottery,
            setHasStartedQuestionnaire,
            setIsLoadingResults,
            setHasResults,
            setHasRefine,
            setHasFinal,
            setIsLoadingFinal
          )
        }
      >
        Начать подбор заново
      </Button>
    </Stack>
  );
};
