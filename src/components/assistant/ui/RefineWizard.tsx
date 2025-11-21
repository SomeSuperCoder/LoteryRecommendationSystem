import { useState } from 'react';
import { chooseFinalLottery } from '@lib';
import { Stack, Box, HStack, Text, Progress, Button, Heading } from '@chakra-ui/react';
import { type RefineWizardProps, type MicroAnswers, MICRO_STEPS, type MicroField } from '@lib';

export const RefineWizard: React.FC<RefineWizardProps> = ({ lotteries, profile, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<MicroAnswers>({
    pricePriority: null,
    riskFeeling: null,
    playRhythm: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = MICRO_STEPS[stepIndex];

  const handleSelect = (field: MicroField, value: MicroAnswers[MicroField]) => {
    if (isSubmitting) return;
    setAnswers((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleNext = () => {
    if (isSubmitting) return;

    if (!answers[currentStep.field]) {
      setError('Выбери один из вариантов, чтобы продолжить.');
      return;
    }

    if (stepIndex === MICRO_STEPS.length - 1) {
      setIsSubmitting(true);
      const final = chooseFinalLottery(lotteries, profile, answers);
      onComplete(final);
      return;
    }

    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (isSubmitting) return;
    setError(null);
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
  };

  const PROGRESS_BY_STEP = [0, 50, 100];

  const progressPercent =
    PROGRESS_BY_STEP[stepIndex] ?? PROGRESS_BY_STEP[PROGRESS_BY_STEP.length - 1];

  return (
    <Stack>
      <Box>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="xs" color="gray.500">
            Дополнительные вопросы {stepIndex + 1} из {MICRO_STEPS.length}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {Math.round(progressPercent)}%
          </Text>
        </HStack>
        <Progress.Root variant="outline" maxW="auto" value={progressPercent} colorPalette="green">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Box>

      <Stack>
        <Heading size="sm">{currentStep.title}</Heading>
        <Stack>
          {currentStep.options.map((opt) => {
            const active = answers[currentStep.field] === opt.value;
            return (
              <Button
                key={String(opt.value)}
                variant={active ? 'solid' : 'outline'}
                colorScheme="purple"
                justifyContent="flex-start"
                w="100%"
                borderRadius="lg"
                size="sm"
                fontWeight="normal"
                whiteSpace="normal"
                textAlign="left"
                py={3}
                px={4}
                onClick={() => handleSelect(currentStep.field, opt.value)}
                disabled={isSubmitting}
              >
                {opt.label}
              </Button>
            );
          })}
        </Stack>
        {error && (
          <Text fontSize="xs" color="red.500">
            {error}
          </Text>
        )}
      </Stack>

      <HStack justify="space-between" pt={2}>
        <Button variant="ghost" size="sm" onClick={handleBack} disabled={isSubmitting}>
          Назад
        </Button>
        <Button colorScheme="purple" size="sm" onClick={handleNext} disabled={isSubmitting}>
          {stepIndex === MICRO_STEPS.length - 1 ? 'Выбрать лучший вариант' : 'Далее'}
        </Button>
      </HStack>
    </Stack>
  );
};
