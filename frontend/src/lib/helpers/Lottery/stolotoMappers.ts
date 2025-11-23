import type { Lottery, StolotoGame } from '@lib';

/**
 * Аккуратно достаём номер тиража.
 */
const extractDrawNumber = (game: StolotoGame): number | null => {
  const completedNumber = game.completedDraw?.number;
  const drawNumber = game.draw?.number;

  // 1. Если из completedDraw уже пришёл number — просто возвращаем его
  if (typeof completedNumber === 'number') {
    return completedNumber;
  }

  // 2. Если completedNumber не null/undefined — пробуем привести к числу через строку
  if (completedNumber != null) {
    const trimmed = String(completedNumber).trim();
    if (trimmed !== '') {
      const parsed = Number(trimmed);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  // 3. Аналогично для draw.number
  if (typeof drawNumber === 'number') {
    return drawNumber;
  }

  if (drawNumber != null) {
    const trimmed = String(drawNumber).trim();
    if (trimmed !== '') {
      const parsed = Number(trimmed);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
};

export const mapStolotoGamesToLotteries = (games: StolotoGame[]): Lottery[] =>
  games.map<Lottery>((game) => {
    const name = game.name || 'Без названия';

    const id = `${game.name}-${game.draw?.id ?? 'noid'}`;

    const betCost = game.draw?.betCost ?? 0;
    const drawNumber = extractDrawNumber(game);

    return {
      id,
      name,
      minPrice: betCost,
      risk: 'medium',
      drawType: 'draw',
      format: 'online',
      description: `Тиражная лотерея ${name}`,
      features: [
        `Тираж №${drawNumber ?? '—'}`,
        game.completedDraw?.superPrize
          ? `Суперприз: ${game.completedDraw.superPrize} ₽`
          : 'Фиксированные призы',
      ],
      drawNumber,
      isNew: false,
    };
  });
