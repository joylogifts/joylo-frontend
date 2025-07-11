// Interfaces
import { IRiderDetailsProps } from '@/lib/utils/interfaces';

// PrimeReact Components
import { Skeleton } from 'primereact/skeleton';

// Localization

import { useLangTranslation } from '@/lib/context/global/language.context';

const BankDetails = ({ loading, rider }: IRiderDetailsProps) => {

  const { getTranslation } = useLangTranslation();

  return (
    <div className="flex flex-col gap-2 border rounded-lg overflow-hidden">
      <header className="bg-[#F4F4F5] px-6 py-3 border-b-[1px] text-lg font-medium">
        {getTranslation('bank_details')}
      </header>

      {/* columns */}
      <div className="grid grid-cols-2 py-5 px-6">
        {/* left-column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('bank_name')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.bankName ?? '-')
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('account_name')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountName ?? '-')
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">
              {getTranslation('bsb_iban_swift_code')}
            </span>
            <span className="font-medium ">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountCode ?? '-')
              )}
            </span>
          </div>
        </div>

        {/* right-column */}
        <div className="flex pl-5 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('account_name')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountName ?? '-')
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{getTranslation('account_number')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountNumber ?? '-')
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
