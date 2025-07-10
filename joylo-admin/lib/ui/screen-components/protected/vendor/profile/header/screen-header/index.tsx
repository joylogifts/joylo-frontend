// Custom Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import HeaderText from '@/lib/ui/useable-components/header-text';


const ProfileHeader: React.FC = () => {
  // Hooks

  const { getTranslation } = useLangTranslation();
  return (
    <div className="top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text={getTranslation('profile')} />
      </div>
    </div>
  );
};

export default ProfileHeader;
