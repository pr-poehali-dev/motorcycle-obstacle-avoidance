import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface BikeModel {
  id: number;
  name: string;
  price: number;
  purchased: boolean;
  speed: number;
  handling: number;
}

interface BikeShopProps {
  bikes: BikeModel[];
  selectedBike: number;
  coins: number;
  onPurchase: (bike: BikeModel) => void;
}

const BikeShop = ({ bikes, selectedBike, coins, onPurchase }: BikeShopProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">Выбор байка</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {bikes.map((bike) => (
          <Card 
            key={bike.id} 
            className={`p-4 md:p-6 hover:border-emerald-500/50 transition-all ${
              selectedBike === bike.id ? 'bg-emerald-950/40 border-emerald-500 glow-green' : 'bg-black/40 border-white/10'
            }`}
          >
            <div className="text-center mb-4">
              <Icon name="Bike" className={selectedBike === bike.id ? 'text-emerald-400' : 'text-gray-400'} size={64} />
            </div>
            <h3 className="font-bold text-base md:text-lg mb-2 text-center">{bike.name}</h3>
            {selectedBike === bike.id && (
              <Badge className="w-full mb-3 bg-emerald-500 text-black justify-center">Выбран</Badge>
            )}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Скорость</span>
                  <span className="text-emerald-400">{bike.speed.toFixed(1)}x</span>
                </div>
                <Progress value={bike.speed * 50} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Управление</span>
                  <span className="text-blue-400">{bike.handling.toFixed(1)}x</span>
                </div>
                <Progress value={bike.handling * 50} className="h-2" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Coins" className="text-yellow-400" size={18} />
                <span className="font-bold text-yellow-400">{bike.price}</span>
              </div>
            </div>
            <Button 
              onClick={() => onPurchase(bike)}
              className="w-full"
              size="sm"
              disabled={!bike.purchased && coins < bike.price}
              variant={bike.purchased ? "outline" : "default"}
            >
              {bike.purchased ? (selectedBike === bike.id ? 'Выбран' : 'Выбрать') : 'Купить'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BikeShop;
