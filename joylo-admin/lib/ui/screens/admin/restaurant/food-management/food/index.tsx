// Components
import FoodForm from '@/lib/ui/screen-components/protected/restaurant/food/form/add-form';
import FoodHeader from '@/lib/ui/screen-components/protected/restaurant/food/view/header/screen-header';
import FoodsMain from '@/lib/ui/screen-components/protected/restaurant/food/view/main';
import PendingProductsTable from '@/lib/ui/screen-components/protected/restaurant/food/view/main/PendingProductsTable';
import FoodTabs from '@/lib/ui/screen-components/protected/restaurant/food/view/tabs/FoodTabs';
import { useSearchParams } from 'next/navigation';

type TabKey = 'pending' | 'approved' | 'rejected';

export default function FoodScreen() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('activeTab') as TabKey || 'approved';


  return (
    <div className="screen-container">
      <FoodHeader />
      <FoodTabs />

      <div className="">
        {activeTab === 'approved' && <FoodsMain />}
        {activeTab === 'pending' && <PendingProductsTable status='pending' />}
        {activeTab === 'rejected' && <PendingProductsTable status='rejected' />}
      </div>
      <FoodForm />
    </div>
  );
}
