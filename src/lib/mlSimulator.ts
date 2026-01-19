export type Assessment = {
  score: number; // 0..1, чем выше — лучше
  label: 'Отлично' | 'Хорошо' | 'Умеренно' | 'Плохо' | 'Критично';
  probabilities: Record<string, number>;
  importantFeatures: { name: string; value: number; weight: number }[];
  explanation: string;
  isSimulation: true;
};

// Простая имитация ML: линейная модель + sigmoid -> классы. Нужна для демонстрации, не для реального использования.
export function assessWaterObject(data: {
  ph?: number;
  turbidity?: number; // NTU
  dissolvedOxygen?: number; // mg/L
  temperature?: number; // C
  conductivity?: number; // µS/cm или условная величина
  [k: string]: any;
}): Assessment {
  // Нормализация и дефолты
  const ph = typeof data.ph === 'number' ? data.ph : 7;
  const turbidity = typeof data.turbidity === 'number' ? data.turbidity : 2;
  const dox = typeof data.dissolvedOxygen === 'number' ? data.dissolvedOxygen : 8;
  const temp = typeof data.temperature === 'number' ? data.temperature : 20;
  const cond = typeof data.conductivity === 'number' ? data.conductivity : 200;

  // Веса (имитация обучения): положительные — улучшают состояние, отрицательные — ухудшают
  const weights = {
    ph: -0.6, // отклонение от 7 даёт ухудшение
    turbidity: -0.9,
    dissolvedOxygen: 1.4,
    temperature: -0.2,
    conductivity: -0.001,
  };

  // Признаки (сдвинутые/нормализованные)
  const phFeature = Math.abs(ph - 7); // чем дальше от 7 — хуже
  const turbidityFeature = Math.min(turbidity / 10, 5); // нормируем
  const doFeature = dox; // напрямую
  const tempFeature = Math.abs(temp - 20) / 10; // чем дальше от 20C — хуже
  const condFeature = cond / 1000; // нормируем

  // Логит (линейная комбинация)
  const logit =
    weights.ph * phFeature +
    weights.turbidity * turbidityFeature +
    weights.dissolvedOxygen * doFeature +
    weights.temperature * tempFeature +
    weights.conductivity * condFeature +
    0.5; // bias

  // Sigmoid -> score 0..1 (высшее — лучше)
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  // Поскольку положительный вклад dox улучшает, но многие веса отрицательные, инвертируем для интерпретации
  const rawScore = sigmoid(logit);
  // Обрезаем
  const score = Math.max(0, Math.min(1, rawScore));

  // Классы и вероятности: простой softmax над логитами некоторых порогов
  const classLogits = {
    Отлично: 5 * (score - 0.9),
    Хорошо: 5 * (score - 0.7),
    Умеренно: 5 * (score - 0.45),
    Плохо: 5 * (score - 0.2),
    Критично: 5 * (score - 0.0),
  };
  const expVals = Object.values(classLogits).map((v) => Math.exp(v));
  const sumExp = expVals.reduce((a, b) => a + b, 0) || 1;
  const probsArray = expVals.map((v) => v / sumExp);
  const classKeys = Object.keys(classLogits);
  const probabilities: Record<string, number> = {};
  classKeys.forEach((k, i) => (probabilities[k] = +probsArray[i].toFixed(3)));

  // Важность признаков (по абсолютной величине вклада)
  const contributions = [
    { name: 'ph', value: ph, weight: weights.ph, contrib: Math.abs(weights.ph * phFeature) },
    { name: 'turbidity', value: turbidity, weight: weights.turbidity, contrib: Math.abs(weights.turbidity * turbidityFeature) },
    { name: 'dissolvedOxygen', value: dox, weight: weights.dissolvedOxygen, contrib: Math.abs(weights.dissolvedOxygen * doFeature) },
    { name: 'temperature', value: temp, weight: weights.temperature, contrib: Math.abs(weights.temperature * tempFeature) },
    { name: 'conductivity', value: cond, weight: weights.conductivity, contrib: Math.abs(weights.conductivity * condFeature) },
  ];
  contributions.sort((a, b) => b.contrib - a.contrib);

  // Выбираем метку с наибольшей вероятностью
  const bestLabel = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0][0] as Assessment['label'];

  const explanation = `ML-имитация: модель использует простую линейную комбинацию признаков (pH, мутность, растворённый кислород, температура, проводимость). Результат — оценка вероятностей классов и скор (0..1). Это демонстрационная имитация, не заменяет реальную ML-модель.`;

  return {
    score,
    label: bestLabel,
    probabilities,
    importantFeatures: contributions.map((c) => ({ name: c.name, value: c.value, weight: c.weight })),
    explanation,
    isSimulation: true,
  };
}