// src/components/assistant/Assistant.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Text, Stack, HStack, Badge, Spinner, Center } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import {
  type Profile,
  type Lottery,
  type StolotoGame,
  stolotoApi,
  mapStolotoGamesToLotteries,
  recommendationApi,
  type UniversalProps,
  type UniversalPropsWithK,
  type BestOfHandlerRequest,
  type BestOfHandlerResponse,
} from '@/lib';

import { ChatBubble } from '@/components/assistant/ui/ChatBubble';
import { ProfileWizard } from '@/components/assistant/ui/ProfileWizard';
import { QuickRecommendations } from '@/components/assistant/ui/QuickRecommendations';
import { ResultsBlock } from '@/components/assistant/ui/ResultBlock';
import { RefineWizard, type RefineWeights } from '@/components/assistant/ui/RefineWizard';
import { FinalBlock } from '@/components/assistant/ui/FinalBlock';

type StolotoDrawsResponse = {
  games: StolotoGame[];
  walletActive: boolean;
  paymentsActive: boolean;
  guestShufflerTicketsEnabled: boolean;
  requestStatus: string;
  errors: unknown[];
};

export const Assistant: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Полный список лотерей, с которыми работаем после первой анкеты
  const [lotteries, setLotteries] = useState<Lottery[]>([]);

  // Список лучших лотерей из /best_of ПОСЛЕ ПЕРВОЙ АНКЕТЫ (ограниченный массив длиной 4)
  const [bestLotteries, setBestLotteries] = useState<Lottery[]>([]);

  // Финальная лотерея после второй анкеты — ровно одна
  const [finalLottery, setFinalLottery] = useState<Lottery | null>(null);

  const [hasStartedQuestionnaire, setHasStartedQuestionnaire] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const [hasRefine, setHasRefine] = useState(false);
  const [isRefineIntroLoading, setIsRefineIntroLoading] = useState(false);

  const [hasFinal, setHasFinal] = useState(false);
  const [isLoadingFinal, setIsLoadingFinal] = useState(false);

  // Быстрые рекомендации по Stoloto
  const [stolotoGames, setStolotoGames] = useState<StolotoGame[]>([]);
  const [isStolotoLoading, setIsStolotoLoading] = useState(false);
  const [stolotoError, setStolotoError] = useState<string | null>(null);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // === Визуальные токены для контейнера ассистента ===
  const chatSurfaceBg = useColorModeValue('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.5)');
  const borderColor = useColorModeValue('gray.400', 'black');
  const textColor = useColorModeValue('#000000', '#FFFFFF');
  const badgeBg = '#FFF42A';
  const badgeColor = '#000000';
  const spinnerColorResults = '#FFA500';
  const spinnerColorRefine = '#671600';
  const spinnerColorFinal = '#671600';
  const containerShadow = useColorModeValue('none', '0px 0px 10px rgba(255, 255, 255, 0.2)');

  // === Загрузка игр Stoloto для быстрых рекомендаций (QuickRecommendations) ===
  const fetchDraws = useCallback(async (): Promise<void> => {
    setIsStolotoLoading(true);
    setStolotoError(null);

    try {
      const response = await stolotoApi.getDraws<StolotoDrawsResponse>();

      if (response.requestStatus !== 'success') {
        setStolotoError('Не удалось получить данные Stoloto');
        setStolotoGames([]);
        return;
      }

      setStolotoGames(response.games ?? []);
    } catch {
      setStolotoError('Ошибка при запросе Stoloto');
      setStolotoGames([]);
    } finally {
      setIsStolotoLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDraws();
  }, [fetchDraws]);

  // Stoloto → Lottery
  const stolotoLotteries: Lottery[] = useMemo(() => {
    if (!stolotoGames || stolotoGames.length === 0) return [];
    return mapStolotoGamesToLotteries(stolotoGames);
  }, [stolotoGames]);

  // Быстрые рекомендации (6 штук)
  const quickLotteries: Lottery[] = useMemo(() => {
    if (stolotoLotteries.length === 0) return [];
    return stolotoLotteries.slice(0, 6);
  }, [stolotoLotteries]);

  // Автоскролл
  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [
    hasStartedQuestionnaire,
    isLoadingResults,
    hasResults,
    hasRefine,
    hasFinal,
    isLoadingFinal,
    isRefineIntroLoading,
    profile,
    bestLotteries.length,
    stolotoLotteries.length,
  ]);

  const isInitial =
    !hasStartedQuestionnaire &&
    !isLoadingResults &&
    !hasResults &&
    !hasRefine &&
    !hasFinal &&
    !isRefineIntroLoading;

  // ========= МАППИНГ В ЧИСЛА ДЛЯ /best_of =========

  const mapRiskToBaseWinRate = (risk: Lottery['risk']): number => {
    if (risk === 'low') return 75;
    if (risk === 'medium') return 45;
    return 20;
  };

  const mapRiskToBaseWinSize = (risk: Lottery['risk']): number => {
    if (risk === 'low') return 150_000;
    if (risk === 'medium') return 800_000;
    return 3_000_000;
  };

  const normalizePrice = (price: number, minPrice: number, maxPrice: number): number => {
    if (!Number.isFinite(price)) {
      return 0.5;
    }
    if (maxPrice <= minPrice) {
      return 0.5;
    }
    return (price - minPrice) / (maxPrice - minPrice); // 0..1
  };

  const getDeterministicHash01 = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return (hash % 1000) / 1000; // 0.000 .. 0.999
  };

  const mapLotteryToUniversalProps = (
    lottery: Lottery,
    minPrice: number,
    maxPrice: number
  ): UniversalProps => {
    const baseWinRate = mapRiskToBaseWinRate(lottery.risk);
    const baseWinSize = mapRiskToBaseWinSize(lottery.risk);
    const baseFrequency = lottery.drawType === 'instant' ? 1.0 : 1.0 / 7.0;

    const price = Number(lottery.minPrice) || 0;
    const priceNorm = normalizePrice(price, minPrice, maxPrice);

    const hash01 = getDeterministicHash01(lottery.id);

    const win_rate = baseWinRate * (0.9 + 0.25 * (1 - priceNorm)) * (0.95 + 0.1 * hash01);
    const win_size = baseWinSize * (0.7 + 0.8 * priceNorm) * (0.95 + 0.1 * (1 - hash01));
    const frequency = baseFrequency * (0.95 + 0.15 * (1 - priceNorm)) * (0.96 + 0.08 * hash01);

    const ticket_cost = price;

    return {
      name: lottery.name,
      win_rate,
      win_size,
      frequency,
      ticket_cost,
    };
  };

  const clampWeight = (value: number): number => {
    if (!Number.isFinite(value)) return 1;
    if (value < 0.5) return 0.5;
    if (value > 1.5) return 1.5;
    return value;
  };

  const mapProfileToDesired = (p: Profile, weights?: RefineWeights): UniversalPropsWithK => {
    const base: RefineWeights = {
      win_rate_k: 1.0,
      win_size_k: 1.0,
      frequency_k: 1.0,
      ticket_cost_k: 1.0,
    };

    const merged = {
      ...base,
      ...(weights ?? {}),
    };

    return {
      name: 'user',
      win_rate: p.win_rate,
      win_size: p.win_size,
      frequency: p.frequency,
      ticket_cost: p.ticket_cost,
      win_rate_k: clampWeight(merged.win_rate_k),
      win_size_k: clampWeight(merged.win_size_k),
      frequency_k: clampWeight(merged.frequency_k),
      ticket_cost_k: clampWeight(merged.ticket_cost_k),
    };
  };

  /**
   * Вызываем /best_of и ВОЗВРАЩАЕМ РОВНО ПЕРВЫЕ `limit` лотерей
   * в том же порядке, что и в ответе бэкенда (по diff).
   */
  const callBestOf = async (
    p: Profile,
    sourceLotteries: Lottery[],
    weights?: RefineWeights,
    limit?: number
  ): Promise<Lottery[]> => {
    if (!sourceLotteries || sourceLotteries.length === 0) {
      return [];
    }

    const desired = mapProfileToDesired(p, weights);

    const prices = sourceLotteries.map((l) => Number(l.minPrice) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const realValues: UniversalProps[] = sourceLotteries.map((lottery) =>
      mapLotteryToUniversalProps(lottery, minPrice, maxPrice)
    );

    const payload: BestOfHandlerRequest = {
      universal_props_with_k: desired,
      real_values: realValues,
      p,
    };

    try {
      const response: BestOfHandlerResponse = await recommendationApi.bestOf(payload);

      const sortedByDiff = [...response].sort((a, b) => a.diff - b.diff);

      const byName = new Map<string, Lottery>();
      for (const lot of sourceLotteries) {
        byName.set(lot.name, lot);
      }

      const topLotteries: Lottery[] = [];
      for (const item of sortedByDiff) {
        const lot = byName.get(item.name);
        if (!lot) continue;
        topLotteries.push(lot);

        if (typeof limit === 'number' && limit > 0 && topLotteries.length >= limit) {
          break;
        }
      }

      return topLotteries;
    } catch {
      return [];
    }
  };

  // ========= Завершение первой анкеты профиля =========
  const handleProfileComplete = async (p: Profile): Promise<void> => {
    setProfile(p);

    const sourceLotteries = lotteries;

    if (sourceLotteries.length === 0) {
      setBestLotteries([]);
      setHasResults(false);
      return;
    }

    setIsLoadingResults(true);
    setHasResults(false);

    try {
      const top4 = await callBestOf(p, sourceLotteries, undefined, 4);
      setBestLotteries(top4);
      setHasResults(true);
    } catch {
      setBestLotteries([]);
      setHasResults(true);
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Переход к уточняющим вопросам
  const handleGoRefine = useCallback((): void => {
    if (hasRefine || isRefineIntroLoading || !profile || bestLotteries.length === 0) return;

    setIsRefineIntroLoading(true);
    setTimeout(() => {
      setIsRefineIntroLoading(false);
      setHasRefine(true);
    }, 700);
  }, [hasRefine, isRefineIntroLoading, profile, bestLotteries.length]);

  // Второй вызов /best_of — после второй анкеты, уже с весами пользователя
  const handleFinalFromRefine = async (weights: RefineWeights): Promise<void> => {
    if (!profile) {
      return;
    }

    if (!lotteries || lotteries.length === 0) {
      return;
    }

    setIsLoadingFinal(true);

    try {
      const refinedTop1 = await callBestOf(profile, lotteries, weights, 1);
      const final = refinedTop1[0] ?? bestLotteries[0] ?? lotteries[0];

      setFinalLottery(final);
      setHasFinal(true);
    } catch {
      // fallback поведения уже реализован через ?? выше
    } finally {
      setIsLoadingFinal(false);
    }
  };

  return (
    <Box bg="transparent" minH="90vh" display="flex" flexDirection="column" flex="1">
      <Box
        bg="black"
        backdropFilter="blur(10px)"
        borderRadius={{ base: '0', md: '3xl' }}
        borderWidth={{ base: '0', md: '1px' }}
        borderColor={borderColor}
        boxShadow={containerShadow}
        display="flex"
        flexDirection="column"
        overflow="hidden"
        flex="1"
        h="100%"
      >
        <Box
          px={{ base: 4, md: 6 }}
          py={3}
          borderBottomWidth="1px"
          borderColor={borderColor}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg={chatSurfaceBg}
          backdropFilter="blur(8px)"
        >
          <Stack>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Лотерейный ассистент
            </Text>
            <Text fontSize="xs" color={textColor}>
              Подберу лотерею под твой стиль игры
            </Text>
          </Stack>
          <HStack>
            <Box
              w={8}
              h={8}
              borderRadius="full"
              bgGradient="linear(to-br, #FFA500, #671600)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              color="#FFFFFF"
              boxShadow="md"
            >
              🎲
            </Box>
            <Badge
              colorScheme="green"
              variant="subtle"
              fontSize="0.7rem"
              borderRadius="full"
              px={3}
              py={1}
              bg={badgeBg}
              color={badgeColor}
            >
              online
            </Badge>
          </HStack>
        </Box>

        <Box ref={messagesRef} px={{ base: 3, md: 5 }} py={4} flexGrow={1} overflowY="auto">
          <Stack>
            <ChatBubble role="assistant">
              <Stack>
                <Text color={textColor}>
                  Привет! 👋 Я помогу разобраться с лотереями: сначала покажу быстрые варианты, а
                  если не зайдут — настроим подбор под твой стиль игры.
                </Text>
                {isInitial && (
                  <Text fontSize="15.12px" color={textColor}>
                    Можешь сразу посмотреть варианты ниже или запустить умный подбор.
                  </Text>
                )}
              </Stack>
            </ChatBubble>

            {/* Быстрые рекомендации только из Stoloto */}
            <ChatBubble role="assistant">
              <QuickRecommendations
                hasStartedQuestionnaire={hasStartedQuestionnaire}
                setHasStartedQuestionnaire={setHasStartedQuestionnaire}
                lotteries={quickLotteries}
                isLoading={isStolotoLoading}
                error={stolotoError}
                onRetry={() => {
                  void fetchDraws();
                }}
              />
            </ChatBubble>

            {hasStartedQuestionnaire && (
              <>
                <ChatBubble role="user">
                  <Text fontSize="15.12px" color={textColor}>
                    Хочу настроить подбор под себя.
                  </Text>
                </ChatBubble>
                <ChatBubble role="assistant">
                  <ProfileWizard
                    onComplete={handleProfileComplete}
                    onCancel={() => {
                      setHasStartedQuestionnaire(false);
                      setProfile(null);
                      setBestLotteries([]);
                      setHasResults(false);
                      setHasRefine(false);
                      setHasFinal(false);
                      setFinalLottery(null);
                    }}
                    onLotteriesChange={(nextLotteries: Lottery[]) => {
                      setLotteries(nextLotteries);
                    }}
                  />
                </ChatBubble>
              </>
            )}

            {isLoadingResults && (
              <ChatBubble role="assistant">
                <Box py={2}>
                  <Center flexDirection="column">
                    <Spinner size="md" color={spinnerColorResults} mb={3} />
                    <Text fontSize="15.12px" color={textColor} textAlign="center">
                      Анализирую твои ответы и подбираю лучшие варианты…
                    </Text>
                  </Center>
                </Box>
              </ChatBubble>
            )}

            {hasResults && (
              <>
                <ChatBubble role="user">
                  <Text fontSize="15.12px" color={textColor}>
                    Готов увидеть рекомендации, что ты подобрал?
                  </Text>
                </ChatBubble>
                <ChatBubble role="assistant">
                  <ResultsBlock
                    profile={profile}
                    bestLotteries={bestLotteries}
                    onGoRefine={handleGoRefine}
                  />
                </ChatBubble>
              </>
            )}

            {isRefineIntroLoading && (
              <ChatBubble role="assistant">
                <Box py={2}>
                  <Center flexDirection="column">
                    <Spinner size="sm" color={spinnerColorRefine} mb={2} />
                    <Text fontSize="15.12px" color={textColor} textAlign="center">
                      Секунду, уточняю детали по этим лотереям…
                    </Text>
                  </Center>
                </Box>
              </ChatBubble>
            )}

            {hasRefine && profile && bestLotteries.length > 0 && (
              <>
                <ChatBubble role="user">
                  <Text fontSize="15.12px" color={textColor}>
                    Давай уточним и выберем один лучший вариант с учётом того, что для меня важнее.
                  </Text>
                </ChatBubble>
                <ChatBubble role="assistant">
                  <Stack>
                    <Text fontSize="15.12px" color={textColor}>
                      Окей, ещё несколько уточняющих вопросов — и я пересчитаю подбор с учётом
                      важности параметров.
                    </Text>
                    <RefineWizard
                      lotteries={bestLotteries}
                      profile={profile}
                      onComplete={handleFinalFromRefine}
                    />
                  </Stack>
                </ChatBubble>
              </>
            )}

            {isLoadingFinal && (
              <ChatBubble role="assistant">
                <Box py={2}>
                  <Center flexDirection="column">
                    <Spinner size="md" color={spinnerColorFinal} mb={3} />
                    <Text fontSize="15.12px" color={textColor} textAlign="center">
                      Пересчитываю рекомендации с учётом твоих приоритетов…
                    </Text>
                  </Center>
                </Box>
              </ChatBubble>
            )}

            {hasFinal && finalLottery && profile && (
              <>
                <ChatBubble role="user">
                  <Text fontSize="15.12px" color={textColor}>
                    Хочу остановиться на одном варианте, покажи итоговую рекомендацию.
                  </Text>
                </ChatBubble>
                <ChatBubble role="assistant">
                  <FinalBlock
                    profile={profile}
                    finalLottery={finalLottery}
                    setProfile={setProfile}
                    setBestLottery={setBestLotteries}
                    setFinalLottery={setFinalLottery}
                    setHasStartedQuestionnaire={setHasStartedQuestionnaire}
                    setIsLoadingResults={setIsLoadingResults}
                    setHasResults={setHasResults}
                    setHasRefine={setHasRefine}
                    setHasFinal={setHasFinal}
                    setIsLoadingFinal={setIsLoadingFinal}
                  />
                </ChatBubble>
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
