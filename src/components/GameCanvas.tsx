import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameCanvasProps {
  level: number;
  bikeCustomization: {
    bodyColor: string;
    wheelColor: string;
    handleColor: string;
    hasLights: boolean;
    customUnlocked: boolean;
  };
  onComplete: () => void;
  onExit: () => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'box' | 'spike' | 'gap';
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

const GameCanvas = ({ level, bikeCustomization, onComplete, onExit }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'completed'>('playing');
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [distance, setDistance] = useState(0);
  
  const gameStateRef = useRef({
    bikeX: 100,
    bikeY: 300,
    bikeVelocityY: 0,
    isJumping: false,
    speed: 6 + level * 0.8,
    obstacles: [] as Obstacle[],
    coins: [] as Coin[],
    lastObstacleX: 800,
    lastCoinX: 600,
    targetDistance: 3500 + level * 500,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !gameStateRef.current.isJumping) {
        gameStateRef.current.bikeVelocityY = -15;
        gameStateRef.current.isJumping = true;
      }
    };

    const handleTouch = () => {
      if (!gameStateRef.current.isJumping) {
        gameStateRef.current.bikeVelocityY = -15;
        gameStateRef.current.isJumping = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('click', handleTouch);

    const generateObstacle = () => {
      const types: Array<'box' | 'spike' | 'gap'> = ['box', 'spike', 'gap'];
      const type = types[Math.floor(Math.random() * types.length)];
      const minGap = 200 + level * 15;
      const maxGap = 400 + level * 25;
      const obstacle: Obstacle = {
        x: gameStateRef.current.lastObstacleX + minGap + Math.random() * maxGap,
        y: type === 'gap' ? canvas.height - 50 : canvas.height - 100 - Math.random() * 80,
        width: type === 'gap' ? 120 + Math.random() * 80 : 70 + Math.random() * 60,
        height: type === 'gap' ? 50 : 70 + Math.random() * 60,
        type,
      };
      gameStateRef.current.lastObstacleX = obstacle.x;
      return obstacle;
    };

    const generateCoin = () => {
      const coin: Coin = {
        x: gameStateRef.current.lastCoinX + 150 + Math.random() * 100,
        y: canvas.height - 200 - Math.random() * 150,
        collected: false,
      };
      gameStateRef.current.lastCoinX = coin.x;
      return coin;
    };

    for (let i = 0; i < 5; i++) {
      gameStateRef.current.obstacles.push(generateObstacle());
      gameStateRef.current.coins.push(generateCoin());
    }

    let animationId: number;
    const gameLoop = () => {
      if (gameState !== 'playing') return;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i - (distance % 100), canvas.height - 50);
        ctx.lineTo(i + 50 - (distance % 100), canvas.height - 50);
        ctx.stroke();
      }

      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      const state = gameStateRef.current;

      state.bikeVelocityY += 0.8;
      state.bikeY += state.bikeVelocityY;

      if (state.bikeY >= canvas.height - 120) {
        state.bikeY = canvas.height - 120;
        state.bikeVelocityY = 0;
        state.isJumping = false;
      }

      const bikeWidth = 80;
      const bikeHeight = 50;
      
      ctx.fillStyle = bikeCustomization.bodyColor;
      ctx.shadowBlur = 15;
      ctx.shadowColor = bikeCustomization.bodyColor;
      ctx.beginPath();
      ctx.roundRect(state.bikeX + 10, state.bikeY, bikeWidth - 20, bikeHeight - 15, 8);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = bikeCustomization.wheelColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(state.bikeX + 20, state.bikeY + bikeHeight - 5, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(state.bikeX + bikeWidth - 20, state.bikeY + bikeHeight - 5, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = bikeCustomization.handleColor;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(state.bikeX + bikeWidth - 15, state.bikeY + 5);
      ctx.lineTo(state.bikeX + bikeWidth - 5, state.bikeY - 20);
      ctx.lineTo(state.bikeX + bikeWidth, state.bikeY - 18);
      ctx.stroke();

      ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
      ctx.fillRect(state.bikeX + 25, state.bikeY + 10, 30, 12);

      if (bikeCustomization.hasLights) {
        const gradient = ctx.createRadialGradient(
          state.bikeX + bikeWidth, state.bikeY + 15, 5,
          state.bikeX + bikeWidth + 30, state.bikeY + 15, 40
        );
        gradient.addColorStop(0, 'rgba(255, 255, 150, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(state.bikeX + bikeWidth, state.bikeY, 40, 30);
        
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffff00';
        ctx.beginPath();
        ctx.arc(state.bikeX + bikeWidth - 5, state.bikeY + 15, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      state.obstacles = state.obstacles.filter(obs => obs.x > -100);
      state.coins = state.coins.filter(coin => coin.x > -50);

      if (state.lastObstacleX < canvas.width + distance) {
        state.obstacles.push(generateObstacle());
      }

      if (state.lastCoinX < canvas.width + distance) {
        state.coins.push(generateCoin());
      }

      state.obstacles.forEach(obs => {
        obs.x -= state.speed;

        if (obs.type === 'box') {
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(obs.x - distance, obs.y, obs.width, obs.height);
        } else if (obs.type === 'spike') {
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(obs.x - distance, obs.y + obs.height);
          ctx.lineTo(obs.x - distance + obs.width / 2, obs.y);
          ctx.lineTo(obs.x - distance + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'gap') {
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(obs.x - distance, obs.y, obs.width, obs.height);
        }

        if (
          state.bikeX + 60 > obs.x - distance &&
          state.bikeX < obs.x - distance + obs.width &&
          state.bikeY + 47 > obs.y &&
          state.bikeY < obs.y + obs.height
        ) {
          setGameState('paused');
          setTimeout(() => {
            onExit();
          }, 1000);
        }
      });

      state.coins.forEach(coin => {
        if (!coin.collected) {
          coin.x -= state.speed;

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(coin.x - distance, coin.y, 15, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.stroke();

          if (
            state.bikeX + 60 > coin.x - distance - 15 &&
            state.bikeX < coin.x - distance + 15 &&
            state.bikeY + 47 > coin.y - 15 &&
            state.bikeY < coin.y + 15
          ) {
            coin.collected = true;
            setCoinsCollected(prev => prev + 1);
            setScore(prev => prev + 10);
          }
        }
      });

      setDistance(prev => {
        const newDist = prev + state.speed;
        if (newDist >= state.targetDistance && gameState === 'playing') {
          setGameState('completed');
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
        return newDist;
      });

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('click', handleTouch);
    };
  }, [gameState, level, bikeCustomization, onComplete, onExit]);

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 flex-wrap gap-4">
        <div className="space-y-2">
          <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-emerald-500/30">
            <div className="text-emerald-400 font-bold text-sm">Уровень {level}</div>
          </div>
          <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
            <div className="text-white font-bold text-sm">Дистанция: {Math.floor(distance)}/{gameStateRef.current.targetDistance}м</div>
          </div>
          <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-yellow-500/30">
            <div className="text-yellow-400 font-bold text-sm flex items-center gap-2">
              <Icon name="Coins" size={16} />
              {coinsCollected}
            </div>
          </div>
        </div>

        <Button
          onClick={onExit}
          variant="outline"
          size="sm"
          className="bg-black/70 backdrop-blur-sm border-red-500/50 hover:bg-red-500/20"
        >
          <Icon name="X" size={18} />
          Выход
        </Button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
        <p className="text-white text-sm font-medium">Нажми ПРОБЕЛ или КЛИК для прыжка</p>
      </div>

      {gameState === 'completed' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-gradient mb-4">Уровень пройден!</h2>
            <p className="text-2xl text-emerald-400 mb-2">Монет собрано: {coinsCollected}</p>
            <p className="text-xl text-gray-400">Возвращение в меню...</p>
          </div>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-4xl font-bold text-red-400 mb-4">Врезались!</h2>
            <p className="text-xl text-gray-400">Попробуйте снова...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;