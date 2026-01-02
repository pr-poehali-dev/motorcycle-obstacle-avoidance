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
import BikeShop from '@/components/BikeShop';
import UpgradesTab from '@/components/UpgradesTab';
import EventsTab from '@/components/EventsTab';
import ProfileTab from '@/components/game/ProfileTab';
import QuestsTab from '@/components/game/QuestsTab';
import NightRaceEvent from '@/components/game/NightRaceEvent';
import CoinExchangeShop from '@/components/game/CoinExchangeShop';
import LevelMap from '@/components/game/LevelMap';

interface Level {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'impossible';
  reward: number;
  locked: boolean;
  completed: boolean;
  stars: number;
}

interface Avatar {
  id: number;
  emoji: string;
  name: string;
  price: number;
  unlocked: boolean;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: number;
  eventReward: number;
  completed: boolean;
  claimed: boolean;
  type: 'daily' | 'weekly' | 'special';
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

interface BikeModel {
  id: number;
  name: string;
  price: number;
  purchased: boolean;
  speed: number;
  handling: number;
}

interface Upgrade {
  id: number;
  name: string;
  type: 'speed' | 'armor';
  level: number;
  maxLevel: number;
  price: number;
  icon: string;
}

interface GameEvent {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  eventReward: number;
  active: boolean;
  completed: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [coins, setCoins] = useState(1200);
  const [eventCoins, setEventCoins] = useState(50);
  const [nickname, setNickname] = useState('Гонщик');
  const [selectedAvatar, setSelectedAvatar] = useState('🏍️');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('Гонщик');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedBike, setSelectedBike] = useState(1);
  
  const [bikeCustomization, setBikeCustomization] = useState({
    bodyColor: '#10b981',
    wheelColor: '#1f2937',
    handleColor: '#6b7280',
    hasLights: false,
    customUnlocked: false
  });

  const levels: Level[] = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    difficulty: i < 5 ? 'easy' : i < 10 ? 'medium' : i < 15 ? 'hard' : i === 15 ? 'expert' : 'impossible',
    reward: i < 5 ? 50 + (i * 250) : i < 10 ? 200 + ((i-5) * 500) : i < 15 ? 700 + ((i-10) * 1000) : i === 15 ? 5000 : 10000,
    locked: i === 16,
    completed: false,
    stars: 0
  }));

  const [levelsState, setLevelsState] = useState(levels);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, title: 'Первая кровь', description: 'Завершите первый уровень без падений', icon: 'Trophy', unlocked: false, progress: 0, total: 1 },
    { id: 2, title: 'Скоростной демон', description: 'Проедьте 10000 метров суммарно', icon: 'Zap', unlocked: false, progress: 0, total: 10000 },
    { id: 3, title: 'Коллекционер', description: 'Соберите 500 монет за игру', icon: 'Coins', unlocked: false, progress: 0, total: 500 },
    { id: 4, title: 'Мастер прыжков', description: 'Выполните 100 прыжков', icon: 'MoveUp', unlocked: false, progress: 0, total: 100 },
    { id: 5, title: 'Легенда', description: 'Пройдите уровень Эксперт', icon: 'Crown', unlocked: false, progress: 0, total: 1 },
    { id: 6, title: 'Миллионер', description: 'Накопите 5000 монет', icon: 'Wallet', unlocked: false, progress: 0, total: 5000 },
  ]);

  const dailyTasks: DailyTask[] = [
    { id: 1, title: 'Утренний заезд', description: 'Завершите 3 уровня подряд', reward: 50, completed: false, progress: 0, total: 3 },
    { id: 2, title: 'Трюкач', description: 'Выполните 10 прыжков', reward: 50, completed: false, progress: 0, total: 10 },
    { id: 3, title: 'Выживший', description: 'Не врежьтесь в препятствия 5 раз подряд', reward: 50, completed: false, progress: 0, total: 5 },
  ];

  const [bikeModels, setBikeModels] = useState<BikeModel[]>([
    { id: 1, name: 'Стартовый байк', price: 0, purchased: true, speed: 1.0, handling: 1.0 },
    { id: 2, name: 'Спорт-байк', price: 750, purchased: false, speed: 1.2, handling: 1.1 },
    { id: 3, name: 'Гоночный байк', price: 1500, purchased: false, speed: 1.5, handling: 1.2 },
    { id: 4, name: 'Кибер-байк', price: 3000, purchased: false, speed: 1.8, handling: 1.3 },
  ]);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 1, name: 'Турбо ускорение', type: 'speed', level: 0, maxLevel: 5, price: 200, icon: 'Zap' },
    { id: 2, name: 'Усиленная броня', type: 'armor', level: 0, maxLevel: 5, price: 200, icon: 'Shield' },
  ]);

  const [gameEvents, setGameEvents] = useState<GameEvent[]>([
    { id: 1, title: 'Зимний турнир', description: 'Пройдите 5 уровней без падений', progress: 0, total: 5, reward: 150, eventReward: 25, active: true, completed: false },
    { id: 2, title: 'Марафон скорости', description: 'Проедьте 15000 метров суммарно', progress: 0, total: 15000, reward: 300, eventReward: 50, active: true, completed: false },
  ]);

  const [avatars, setAvatars] = useState<Avatar[]>([
    { id: 1, emoji: '🏍️', name: 'Байкер', price: 0, unlocked: true },
    { id: 2, emoji: '😎', name: 'Крутой', price: 100, unlocked: false },
    { id: 3, emoji: '🔥', name: 'Огонь', price: 150, unlocked: false },
    { id: 4, emoji: '⚡', name: 'Молния', price: 200, unlocked: false },
    { id: 5, emoji: '💀', name: 'Череп', price: 250, unlocked: false },
    { id: 6, emoji: '👑', name: 'Король', price: 300, unlocked: false },
    { id: 7, emoji: '🚀', name: 'Ракета', price: 350, unlocked: false },
    { id: 8, emoji: '🎯', name: 'Снайпер', price: 400, unlocked: false },
    { id: 9, emoji: '💎', name: 'Алмаз', price: 500, unlocked: false },
    { id: 10, emoji: '🌟', name: 'Звезда', price: 600, unlocked: false },
    { id: 11, emoji: '🦁', name: 'Лев', price: 700, unlocked: false },
    { id: 12, emoji: '🐉', name: 'Дракон', price: 1000, unlocked: false },
  ]);

  const [quests, setQuests] = useState<Quest[]>([
    { id: 1, title: 'Новичок', description: 'Пройдите первый уровень', icon: 'Flag', progress: 0, target: 1, reward: 50, eventReward: 5, completed: false, claimed: false, type: 'daily' },
    { id: 2, title: 'Трюкач', description: 'Выполните 15 прыжков', icon: 'MoveUp', progress: 0, target: 15, reward: 75, eventReward: 10, completed: false, claimed: false, type: 'daily' },
    { id: 3, title: 'Собиратель', description: 'Соберите 100 монет', icon: 'Coins', progress: 0, target: 100, reward: 100, eventReward: 15, completed: false, claimed: false, type: 'daily' },
    { id: 4, title: 'Гонщик недели', description: 'Пройдите 10 уровней', icon: 'Trophy', progress: 0, target: 10, reward: 300, eventReward: 50, completed: false, claimed: false, type: 'weekly' },
    { id: 5, title: 'Марафонец', description: 'Проедьте 20000 метров', icon: 'Gauge', progress: 0, target: 20000, reward: 500, eventReward: 75, completed: false, claimed: false, type: 'weekly' },
    { id: 6, title: 'Легенда', description: 'Пройдите уровень Невозможно', icon: 'Crown', progress: 0, target: 1, reward: 2000, eventReward: 200, completed: false, claimed: false, type: 'special' },
  ]);

  const [nightRaceActive, setNightRaceActive] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalJumps, setTotalJumps] = useState(0);
  const [totalCoinsCollected, setTotalCoinsCollected] = useState(0);

  const handleLevelComplete = (levelId: number, distance: number, jumps: number, coinsEarned: number) => {
    const level = levelsState.find(l => l.id === levelId);
    if (!level) return;

    setLevelsState(prev => prev.map(l => {
      if (l.id === levelId) {
        return { ...l, completed: true, stars: 3 };
      }
      if (l.id === levelId + 1) {
        return { ...l, locked: false };
      }
      if (levelId === 16 && l.id === 17) {
        return { ...l, locked: false };
      }
      return l;
    }));

    setCoins(prev => prev + level.reward);
    setTotalDistance(prev => prev + distance);
    setTotalJumps(prev => prev + jumps);
    setTotalCoinsCollected(prev => prev + coinsEarned);

    updateQuestsProgress(distance, jumps, coinsEarned, levelId);
    updateAchievements(distance, jumps, coinsEarned);

    toast.success(`Уровень ${levelId} пройден! +${level.reward} монет`, {
      description: `Дистанция: ${distance}м, Прыжков: ${jumps}, Монет: ${coinsEarned}`
    });
    setIsGameActive(false);
  };

  const updateQuestsProgress = (distance: number, jumps: number, coinsEarned: number, levelsCompleted: number) => {
    setQuests(prev => prev.map(quest => {
      let newProgress = quest.progress;

      if (quest.id === 1 && levelsCompleted >= 1) newProgress = Math.min(quest.target, newProgress + 1);
      if (quest.id === 2) newProgress = Math.min(quest.target, newProgress + jumps);
      if (quest.id === 3) newProgress = Math.min(quest.target, newProgress + coinsEarned);
      if (quest.id === 4 && levelsCompleted >= 1) newProgress = Math.min(quest.target, newProgress + 1);
      if (quest.id === 5) newProgress = Math.min(quest.target, newProgress + distance);
      if (quest.id === 6 && levelsCompleted === 17) newProgress = 1;

      const completed = newProgress >= quest.target;
      return { ...quest, progress: newProgress, completed };
    }));
  };

  const updateAchievements = (distance: number, jumps: number, coinsEarned: number) => {
    setAchievements(prev => prev.map(ach => {
      let newProgress = ach.progress;

      if (ach.id === 2) newProgress = Math.min(ach.total, totalDistance + distance);
      if (ach.id === 3) newProgress = Math.min(ach.total, Math.max(newProgress, coinsEarned));
      if (ach.id === 4) newProgress = Math.min(ach.total, totalJumps + jumps);
      if (ach.id === 6) newProgress = coins;

      const unlocked = newProgress >= ach.total;
      return { ...ach, progress: newProgress, unlocked };
    }));
  };

  const handleClaimQuestReward = (questId: number) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    setCoins(prev => prev + quest.reward);
    setEventCoins(prev => prev + quest.eventReward);
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));
    toast.success(`Награда получена! +${quest.reward} монет, +${quest.eventReward} эвент-коинов`);
  };

  const handleAvatarPurchase = (avatarId: number) => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (!avatar || avatar.unlocked) return;

    if (coins >= avatar.price) {
      setCoins(prev => prev - avatar.price);
      setAvatars(prev => prev.map(a => a.id === avatarId ? { ...a, unlocked: true } : a));
      setSelectedAvatar(avatar.emoji);
      toast.success(`Аватар ${avatar.name} куплен!`);
    } else {
      toast.error('Недостаточно монет');
    }
  };

  const handleExchangeCoins = (offerId: number) => {
    const offers = [
      { id: 1, eventCoins: 10, coins: 100 },
      { id: 2, eventCoins: 25, coins: 350 },
      { id: 3, eventCoins: 50, coins: 900 },
      { id: 4, eventCoins: 100, coins: 2200 },
      { id: 5, eventCoins: 250, coins: 7000 }
    ];

    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    if (eventCoins >= offer.eventCoins) {
      setEventCoins(prev => prev - offer.eventCoins);
      setCoins(prev => prev + offer.coins);
      toast.success(`Обменяно ${offer.eventCoins} Event Coins на ${offer.coins} монет!`);
    } else {
      toast.error('Недостаточно Event Coins');
    }
  };

  const handleNightRaceComplete = (score: number, earnedCoins: number) => {
    setCoins(prev => prev + earnedCoins);
    setEventCoins(prev => prev + Math.floor(score / 100));
    toast.success(`Ночной заезд завершён! +${earnedCoins} монет`);
    setNightRaceActive(false);
  };

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
      case 'impossible': return 'Невозможно';
      default: return '';
    }
  };

  const handleBikePurchase = (bike: BikeModel) => {
    if (coins >= bike.price && !bike.purchased) {
      setCoins(prev => prev - bike.price);
      setBikeModels(prev => prev.map(b => b.id === bike.id ? { ...b, purchased: true } : b));
      setSelectedBike(bike.id);
      toast.success(`${bike.name} куплен и выбран!`);
    } else if (bike.purchased) {
      setSelectedBike(bike.id);
      toast.success(`${bike.name} выбран!`);
    } else {
      toast.error('Недостаточно монет');
    }
  };

  const handleUpgrade = (upgrade: Upgrade) => {
    if (upgrade.level >= upgrade.maxLevel) {
      toast.error('Максимальный уровень достигнут');
      return;
    }
    const cost = upgrade.price * (upgrade.level + 1);
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      setUpgrades(prev => prev.map(u => u.id === upgrade.id ? { ...u, level: u.level + 1 } : u));
      toast.success(`${upgrade.name} улучшен до уровня ${upgrade.level + 1}!`);
    } else {
      toast.error('Недостаточно монет');
    }
  };

  const handleCustomUnlock = () => {
    if (coins >= 3500) {
      setCoins(prev => prev - 3500);
      setBikeCustomization(prev => ({ ...prev, customUnlocked: true }));
      toast.success('Кастомная RGB тема разблокирована!');
    } else {
      toast.error('Нужно 3500 монет');
    }
  };

  const handleClaimEventReward = (eventId: number) => {
    const event = gameEvents.find(e => e.id === eventId);
    if (!event) return;

    setCoins(prev => prev + event.reward);
    setEventCoins(prev => prev + event.eventReward);
    setGameEvents(prev => prev.map(e => e.id === eventId ? { ...e, completed: true } : e));
    toast.success(`Награда получена! +${event.reward} монет, +${event.eventReward} эвент-коинов`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {nightRaceActive && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <NightRaceEvent 
              onComplete={handleNightRaceComplete}
              onExit={() => setNightRaceActive(false)}
            />
          </div>
        </div>
      )}

      {isGameActive && selectedLevel && (
        <GameCanvas
          level={selectedLevel}
          bikeCustomization={bikeCustomization}
          onComplete={() => handleLevelComplete(selectedLevel, 0, 0, 0)}
          onExit={() => setIsGameActive(false)}
        />
      )}

      {!isGameActive && !nightRaceActive && (
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
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2 bg-black/40 p-2 mb-8 w-full">
              <TabsTrigger value="home" className="data-[state=active]:glow-green">
                <Icon name="Home" size={18} />
                <span className="hidden md:inline ml-2">Главная</span>
              </TabsTrigger>
              <TabsTrigger value="profile">
                <Icon name="User" size={18} />
                <span className="hidden md:inline ml-2">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="levels">
                <Icon name="Map" size={18} />
                <span className="hidden md:inline ml-2">Уровни</span>
              </TabsTrigger>
              <TabsTrigger value="quests">
                <Icon name="ListTodo" size={18} />
                <span className="hidden md:inline ml-2">Задания</span>
              </TabsTrigger>
              <TabsTrigger value="bikes">
                <Icon name="Bike" size={18} />
                <span className="hidden md:inline ml-2">Байки</span>
              </TabsTrigger>
              <TabsTrigger value="upgrades">
                <Icon name="Wrench" size={18} />
                <span className="hidden md:inline ml-2">Улучшения</span>
              </TabsTrigger>
              <TabsTrigger value="custom">
                <Icon name="Palette" size={18} />
                <span className="hidden md:inline ml-2">RGB</span>
              </TabsTrigger>
              <TabsTrigger value="shop">
                <Icon name="ShoppingCart" size={18} />
                <span className="hidden md:inline ml-2">Магазин</span>
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Icon name="Trophy" size={18} />
                <span className="hidden md:inline ml-2">Достижения</span>
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

                <div className="space-y-6">
                  <Card className="bg-black/40 border-white/10 p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gradient mb-6">Статистика</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Пройдено уровней</span>
                        <span className="text-xl md:text-2xl font-bold text-emerald-400">
                          {levelsState.filter(l => l.completed).length}/17
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

                  <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/30 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name="Moon" className="text-purple-400" size={32} />
                      <h3 className="text-xl font-bold">Ночной заезд</h3>
                    </div>
                    <p className="text-gray-300 mb-4">Особое событие! Проедьте в полной темноте, видя только свет фар</p>
                    <Button onClick={() => setNightRaceActive(true)} className="w-full glow-purple">
                      <Icon name="Play" size={20} className="mr-2" />
                      Начать ночной заезд
                    </Button>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="levels" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">🗺️ Карта уровней</h2>
              <LevelMap 
                levels={levelsState}
                onLevelSelect={(levelId) => {
                  setSelectedLevel(levelId);
                  setIsGameActive(true);
                }}
              />
            </TabsContent>

            <TabsContent value="bikes">
              <BikeShop 
                bikes={bikeModels}
                selectedBike={selectedBike}
                coins={coins}
                onPurchase={handleBikePurchase}
              />
            </TabsContent>

            <TabsContent value="upgrades">
              <UpgradesTab 
                upgrades={upgrades}
                coins={coins}
                onUpgrade={handleUpgrade}
              />
            </TabsContent>

            <TabsContent value="custom" className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">RGB Кастомизация</h2>
              {!bikeCustomization.customUnlocked ? (
                <Card className="bg-black/40 border-emerald-500/30 p-6 md:p-8 text-center max-w-2xl mx-auto">
                  <Icon name="Lock" className="mx-auto mb-4 text-emerald-500" size={64} />
                  <h3 className="text-xl md:text-2xl font-bold mb-4">RGB Панель заблокирована</h3>
                  <p className="text-gray-400 mb-6 text-lg">Разблокируйте полную кастомизацию цветов за 3500 монет</p>
                  <div className="flex items-center justify-center gap-2 mb-6 text-2xl">
                    <Icon name="Coins" className="text-yellow-400" size={32} />
                    <span className="font-bold text-yellow-400">3500</span>
                  </div>
                  <Button onClick={handleCustomUnlock} className="glow-green" size="lg" disabled={coins < 3500}>
                    Разблокировать RGB панель
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

            <TabsContent value="shop">
              <CoinExchangeShop 
                eventCoins={eventCoins}
                onExchange={handleExchangeCoins}
              />
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

            <TabsContent value="profile">
              <ProfileTab 
                nickname={nickname}
                selectedAvatar={selectedAvatar}
                avatars={avatars}
                coins={coins}
                onNicknameChange={setNickname}
                onAvatarSelect={setSelectedAvatar}
                onAvatarPurchase={handleAvatarPurchase}
              />
            </TabsContent>

            <TabsContent value="quests">
              <QuestsTab 
                quests={quests}
                onClaimReward={handleClaimQuestReward}
              />
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