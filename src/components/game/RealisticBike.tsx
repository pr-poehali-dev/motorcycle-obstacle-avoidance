interface RealisticBikeProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  rotation?: number;
  bodyColor?: string;
  scale?: number;
}

export function drawRealisticBike({
  ctx,
  x,
  y,
  rotation = 0,
  bodyColor = '#10b981',
  scale = 1
}: RealisticBikeProps) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  // Тени
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  // Заднее колесо
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(-25, 25, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Обод заднего колеса
  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Спицы заднего колеса
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(-25, 25);
    ctx.lineTo(-25 + Math.cos(angle) * 10, 25 + Math.sin(angle) * 10);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Переднее колесо
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(30, 25, 12, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Спицы переднего колеса
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(30, 25);
    ctx.lineTo(30 + Math.cos(angle) * 10, 25 + Math.sin(angle) * 10);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.shadowBlur = 0;

  // Задняя вилка
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-25, 25);
  ctx.lineTo(-20, 10);
  ctx.stroke();

  // Передняя вилка
  ctx.beginPath();
  ctx.moveTo(30, 25);
  ctx.lineTo(27, 5);
  ctx.stroke();

  // Рама - нижняя часть
  const gradient = ctx.createLinearGradient(-20, 0, 20, 30);
  gradient.addColorStop(0, bodyColor);
  gradient.addColorStop(1, '#064e3b');
  ctx.fillStyle = gradient;
  
  ctx.beginPath();
  ctx.moveTo(-20, 10);
  ctx.lineTo(10, 8);
  ctx.lineTo(15, 15);
  ctx.lineTo(-15, 17);
  ctx.closePath();
  ctx.fill();
  
  // Обводка рамы
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Топливный бак
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Блеск на баке
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(-5, -3, 8, 4, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Сиденье
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(-12, 5, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Руль
  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(27, 5);
  ctx.moveTo(27, 5);
  ctx.lineTo(32, 3);
  ctx.moveTo(27, 5);
  ctx.lineTo(32, 7);
  ctx.stroke();

  // Фара
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(35, 5, 4, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.shadowBlur = 0;

  // Выхлопная труба
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-20, 15);
  ctx.lineTo(-30, 20);
  ctx.stroke();
  
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(-30, 20, 3, 0, Math.PI * 2);
  ctx.fill();

  // Детали рамы
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-5, 8);
  ctx.lineTo(5, 12);
  ctx.stroke();

  ctx.restore();
}

export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'spike' | 'wall' | 'pit' | 'rock'
) {
  ctx.save();
  
  switch (type) {
    case 'spike':
      // Шипы с деталями
      ctx.fillStyle = '#dc2626';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 10;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 15, y);
        ctx.lineTo(x + i * 15 + 7.5, y - 25);
        ctx.lineTo(x + i * 15 + 15, y);
        ctx.closePath();
        ctx.fill();
        
        // Блеск на шипах
        ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x + i * 15 + 5, y - 5);
        ctx.lineTo(x + i * 15 + 7.5, y - 20);
        ctx.lineTo(x + i * 15 + 7.5, y - 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#dc2626';
      }
      break;

    case 'wall':
      // Стена с текстурой кирпичей
      const wallGradient = ctx.createLinearGradient(x, y, x, y + 60);
      wallGradient.addColorStop(0, '#4a5568');
      wallGradient.addColorStop(1, '#1a202c');
      
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, 20, 60);
      
      // Кирпичи
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 2;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
          ctx.strokeRect(x + col * 10, y + row * 15, 10, 15);
        }
      }
      
      // Блеск
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(x + 2, y + 5, 3, 50);
      break;

    case 'pit':
      // Яма с глубиной
      ctx.fillStyle = '#000';
      ctx.fillRect(x, y, 80, 30);
      
      // Градиент глубины
      const pitGradient = ctx.createLinearGradient(x, y, x, y + 30);
      pitGradient.addColorStop(0, 'rgba(139, 0, 0, 0.6)');
      pitGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = pitGradient;
      ctx.fillRect(x, y, 80, 30);
      
      // Края ямы
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, 80, 30);
      break;

    case 'rock':
      // Камень
      ctx.fillStyle = '#78716c';
      ctx.beginPath();
      ctx.ellipse(x + 20, y + 15, 20, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#57534e';
      ctx.beginPath();
      ctx.ellipse(x + 25, y + 10, 12, 10, 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Тени на камне
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.ellipse(x + 15, y + 18, 8, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  
  ctx.restore();
}

export function drawCoin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number = 0
) {
  ctx.save();
  
  // Вращение монеты
  const rotation = (frame % 60) / 60;
  const scale = Math.abs(Math.cos(rotation * Math.PI * 2));
  
  ctx.translate(x, y);
  ctx.scale(scale * 0.8 + 0.2, 1);
  
  // Свечение
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 20;
  
  // Внешний круг
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
  gradient.addColorStop(0, '#fef08a');
  gradient.addColorStop(0.5, '#eab308');
  gradient.addColorStop(1, '#ca8a04');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Внутренний круг
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Блеск
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(-3, -3, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}
