import React, { useContext } from 'react';
import { ProfileLogoSVG } from '@/lib/utils/assets/svgs/profile';
import { IInfoItemProps } from '@/lib/utils/interfaces/profile/restaurant.profile.interface';
import { Avatar } from 'primereact/avatar';
import { ProfileContext } from '@/lib/context/restaurant/profile.context';
import RestaurantProfileSkeleton from '@/lib/ui/useable-components/custom-skeletons/restaurant.profile.skeleton';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useLangTranslation } from '@/lib/context/global/language.context';

const RestaurantMain: React.FC = () => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  // Context
  const { restaurantProfileResponse } = useContext(ProfileContext);
  const restaurant = restaurantProfileResponse?.data?.restaurant;

  if (restaurantProfileResponse.loading) return <RestaurantProfileSkeleton />;

  const InfoItem: React.FC<IInfoItemProps> = ({ label, value }) => {
    // Conditionally render icons based on label
    let icon = null;
    if (label === getTranslation('delivery_time')) {
      icon = <FontAwesomeIcon icon={faClock} className="mr-1" />;
    } else if (
      label === getTranslation('service_charges') ||
      label === getTranslation('min_order')
    ) {
      icon = <FontAwesomeIcon icon={faDollarSign} className="mr-1" />;
    }
    return (
      <div>
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        <p className="font-medium">
          {icon}
          {value || 'N/A'}
        </p>
      </div>
    );
  };
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="bg-white p-8 w-full border-2 border-dotted rounded border-inherit">
        <div className="flex items-center mb-6">
          <ProfileLogoSVG width="55" height="55" strokeColor="#1E1E1E" />
          <div className="ml-2">
            <h1 className="text-xs text-gray-500">
              {getTranslation('store_name')}
            </h1>
            <h2 className="text-2xl font-bold">{restaurant?.name || 'N/A'}</h2>
          </div>
        </div>
        <hr className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem
            label={getTranslation('email')}
            value={restaurant?.username}
          />
          <InfoItem
            label={getTranslation('password')}
            value={restaurant?.password}
          />
          <div className="md:row-span-4">
            <p className="text-xs text-gray-500 mb-4">{getTranslation('images')}</p>
            <div className="flex space-x-2">
              {restaurant?.image ? (
                <Image
                  src={restaurant?.image}
                  alt={getTranslation('store_logo')}
                  className="object-cover rounded"
                  width={96}
                  height={96}
                />
              ) : (
                <Avatar label="I" className="w-24 h-24" />
              )}
              {restaurant?.logo ? (
                <Image
                  src={restaurant?.logo}
                  alt={getTranslation('store_logo')}
                  className="object-cover rounded"
                  width={96}
                  height={96}
                />
              ) : (
                <Avatar label="L" className="w-24 h-24" />
              )}
            </div>
          </div>
          <InfoItem label={getTranslation('name')} value={restaurant?.name} />
          <InfoItem label={getTranslation('address')} value={restaurant?.address} />
          <InfoItem
            label={getTranslation('delivery_time')}
            value={restaurant?.deliveryTime?.toString()}
          />
          <InfoItem
            label={getTranslation('min_order')}
            value={restaurant?.minimumOrder?.toString()}
          />
          <InfoItem
            label={getTranslation('service_charges')}
            value={restaurant?.tax?.toString()}
          />
          <InfoItem label={getTranslation('order_prefix')} value={restaurant?.orderPrefix} />
          <InfoItem label={getTranslation('shop_category')} value={restaurant?.shopType} />
          <InfoItem label={getTranslation('phone')} value={restaurant?.phone} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantMain;
