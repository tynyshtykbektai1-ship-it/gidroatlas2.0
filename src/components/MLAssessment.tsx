import { useState } from 'react';
import { assessWaterObject, Assessment } from '../lib/mlSimulator';

export default function MLAssessment() {
  const [ph, setPh] = useState<number | ''>(7);
  const [turbidity, setTurbidity] = useState<number | ''>(2);
  const [dox, setDox] = useState<number | ''>(8);
  const [temp, setTemp] = useState<number | ''>(20);
  const [cond, setCond] = useState<number | ''>(200);
  const [result, setResult] = useState<Assessment | null>(null);

  const run = () => {
    const res = assessWaterObject({
      ph: typeof ph === 'number' ? ph : undefined,
      turbidity: typeof turbidity === 'number' ? turbidity : undefined,
      dissolvedOxygen: typeof dox === 'number' ? dox : undefined,
      temperature: typeof temp === 'number' ? temp : undefined,
      conductivity: typeof cond === 'number' ? cond : undefined,
    });
    setResult(res);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">ML-имитация оценки состояния водного объекта</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700">pH</label>
          <input
            type="number"
            step="0.1"
            value={ph}
            onChange={(e) => setPh(e.target.value === '' ? '' : Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Мутность (NTU)</label>
          <input
            type="number"
            step="0.1"
            value={turbidity}
            onChange={(e) => setTurbidity(e.target.value === '' ? '' : Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Растворённый O₂ (mg/L)</label>
          <input
            type="number"
            step="0.1"
            value={dox}
            onChange={(e) => setDox(e.target.value === '' ? '' : Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Температура (°C)</label>
          <input
            type="number"
            step="0.1"
            value={temp}
            onChange={(e) => setTemp(e.target.value === '' ? '' : Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Проводимость (µS/cm)</label>
          <input
            type="number"
            step="1"
            value={cond}
            onChange={(e) => setCond(e.target.value === '' ? '' : Number(e.target.value))}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div>
        <button onClick={run} className="bg-blue-600 text-white px-4 py-2 rounded">Запустить ML-имитацию</button>
      </div>

      {result && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Результат (симуляция ML)</h2>
          <p className="mt-2">Метка: <strong>{result.label}</strong></p>
          <p>Скор: <strong>{(result.score * 100).toFixed(1)}%</strong></p>

          <div className="mt-3 space-y-2">
            <h3 className="font-medium">Вероятности:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.entries(result.probabilities).map(([k, v]) => (
                <div key={k} className="p-2 border rounded text-center">
                  <div className="text-sm text-gray-600">{k}</div>
                  <div className="font-semibold">{Math.round(v * 100)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-medium">Важные признаки:</h3>
            <ul className="list-disc pl-5 mt-2">
              {result.importantFeatures.map((f) => (
                <li key={f.name}>
                  {f.name}: {f.value} (вес: {f.weight})
                </li>
              ))}
            </ul>
          </div>

          
        </div>
      )}
    </div>
  );
}