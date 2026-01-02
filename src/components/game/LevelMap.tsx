import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useEffect, useRef } from 'react';

interface Level {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'impossible';
  reward: number;
  locked: boolean;
  completed: boolean;
  stars: number;
}

interface LevelMapProps {
  levels: Level[];
  onLevelSelect: (levelId: number) => void;
}

export default function LevelMap({ levels, onLevelSelect }: LevelMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    // Фон - небо с градиентом
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 800);
    skyGradient.addColorStop(0, '#0f172a');
    skyGradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Звезды
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 1200;
      const y = Math.random() * 300;
      const size = Math.random() * 2;
      ctx.fillRect(x, y, size, size);
    }

    // Горы на заднем плане
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, 500);
    for (let i = 0; i < 10; i++) {
      ctx.lineTo(i * 120 + 60, 300 + Math.random() * 100);
      ctx.lineTo((i + 1) * 120, 500);
    }
    ctx.lineTo(1200, 800);
    ctx.lineTo(0, 800);
    ctx.closePath();
    ctx.fill();

    // Земля
    const groundGradient = ctx.createLinearGradient(0, 500, 0, 800);
    groundGradient.addColorStop(0, '#10b981');
    groundGradient.addColorStop(1, '#059669');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 500, 1200, 300);

    // Дорога (змейка между уровнями)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    const positions = levels.map((_, i) => {
      const row = Math.floor(i / 6);
      const col = i % 6;
      return {
        x: 100 + col * 180 + (row % 2 === 1 ? 90 : 0),
        y: 550 + row * 120
      };
    });

    positions.forEach((pos, i) => {
      if (i === 0) {
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
      }
    });
    ctx.stroke();

    // Разметка дороги
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    positions.forEach((pos, i) => {
      if (i === 0) {
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

  }, [levels]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'expert': return 'bg-red-900/40 text-red-400 border-red-500/50 glow-red';
      case 'impossible': return 'bg-purple-900/40 text-purple-400 border-purple-500/50 glow-purple animate-pulse';
      default: return '';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкий';
      case 'medium': return 'Средний';
      case 'hard': return 'Сложный';
      case 'expert': return 'Эксперт';
      case 'impossible': return '💀 Невозможно';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-emerald-500/30 p-4 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {levels.map((level) => (
          <Card
            key={level.id}
            className={`p-4 md:p-6 text-center cursor-pointer transition-all hover:scale-105 ${
              level.locked
                ? 'bg-gray-800/40 border-gray-700 opacity-50 cursor-not-allowed'
                : getDifficultyColor(level.difficulty)
            } ${level.completed ? 'border-yellow-500/50' : ''}`}
            onClick={() => {
              if (!level.locked) {
                onLevelSelect(level.id);
              }
            }}
          >
            {level.locked ? (
              <Icon name="Lock" className="mx-auto mb-2 text-gray-500" size={32} />
            ) : level.difficulty === 'impossible' ? (
              <div className="text-4xl mb-2">💀</div>
            ) : (
              <Icon name="Bike" className="mx-auto mb-2" size={32} />
            )}
            <div className="text-2xl md:text-3xl font-bold mb-2">{level.id}</div>
            <Badge variant="outline" className={`text-xs mb-2 ${getDifficultyColor(level.difficulty)}`}>
              {getDifficultyLabel(level.difficulty)}
            </Badge>
            {level.completed && (
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: level.stars }).map((_, i) => (
                  <Icon key={i} name="Star" className="text-yellow-400" size={12} />
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-yellow-400">
              <Icon name="Coins" size={12} />
              <span className="font-bold">+{level.reward}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
