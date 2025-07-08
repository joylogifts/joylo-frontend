import OptionsHeader from '@/lib/ui/screen-components/protected/restaurant/options/view/header/screen-header';
import OptionsMain from '@/lib/ui/screen-components/protected/restaurant/options/view/main';

export default function OptionsScreen() {

  return (
    <div className="screen-container">
      <OptionsHeader />
      <OptionsMain />
    </div>
  );
}
