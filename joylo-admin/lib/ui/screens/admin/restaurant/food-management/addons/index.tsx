

// Components
import AddonsAddForm from '@/lib/ui/screen-components/protected/restaurant/add-on/add-form';
import AddonsHeader from '@/lib/ui/screen-components/protected/restaurant/add-on/view/header/screen-header';
import AddonsMain from '@/lib/ui/screen-components/protected/restaurant/add-on/view/main';


export default function AddonsScreen() {
  // State

  return (
    <div className="screen-container">
      <AddonsHeader />

      <AddonsMain />

      <AddonsAddForm

      />
    </div>
  );
}
