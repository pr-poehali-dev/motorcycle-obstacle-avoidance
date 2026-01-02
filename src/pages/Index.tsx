import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import GameCanvas from '@/components/GameCanvas';

interface Level {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward: number;
  locked: boolean;
  completed: boolean;
  stars: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
}

interface DailyTask {
  id: number;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  progress: number;
  total: number;
}

interface ShopItem {
  id: number;
  name: string;
  price: number;
  type: 'skin' | 'upgrade' | 'custom';
  purchased: boolean;
  icon: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [coins, setCoins] = useState(150);
  const [eventCoins, setEventCoins] = useState(50);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('Гонщик');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const [bikeCustomization, setBikeCustomization] = useState({
    bodyColor: '#10b981',
    wheelColor: '#1f2937',
    handleColor: '#6b7280',
    hasLights: false,
    customUnlocked: false
  });

  const levels: Level[] = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    difficulty: i < 5 ? 'easy' : i < 10 ? 'medium' : i < 15 ? 'hard' : 'expert',
    reward: i < 5 ? 50 : i < 10 ? 75 : i < 15 ? 100 : 200,
    locked: i > 0,
    completed: false,
    stars: 0
  }));

  const [levelsState, setLevelsState] = useState(levels);

  const achievements: Achievement[] = [
    { id: 1, title: 'Новичок', description: 'Завершите первый уровень', icon: 'Trophy', unlocked: false, progress: 0, total: 1 },
    { id: 2, title: 'Скоростной демон', description: 'Завершите уровень за 30 секунд', icon: 'Zap', unlocked: false, progress: 0, total: 1 },
    { id: 3, title: 'Коллекционер', description: 'Соберите 1000 монет', icon: 'Coins', unlocked: false, progress: 150, total: 1000 },
    { id: 4, title: 'Мастер', description: 'Получите 3 звезды на 10 уровнях', icon: 'Star', unlocked: false, progress: 0, total: 10 },
  ];

  const dailyTasks: DailyTask[] = [
    { id: 1, title: 'Утренний заезд', description: 'Завершите 3 уровня подряд', reward: 50, completed: false, progress: 0, total: 3 },
    { id: 2, title: 'Трюкач', description: 'Выполните 10 прыжков', reward: 50, completed: false, progress: 0, total: 10 },
    { id: 3, title: 'Выживший', description: 'Не врежьтесь в препятствия 5 раз подряд', reward: 50, completed: false, progress: 0, total: 5 },
  ];

  const shopItems: ShopItem[] = [
    { id: 1, name: 'Красный байк', price: 200, type: 'skin', purchased: false, icon: 'Bike' },
    { id: 2, name: 'Синий байк', price: 200, type: 'skin', purchased: false, icon: 'Bike' },
    { id: 3, name: 'Турбо ускорение', price: 300, type: 'upgrade', purchased: false, icon: 'Zap' },
    { id: 4, name: 'Усиленная броня', price: 300, type: 'upgrade', purchased: false, icon: 'Shield' },
    { id: 5, name: 'Кастомная тема', price: 1000, type: 'custom', purchased: false, icon: 'Palette' },
  ];

  const eventItems = [
    { id: 1, title: 'Зимний турнир', description: 'Завершите 5 зимних уровней', reward: 150, eventReward: 25, active: true },
    { id: 2, title: 'Ночной заезд', description: 'Пройдите уровень в ночном режиме', reward: 100, eventReward: 15, active: true },
  ];

  const handleLevelComplete = (levelId: number) => {
    const level = levelsState.find(l => l.id === levelId);
    if (!level) return;

    setLevelsState(prev => prev.map(l => {
      if (l.id === levelId) {
        return { ...l, completed: true, stars: 3 };
      }
      if (l.id === levelId + 1) {
        return { ...l, locked: false };
      }
      return l;
    }));

    setCoins(prev => prev + level.reward);
    toast.success(`Уровень ${levelId} пройден! +${level.reward} монет`, {
      description: `Всего монет: ${coins + level.reward}`
    });
    setIsGameActive(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'expert': return 'bg-red-900/40 text-red-400 border-red-500/50 glow-red';
      default: return '';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкий';
      case 'medium': return 'Средний';
      case 'hard': return 'Сложный';
      case 'expert': return 'Эксперт';
      default: return '';
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price && !item.purchased) {
      setCoins(prev => prev - item.price);
      if (item.type === 'custom') {
        setBikeCustomization(prev => ({ ...prev, customUnlocked: true }));
        toast.success('Кастомная тема разблокирована!');
      } else {
        toast.success(`${item.name} куплен!`);
      }
    } else if (item.purchased) {
      toast.error('Уже куплено');
    } else {
      toast.error('Недостаточно монет');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {isGameActive && selectedLevel && (
        <GameCanvas
          level={selectedLevel}
          bikeCustomization={bikeCustomization}
          onComplete={() => handleLevelComplete(selectedLevel)}
          onExit={() => setIsGameActive(false)}
        />
      )}

      {!isGameActive && (
        <>
          <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-xl md:text-3xl font-bold text-gradient flex items-center gap-2">
                  <Icon name="Bike" className="text-emerald-500" size={32} />
                  Мотоцикл: Избегай препятствия!
                </h1>
                
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2 bg-black/40 px-3 md:px-4 py-2 rounded-lg border border-emerald-500/30 glow-green">
                    <Icon name="Coins" className="text-yellow-400" size={18} />
                    <span className="font-bold text-yellow-400">{coins}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 px-3 md:px-4 py-2 rounded-lg border border-purple-500/30">
                    <Icon name="Sparkles" className="text-purple-400" size={18} />
                    <span className="font-bold text-purple-400">{eventCoins}</span>
                  </div>
                  {!isAuthenticated ? (
                    <Button onClick={() => setShowAuthDialog(true)} size="sm" className="glow-green">
                      <Icon name="User" size={16} />
                      <span className="hidden md:inline ml-2">Войти</span>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">{username[0]}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">{username}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto px-4 py-8">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-black/40 p-2 mb-8 w-full">
              <TabsTrigger value="home" className="data-[state=active]:glow-green">
                <Icon name="Home" size={18} />
                <span className="hidden md:inline ml-2">Главная</span>
              </TabsTrigger>
              <TabsTrigger value="levels">
                <Icon name="Map" size={18} />
                <span className="hidden md:inline ml-2">Уровни</span>
              </TabsTrigger>
              <TabsTrigger value="shop">
                <Icon name="ShoppingBag" size={18} />
                <span className="hidden md:inline ml-2">Магазин</span>
              </TabsTrigger>
              <TabsTrigger value="custom">
                <Icon name="Palette" size={18} />
                <span className="hidden md:inline ml-2">Кастомизация</span>
              </TabsTrigger>
              <TabsTrigger value="events">
                <Icon name="Calendar" size={18} />
                <span className="hidden md:inline ml-2">События</span>
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Icon name="Trophy" size={18} />
                <span className="hidden md:inline ml-2">Достижения</span>
              </TabsTrigger>
              <TabsTrigger value="profile">
                <Icon name="User" size={18} />
                <span className="hidden md:inline ml-2">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <Icon name="ListTodo" size={18} />
                <span className="hidden md:inline ml-2">Задания</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/30 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gradient">Добро пожаловать!</h2>
                    <Icon name="Bike" className="text-emerald-500 animate-float" size={48} />
                  </div>
                  <p className="text-gray-300 mb-6 text-base md:text-lg">
                    Управляй мотоциклом, избегай препятствий и собирай монеты! Проходи уровни, разблокируй новые скины и улучшения.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('levels')}
                    size="lg" 
                    className="w-full glow-green text-lg font-bold"
                  >
                    <Icon name="Play" size={24} />
                    Начать игру
                  </Button>
                </Card>

                <Card className="bg-black/40 border-white/10 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gradient mb-6">Статистика</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Пройдено уровней</span>
                      <span className="text-xl md:text-2xl font-bold text-emerald-400">
                        {levelsState.filter(l => l.completed).length}/16
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Собрано монет</span>
                      <span className="text-xl md:text-2xl font-bold text-yellow-400">{coins}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Достижений</span>
                      <span className="text-xl md:text-2xl font-bold text-purple-400">
                        {achievements.filter(a => a.unlocked).length}/{achievements.length}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="levels" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">Выбери уровень</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
                {levelsState.map((level) => (
                  <Card
                    key={level.id}
                    className={`p-4 md:p-6 text-center cursor-pointer transition-all hover:scale-105 ${
                      level.locked 
                        ? 'bg-gray-800/40 border-gray-700 opacity-50 cursor-not-allowed' 
                        : getDifficultyColor(level.difficulty)
                    } ${level.completed ? 'border-yellow-500/50' : ''}`}
                    onClick={() => {
                      if (!level.locked) {
                        setSelectedLevel(level.id);
                        setIsGameActive(true);
                      }
                    }}
                  >
                    {level.locked ? (
                      <Icon name="Lock" className="mx-auto mb-2 text-gray-500" size={28} />
                    ) : (
                      <Icon name="Bike" className="mx-auto mb-2" size={28} />
                    )}
                    <div className="text-xl md:text-2xl font-bold mb-2">{level.id}</div>
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(level.difficulty)}`}>
                      {getDifficultyLabel(level.difficulty)}
                    </Badge>
                    {level.completed && (
                      <div className="flex justify-center gap-1 mt-2">
                        {Array.from({ length: level.stars }).map((_, i) => (
                          <Icon key={i} name="Star" className="text-yellow-400" size={10} />
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">+{level.reward}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shop" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">Магазин</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {shopItems.map((item) => (
                  <Card key={item.id} className="bg-black/40 border-white/10 p-4 md:p-6 hover:border-emerald-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-emerald-500/20 p-3 md:p-4 rounded-lg">
                        <Icon name={item.icon as any} className="text-emerald-400" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base md:text-lg">{item.name}</h3>
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Icon name="Coins" size={14} />
                          <span className="font-bold text-sm">{item.price}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handlePurchase(item)}
                      className="w-full" 
                      size="sm"
                      disabled={item.purchased || coins < item.price}
                      variant={item.purchased ? "secondary" : "default"}
                    >
                      {item.purchased ? 'Куплено' : 'Купить'}
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">Кастомизация мотоцикла</h2>
              {!bikeCustomization.customUnlocked ? (
                <Card className="bg-black/40 border-emerald-500/30 p-6 md:p-8 text-center">
                  <Icon name="Lock" className="mx-auto mb-4 text-emerald-500" size={48} />
                  <h3 className="text-xl md:text-2xl font-bold mb-4">Кастомная тема заблокирована</h3>
                  <p className="text-gray-400 mb-6">Купите кастомную тему в магазине за 1000 монет</p>
                  <Button onClick={() => setActiveTab('shop')} className="glow-green">
                    Перейти в магазин
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <Card className="bg-black/40 border-white/10 p-6 md:p-8">
                    <h3 className="text-lg md:text-xl font-bold mb-6">Настройки цвета</h3>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="bodyColor" className="mb-2 block">Цвет корпуса</Label>
                        <input
                          id="bodyColor"
                          type="color"
                          value={bikeCustomization.bodyColor}
                          onChange={(e) => setBikeCustomization(prev => ({ ...prev, bodyColor: e.target.value }))}
                          className="w-full h-12 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wheelColor" className="mb-2 block">Цвет колес</Label>
                        <input
                          id="wheelColor"
                          type="color"
                          value={bikeCustomization.wheelColor}
                          onChange={(e) => setBikeCustomization(prev => ({ ...prev, wheelColor: e.target.value }))}
                          className="w-full h-12 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="handleColor" className="mb-2 block">Цвет руля</Label>
                        <input
                          id="handleColor"
                          type="color"
                          value={bikeCustomization.handleColor}
                          onChange={(e) => setBikeCustomization(prev => ({ ...prev, handleColor: e.target.value }))}
                          className="w-full h-12 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="lights">Фары</Label>
                        <Switch
                          id="lights"
                          checked={bikeCustomization.hasLights}
                          onCheckedChange={(checked) => setBikeCustomization(prev => ({ ...prev, hasLights: checked }))}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/40 border-white/10 p-6 md:p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="Bike" className="mx-auto mb-4 text-emerald-500" size={96} />
                      <p className="text-gray-400">Предпросмотр мотоцикла</p>
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">События</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {eventItems.map((event) => (
                  <Card key={event.id} className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/30 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg md:text-xl font-bold">{event.title}</h3>
                      {event.active && <Badge className="bg-emerald-500 text-black text-xs">Активно</Badge>}
                    </div>
                    <p className="text-gray-300 mb-4 text-sm md:text-base">{event.description}</p>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Icon name="Coins" className="text-yellow-400" size={16} />
                          <span className="font-bold text-yellow-400 text-sm">+{event.reward}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Sparkles" className="text-purple-400" size={16} />
                          <span className="font-bold text-purple-400 text-sm">+{event.eventReward}</span>
                        </div>
                      </div>
                      <Button size="sm">Участвовать</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">Достижения</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`p-4 md:p-6 ${achievement.unlocked ? 'bg-emerald-950/40 border-emerald-500/30 glow-green' : 'bg-black/40 border-white/10'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 md:p-4 rounded-lg ${achievement.unlocked ? 'bg-emerald-500/20' : 'bg-gray-800/40'}`}>
                        <Icon name={achievement.icon as any} className={achievement.unlocked ? 'text-emerald-400' : 'text-gray-500'} size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base md:text-lg">{achievement.title}</h3>
                        <p className="text-xs md:text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Прогресс</span>
                        <span className="font-bold">{achievement.progress}/{achievement.total}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="animate-fade-in">
              <div className="max-w-2xl mx-auto">
                <Card className="bg-black/40 border-white/10 p-6 md:p-8">
                  <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                    <Avatar className="w-16 h-16 md:w-24 md:h-24">
                      <AvatarFallback className="text-2xl md:text-3xl">{username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-2">{username}</h2>
                      <p className="text-sm md:text-base text-gray-400">Уровень 1 • Новичок</p>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Имя пользователя</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя"
                          />
                          <Button onClick={() => toast.success('Имя обновлено!')}>Сохранить</Button>
                        </div>
                      </div>
                      <div>
                        <Label>Аватар</Label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {['🏍️', '🏁', '⚡', '🔥', '💨'].map((emoji) => (
                            <Button
                              key={emoji}
                              variant="outline"
                              className="text-xl md:text-2xl h-12 md:h-16"
                              onClick={() => toast.success('Аватар обновлен!')}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Icon name="Lock" className="mx-auto mb-4 text-gray-500" size={48} />
                      <p className="text-gray-400 mb-4">Войдите, чтобы редактировать профиль</p>
                      <Button onClick={() => setShowAuthDialog(true)} className="glow-green">
                        Войти
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">Ежедневные задания</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {dailyTasks.map((task) => (
                  <Card key={task.id} className={`p-4 md:p-6 ${task.completed ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-black/40 border-white/10'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base md:text-lg">{task.title}</h3>
                      {task.completed && <Icon name="CheckCircle" className="text-emerald-400" size={20} />}
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mb-4">{task.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Прогресс</span>
                        <span className="font-bold">{task.progress}/{task.total}</span>
                      </div>
                      <Progress value={(task.progress / task.total) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Coins" className="text-yellow-400" size={16} />
                        <span className="font-bold text-yellow-400 text-sm">+{task.reward}</span>
                      </div>
                      <Badge variant={task.completed ? "default" : "secondary"} className="text-xs">
                        {task.completed ? 'Выполнено' : 'В процессе'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <DialogContent className="bg-gray-900 border-emerald-500/30">
              <DialogHeader>
                <DialogTitle className="text-2xl text-gradient">Вход / Регистрация</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="mt-2" />
                </div>
                <Button 
                  className="w-full glow-green" 
                  onClick={() => {
                    setIsAuthenticated(true);
                    setShowAuthDialog(false);
                    toast.success('Вы успешно вошли!');
                  }}
                >
                  Войти
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Index;
