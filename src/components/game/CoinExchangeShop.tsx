import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ExchangeOffer {
  id: number;
  eventCoins: number;
  coins: number;
  bonus: number;
}

interface CoinExchangeShopProps {
  eventCoins: number;
  onExchange: (offerId: number) => void;
}

export default function CoinExchangeShop({ eventCoins, onExchange }: CoinExchangeShopProps) {
  const offers: ExchangeOffer[] = [
    { id: 1, eventCoins: 10, coins: 100, bonus: 0 },
    { id: 2, eventCoins: 25, coins: 300, bonus: 50 },
    { id: 3, eventCoins: 50, coins: 700, bonus: 200 },
    { id: 4, eventCoins: 100, coins: 1600, bonus: 600 },
    { id: 5, eventCoins: 250, coins: 5000, bonus: 2000 }
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="ArrowRightLeft" className="text-purple-400" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gradient">Обмен валюты</h2>
            <p className="text-sm text-gray-400">Обменяйте Event Coins на монеты</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-black/40 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">У вас</div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Icon name="Sparkles" className="text-purple-400" size={24} />
              <span className="text-purple-400">{eventCoins}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => {
            const canAfford = eventCoins >= offer.eventCoins;
            const totalCoins = offer.coins + offer.bonus;

            return (
              <Card
                key={offer.id}
                className={`p-4 transition-all ${
                  canAfford
                    ? 'bg-black/40 border-purple-500/30 hover:border-purple-500 hover:glow-purple'
                    : 'bg-black/20 border-white/5 opacity-50'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-purple-400">
                    <Icon name="Sparkles" size={20} />
                    <span className="text-2xl font-bold">{offer.eventCoins}</span>
                  </div>

                  <Icon name="ArrowDown" className="mx-auto text-gray-400" size={20} />

                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <Icon name="Coins" size={20} />
                    <span className="text-2xl font-bold">{totalCoins}</span>
                  </div>

                  {offer.bonus > 0 && (
                    <div className="bg-emerald-500/20 px-2 py-1 rounded text-xs font-bold text-emerald-400">
                      +{offer.bonus} бонус!
                    </div>
                  )}

                  <Button
                    onClick={() => onExchange(offer.id)}
                    className="w-full"
                    disabled={!canAfford}
                    size="sm"
                  >
                    {canAfford ? 'Обменять' : 'Недостаточно'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
