import { type Lottery, MOCK_LOTTERIES, type Profile, type RiskLevel, MicroAnswers } from '@lib';
export const getInitialLotteries = (): Lottery[] => MOCK_LOTTERIES.slice(0, 3);

export const scoreLottery = (profile: Profile, lottery: Lottery): number => {
  let score = 0;

  const budget = profile.budget as string | null;
  if (budget) {
    if (budget === '0-100' && lottery.minPrice <= 100) score += 2;
    if (budget === '100-200' && lottery.minPrice >= 100 && lottery.minPrice <= 200) score += 2;
    if (budget === '200-500' && lottery.minPrice >= 200 && lottery.minPrice <= 500) score += 2;
    if (budget === '500+' && lottery.minPrice >= 500) score += 2;
  }

  const risk = profile.risk as RiskLevel | null;
  if (risk) {
    if (risk === lottery.risk) score += 3;
    if (risk === 'medium' && lottery.risk !== 'medium') score += 1;
  }

  const drawPref = profile.drawType as string | null;
  if (drawPref && drawPref !== 'any') {
    if (drawPref === lottery.drawType) score += 2;
  }

  const formatPref = profile.format as string | null;
  if (formatPref && formatPref !== 'any') {
    if (formatPref === lottery.format) score += 2;
  }

  const style = profile.style as string | null;
  if (style) {
    if (style === 'frequent_small' && lottery.risk === 'low') score += 2;
    if (style === 'big_jackpot' && lottery.risk === 'high') score += 2;
    if (style === 'instant' && lottery.drawType === 'instant') score += 3;
    if (style === 'balanced' && lottery.risk === 'medium') score += 2;
  }

  return score;
};

export const explainMatch = (profile: Profile, lottery: Lottery): string => {
  const parts: string[] = [];

  const budget = profile.budget as string | null;
  if (budget) {
    parts.push(
      `по бюджету: ты указал диапазон «${budget}», а билет здесь стоит примерно ${lottery.minPrice} ₽`
    );
  }

  const risk = profile.risk as string | null;
  if (risk) {
    const riskMap: Record<string, string> = {
      low: 'низкий риск',
      medium: 'средний риск',
      high: 'высокий риск',
    };
    parts.push(
      `по риску: ты выбрал «${riskMap[risk]}», и эта лотерея как раз про ${riskMap[lottery.risk]}`
    );
  }

  const drawType = profile.drawType as string | null;
  if (drawType && drawType !== 'any') {
    parts.push(
      `по типу розыгрыша: тебе ближе «${
        drawType === 'instant' ? 'моментальные' : 'тиражные'
      }» игры, и эта лотерея как раз такая`
    );
  }

  const format = profile.format as string | null;
  if (format && format !== 'any') {
    parts.push(
      `по формату: ты хочешь играть «${
        format === 'online' ? 'онлайн' : 'оффлайн'
      }», и эту лотерею удобно играть именно так`
    );
  }

  if (parts.length === 0) {
    return 'Эта лотерея в целом хорошо ложится на указанные тобой предпочтения.';
  }

  return parts.join('; ') + '.';
};

export const chooseFinalLottery = (
  lotteries: Lottery[],
  profile: Profile,
  answers: MicroAnswers
): Lottery => {
  const baseScores = lotteries.map((lottery) => ({
    lottery,
    base: scoreLottery(profile, lottery),
  }));

  const scored = baseScores.map((entry) => {
    let bonus = 0;

    if (answers.pricePriority === 'economy') {
      const minPrice = Math.min(...lotteries.map((l) => l.minPrice));
      if (entry.lottery.minPrice === minPrice) bonus += 3;
    } else if (answers.pricePriority === 'balance') {
      const avgPrice = lotteries.reduce((sum, l) => sum + l.minPrice, 0) / lotteries.length;
      const diff = Math.abs(entry.lottery.minPrice - avgPrice);
      if (diff <= 30) bonus += 2;
    }

    if (answers.riskFeeling === 'avoid') {
      if (entry.lottery.risk === 'low') bonus += 3;
      if (entry.lottery.risk === 'medium') bonus += 1;
    } else if (answers.riskFeeling === 'neutral') {
      if (entry.lottery.risk === 'medium') bonus += 2;
    } else if (answers.riskFeeling === 'seek') {
      if (entry.lottery.risk === 'high') bonus += 3;
      if (entry.lottery.risk === 'medium') bonus += 1;
    }

    if (answers.playRhythm === 'often') {
      if (entry.lottery.minPrice <= 100) bonus += 2;
      if (entry.lottery.risk !== 'high') bonus += 1;
    } else if (answers.playRhythm === 'rare') {
      if (entry.lottery.risk === 'high') bonus += 2;
    }

    return {
      lottery: entry.lottery,
      score: entry.base + bonus,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].lottery;
};

export const handleProfileComplete = (
  p: Profile,
  setProfile: (profile: Profile) => void,
  setBestLotteries: (lotteries: Lottery[]) => void,
  setIsLoadingResults: (isLoading: boolean) => void,
  setHasResults: (hasResults: boolean) => void
) => {
  setProfile(p);

  const scored = [...MOCK_LOTTERIES]
    .map((lottery) => ({
      lottery,
      score: scoreLottery(p, lottery),
    }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3).map((s) => s.lottery);
  setBestLotteries(top);

  setIsLoadingResults(true);
  setTimeout(() => {
    setIsLoadingResults(false);
    setHasResults(true);
  }, 800);
};

export const handleGoRefine = (hasRefine: boolean, setHasRefine: (hasRefine: boolean) => void) => {
  if (!hasRefine) {
    setHasRefine(true);
  }
};

export const handleFinalFromRefine = (
  lottery: Lottery,
  setIsLoadingFinal: (isLoadingFinal: boolean) => void,
  setFinalLottery: (lottery: Lottery) => void,
  setHasFinal: (hasFinal: boolean) => void
) => {
  setIsLoadingFinal(true);
  setTimeout(() => {
    setFinalLottery(lottery);
    setHasFinal(true);
    setIsLoadingFinal(false);
  }, 800);
};

export const handleRestart = (
  setProfile: (profile: Profile | null) => void,
  setBestLotteries: (lotteries: Lottery[]) => void,
  setFinalLottery: (lottery: Lottery | null) => void,
  setHasStartedQuestionnaire: (hasStarted: boolean) => void,
  setIsLoadingResults: (isLoading: boolean) => void,
  setHasResults: (hasResults: boolean) => void,
  setHasRefine: (hasRefine: boolean) => void,
  setHasFinal: (hasFinal: boolean) => void,
  setIsLoadingFinal: (isLoadingFinal: boolean) => void
) => {
  setProfile(null);
  setBestLotteries([]);
  setFinalLottery(null);
  setHasStartedQuestionnaire(false);
  setIsLoadingResults(false);
  setHasResults(false);
  setHasRefine(false);
  setHasFinal(false);
  setIsLoadingFinal(false);
};
