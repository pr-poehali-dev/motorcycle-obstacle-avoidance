import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface NightRaceEventProps {
  onComplete: (score: number, coins: number) => void;
  onExit: () => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'wall' | 'pit';
}

export default function NightRaceEvent({ onComplete, onExit }: NightRaceEventProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const gameStateRef = useRef({
    bikeY: 250,
    bikeVelocityY: 0,
    speed: 8,
    obstacles: [] as Obstacle[],
    coins: [] as { x: number; y: number; collected: boolean }[],
    cameraX: 0,
    isJumping: false,
    headlightAngle: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;
    const GROUND_Y = 400;
    const BIKE_WIDTH = 60;
    const BIKE_HEIGHT = 40;

    let animationFrame: number;
    const keysPressed: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key] = true;
      if (e.key === ' ' && !gameStateRef.current.isJumping) {
        gameStateRef.current.bikeVelocityY = JUMP_FORCE;
        gameStateRef.current.isJumping = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Генерация препятствий
    const spawnObstacle = () => {
      const types: Array<'spike' | 'wall' | 'pit'> = ['spike', 'wall', 'pit'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let obstacle: Obstacle;
      if (type === 'pit') {
        obstacle = {
          x: gameStateRef.current.cameraX + 900,
          y: GROUND_Y,
          width: 80,
          height: 20,
          type
        };
      } else if (type === 'wall') {
        obstacle = {
          x: gameStateRef.current.cameraX + 900,
          y: GROUND_Y - 60,
          width: 20,
          height: 60,
          type
        };
      } else {
        obstacle = {
          x: gameStateRef.current.cameraX + 900,
          y: GROUND_Y - 15,
          width: 40,
          height: 15,
          type
        };
      }
      
      gameStateRef.current.obstacles.push(obstacle);
    };

    const spawnCoin = () => {
      const y = GROUND_Y - 50 - Math.random() * 150;
      gameStateRef.current.coins.push({
        x: gameStateRef.current.cameraX + 900,
        y,
        collected: false
      });
    };

    // Начальная генерация
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnObstacle();
        spawnCoin();
      }, i * 800);
    }

    const gameLoop = () => {
      if (!ctx || !canvas) return;

      const state = gameStateRef.current;

      // Физика
      state.bikeVelocityY += GRAVITY;
      state.bikeY += state.bikeVelocityY;

      if (state.bikeY >= GROUND_Y - BIKE_HEIGHT) {
        state.bikeY = GROUND_Y - BIKE_HEIGHT;
        state.bikeVelocityY = 0;
        state.isJumping = false;
      }

      state.cameraX += state.speed;
      const distanceMeters = Math.floor(state.cameraX / 10);
      setDistance(distanceMeters);
      setScore(Math.floor(distanceMeters * 1.5));

      // Генерация новых объектов
      if (Math.random() < 0.02) spawnObstacle();
      if (Math.random() < 0.03) spawnCoin();

      // Очистка холста (темный фон)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Звезды
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 50; i++) {
        const x = (i * 137 + state.cameraX * 0.1) % canvas.width;
        const y = (i * 73) % 300;
        ctx.fillRect(x, y, 2, 2);
      }

      // Дорога (еле видна)
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, GROUND_Y, canvas.width, 100);

      // Луч фары мотоцикла
      const bikeX = 100;
      const bikeCenterY = state.bikeY + BIKE_HEIGHT / 2;
      
      const gradient = ctx.createRadialGradient(bikeX + 60, bikeCenterY, 10, bikeX + 300, bikeCenterY, 200);
      gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 150, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(bikeX + 60, bikeCenterY);
      ctx.lineTo(bikeX + 350, bikeCenterY - 100);
      ctx.lineTo(bikeX + 350, bikeCenterY + 100);
      ctx.closePath();
      ctx.fill();

      // Отрисовка препятствий (только в свете фар)
      state.obstacles.forEach((obs, index) => {
        const screenX = obs.x - state.cameraX;
        
        if (screenX < -100) {
          state.obstacles.splice(index, 1);
          return;
        }

        // Проверка, попадает ли препятствие в свет
        const distanceFromLight = Math.abs(screenX - bikeX - 150);
        const inLight = distanceFromLight < 250;
        
        if (inLight) {
          const opacity = Math.max(0.2, 1 - distanceFromLight / 250);
          
          if (obs.type === 'spike') {
            ctx.fillStyle = `rgba(220, 38, 38, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(screenX, obs.y);
            ctx.lineTo(screenX + obs.width / 2, obs.y - obs.height);
            ctx.lineTo(screenX + obs.width, obs.y);
            ctx.closePath();
            ctx.fill();
          } else if (obs.type === 'wall') {
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            ctx.fillRect(screenX, obs.y, obs.width, obs.height);
            ctx.strokeStyle = `rgba(150, 150, 150, ${opacity})`;
            ctx.strokeRect(screenX, obs.y, obs.width, obs.height);
          } else if (obs.type === 'pit') {
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.fillRect(screenX, obs.y, obs.width, obs.height);
            ctx.strokeStyle = `rgba(100, 0, 0, ${opacity})`;
            ctx.strokeRect(screenX, obs.y, obs.width, obs.height);
          }
        }

        // Коллизии
        if (
          bikeX + BIKE_WIDTH > screenX &&
          bikeX < screenX + obs.width &&
          state.bikeY + BIKE_HEIGHT > obs.y &&
          state.bikeY < obs.y + obs.height
        ) {
          setGameOver(true);
        }
      });

      // Монеты (светятся)
      state.coins.forEach((coin, index) => {
        const screenX = coin.x - state.cameraX;
        
        if (screenX < -50) {
          state.coins.splice(index, 1);
          return;
        }

        if (!coin.collected) {
          // Монеты светятся в темноте
          const distanceFromLight = Math.abs(screenX - bikeX - 150);
          const inLight = distanceFromLight < 250;
          
          if (inLight) {
            const opacity = Math.max(0.3, 1 - distanceFromLight / 250);
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = `rgba(234, 179, 8, ${opacity})`;
            ctx.fillStyle = `rgba(234, 179, 8, ${opacity})`;
            ctx.beginPath();
            ctx.arc(screenX, coin.y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Коллизия с монетой
          if (
            bikeX + BIKE_WIDTH > screenX - 12 &&
            bikeX < screenX + 12 &&
            state.bikeY + BIKE_HEIGHT > coin.y - 12 &&
            state.bikeY < coin.y + 12
          ) {
            coin.collected = true;
            setCoinsCollected(prev => prev + 1);
          }
        }
      });

      // Мотоцикл с фарой
      ctx.save();
      ctx.translate(bikeX + BIKE_WIDTH / 2, state.bikeY + BIKE_HEIGHT / 2);
      if (state.isJumping) {
        ctx.rotate(-0.2);
      }
      ctx.translate(-BIKE_WIDTH / 2, -BIKE_HEIGHT / 2);

      // Корпус
      ctx.fillStyle = '#10b981';
      ctx.fillRect(15, 5, 40, 20);
      
      // Колеса
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(15, 30, 10, 0, Math.PI * 2);
      ctx.arc(50, 30, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Фара (яркая)
      ctx.fillStyle = '#fef08a';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#fef08a';
      ctx.beginPath();
      ctx.arc(55, 15, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      // UI
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`Дистанция: ${distanceMeters}м`, 20, 40);
      ctx.fillText(`Монеты: ${coinsCollected}`, 20, 70);

      if (!gameOver) {
        animationFrame = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrame);
    };
  }, [gameOver]);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setDistance(0);
    setCoinsCollected(0);
    gameStateRef.current = {
      bikeY: 250,
      bikeVelocityY: 0,
      speed: 8,
      obstacles: [],
      coins: [],
      cameraX: 0,
      isJumping: false,
      headlightAngle: 0
    };
  };

  const handleFinish = () => {
    onComplete(score, coinsCollected * 10);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-black border-purple-500/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon name="Moon" className="text-purple-400" size={28} />
            <div>
              <h2 className="text-xl font-bold">🌙 Ночной заезд</h2>
              <p className="text-sm text-gray-400">Видна только дорога в свете фар</p>
            </div>
          </div>
          <Button onClick={onExit} variant="ghost" size="sm">
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-purple-500/30 rounded-lg bg-black"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <div className="text-center bg-black/40 px-4 py-2 rounded-lg">
            <div className="text-xs text-gray-400">Дистанция</div>
            <div className="text-xl font-bold text-cyan-400">{distance}м</div>
          </div>
          <div className="text-center bg-black/40 px-4 py-2 rounded-lg">
            <div className="text-xs text-gray-400">Очки</div>
            <div className="text-xl font-bold text-emerald-400">{score}</div>
          </div>
          <div className="text-center bg-black/40 px-4 py-2 rounded-lg">
            <div className="text-xs text-gray-400">Монеты</div>
            <div className="text-xl font-bold text-yellow-400">{coinsCollected}</div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Пробел — Прыжок | Избегайте препятствий в темноте!</p>
        </div>
      </Card>

      {gameOver && (
        <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/30 p-6 text-center">
          <Icon name="Skull" className="mx-auto mb-4 text-red-400" size={48} />
          <h3 className="text-2xl font-bold mb-4">Вы разбились в темноте!</h3>
          <div className="flex gap-4 justify-center mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-400">Дистанция</div>
              <div className="text-xl font-bold">{distance}м</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Награда</div>
              <div className="text-xl font-bold text-yellow-400">+{coinsCollected * 10}</div>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRestart}>Попробовать снова</Button>
            <Button onClick={handleFinish} variant="secondary">Забрать награду</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
