// Interfaces
import { IRiderDetailsProps } from '@/lib/utils/interfaces';

// PrimeReact Components
import { Skeleton } from 'primereact/skeleton';

// Localization

import Image from 'next/image';
import { useLangTranslation } from '@/lib/context/global/language.context';

const LicenseDetails = ({ loading, rider }: IRiderDetailsProps) => {

  const { getTranslation } = useLangTranslation();

  return (
    <div className="flex flex-col gap-2 border rounded-lg overflow-hidden">
      <header className="bg-[#F4F4F5] px-6 py-3 border-b-[1px] text-lg font-medium">
        {getTranslation('license_details')}
      </header>

      {/* columns */}
      <div className="grid grid-cols-2 py-5 px-6">
        {/* left-column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('license_number')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.licenseDetails?.number ?? '-')
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">
              {getTranslation('license_expiry_date')}
            </span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : rider?.licenseDetails?.expiryDate ? (
                new Date(rider.licenseDetails?.expiryDate).toLocaleDateString()
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>

        {/* right-column */}
        <div className="flex flex-col gap-5">
          {loading ? (
            <div className="pl-5 h-full flex items-center">
              <Skeleton width="100%" height="100%" />
            </div>
          ) : rider?.licenseDetails?.image ? (
            <div className="relative aspect-video">
              <Image
                fill
                src={
                  rider?.vehicleDetails?.image?.startsWith('http') // Check if it's an absolute URL
                    ? rider?.vehicleDetails?.image
                    : `https://static.vecteezy.com/system/resources/previews/003/415/255/non_2x/drivers-license-a-plastic-identity-card-outline-vector.jpg` // Add the base URL if it's a relative path
                }
                alt="license image"
              />
            </div>
          ) : (
            <span>-</span> // Updated from string to span for better semantics
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseDetails;
