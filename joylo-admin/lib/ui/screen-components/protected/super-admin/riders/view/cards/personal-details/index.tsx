// Interfaces
import { IRiderDetailsProps } from '@/lib/utils/interfaces';

// PrimeReact Components
import { Skeleton } from 'primereact/skeleton';

// Localization

import { useLangTranslation } from '@/lib/context/global/language.context';

const PersonalDetails = ({ loading, rider }: IRiderDetailsProps) => {

  const { getTranslation } = useLangTranslation();
  return (
    <div className="flex flex-col gap-2 border rounded-lg overflow-hidden">
      <header className="bg-[#F4F4F5] px-6 py-3 border-b-[1px] text-lg font-medium">
        {getTranslation('rider_information')}
      </header>

      {/* columns */}
      <div className="grid grid-cols-2 py-5 px-6">
        {/* left-column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('full_name')}</span>
            <span className="font-medium">
              {loading ? <Skeleton height="1.5rem" /> : (rider?.name ?? '-')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('email')}</span>
            <span className="font-medium">
              {loading ? <Skeleton height="1.5rem" /> : (rider?.email ?? '-')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('zone')}</span>
            <span className="font-medium ">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.zone.title ?? '-')
              )}
            </span>
          </div>
        </div>

        {/* right-column */}
        <div className="flex pl-5 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('phone')}</span>
            <span className="font-medium">
              {loading ? <Skeleton height="1.5rem" /> : (rider?.phone ?? '-')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('password')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.password ?? '-')
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
