// Core
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Third-party libraries
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ApolloError, useMutation } from '@apollo/client';
import { Avatar } from 'primereact/avatar';

// Icons
import {
  faLocationDot,
  faStore,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { IRestaurantCardProps } from '@/lib/utils/interfaces';

// Methods
import { onUseLocalStorage } from '@/lib/utils/methods';

// GraphQL
import { DELETE_RESTAURANT, HARD_DELETE_RESTAURANT } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { RestaurantContext } from '@/lib/context/super-admin/restaurant.context';
import { ConfigurationContext } from '@/lib/context/global/configuration.context';

// Components
import CustomButton from '../button';
import CustomInputSwitch from '../custom-input-switch';
import TextComponent from '../text-field';
import CustomLoader from '../custom-progress-indicator';
import { CarSVG } from '@/lib/utils/assets/svgs/Car';
import { FrameSVG } from '@/lib/utils/assets/svgs/Frame';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function RestaurantCard({ restaurant }: IRestaurantCardProps) {
  // Props
  const {
    _id,
    name,
    image,
    address,
    shopType,
    isActive,
    unique_restaurant_id,
  } = restaurant;

  const configuration = useContext(ConfigurationContext);
  // Hooks

  const { getTranslation } = useLangTranslation();
  const { showToast } = useContext(ToastContext);

  if (!configuration) {
    throw new Error(
      getTranslation('cannot_get_the_value_of_the_configuration_context')
    );
  }

  const { deliveryRate, isPaidVersion } = configuration;

  const {
    restaurantByOwnerResponse,
    isRestaurantModifed,
    setRestaurantModifed,
  } = useContext(RestaurantContext);

  // Hooks
  const router = useRouter();

  // API
  const [hardDeleteRestaurant, { loading: isHardDeleting }] = useMutation(
    HARD_DELETE_RESTAURANT,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: getTranslation('store_delete'),
          message: `${getTranslation('store_has_been_deleted_successfully')}.`,
          duration: 2000,
        });
        restaurantByOwnerResponse.refetch();
      },
      onError: ({ networkError, graphQLErrors }: ApolloError) => {
        showToast({
          type: 'error',
          title: getTranslation('store_delete'),
          message:
            graphQLErrors[0]?.message ??
            networkError?.message ??
            getTranslation(`store_delete_failed`),
          duration: 2500,
        });
      },
    }
  );
  const [deleteRestaurant, { loading }] = useMutation(DELETE_RESTAURANT, {
    onCompleted: () => {
      showToast({
        type: 'success',
        title: getTranslation('store_delete_failed'),
        message: `${getTranslation('store_has_been_marked_as')} ${isActive ? getTranslation('active') : getTranslation('in-active')}`,
        duration: 2000,
      });
      setRestaurantModifed(!isRestaurantModifed);
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: getTranslation('store_status'),
        message:
          graphQLErrors[0]?.message ??
          networkError?.message ??
          `${getTranslation('store_has_been_marked_as')} ${isActive ? getTranslation('active') : getTranslation('in-active')} ${getTranslation('failed')}`,
        duration: 2500,
      });
    },
  });

  // Handle checkbox change
  const handleCheckboxChange = async () => {
    try {
      await deleteRestaurant({ variables: { id: _id } });
    } catch (err) {
      console.log({ err });
    }
  };

  const handleDelete = async () => {
    if (isPaidVersion) {
      hardDeleteRestaurant({ variables: { id: _id } });
    } else {
      showToast({
        type: 'error',
        title: getTranslation('you_are_using_free_version'),
        message: getTranslation(
          'this_feature_is_only_available_in_paid_version'
        ),
      });
    }
  };

  return (
    <div className="flex flex-col rounded-lg border-2 border-[#F4F4F5] bg-white shadow-md">
      <div className="mb-4 flex items-center rounded-t-lg bg-gray-200 p-4">
        {image ? (
          <Image
            src={image}
            alt={getTranslation('store_logo')}
            className="mr-3 h-10 w-10 flex-shrink-0 rounded-full"
            width={40}
            height={40}
          />
        ) : (
          <Avatar
            icon={<FontAwesomeIcon icon={faStore} />}
            className="mr-3"
            size="large"
            shape="circle"
          />
        )}
        <div className="min-w-0 flex-grow">
          <TextComponent className={`card-h2 truncate`} text={name} />
          <TextComponent
            className={`card-h3 truncate text-gray-500`}
            text={unique_restaurant_id}
          />
          <TextComponent
            className={`card-h3 truncate text-gray-500`}
            text={shopType}
          />
        </div>
        <div className="flex space-x-2">
          <CustomInputSwitch
            loading={loading}
            isActive={isActive}
            onChange={handleCheckboxChange}
          />
          {isHardDeleting ? (
            <CustomLoader size="20px" />
          ) : (
            <FontAwesomeIcon
              icon={faTrash}
              className="cursor-pointer"
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
      <div className="mb-4 flex items-center gap-x-2 truncate px-4 text-sm text-gray-500">
        <FontAwesomeIcon icon={faLocationDot} />

        <TextComponent
          className={`card-h2 truncate text-gray-500`}
          text={address}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-2 px-2 sm:grid sm:grid-cols-2 sm:gap-4 lg:flex">
        {/* Delivery Time */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-1 mb-2 text-sm">
          <FrameSVG width="24" height="24" />
          <span>
            {restaurant?.deliveryTime} {getTranslation('min')}
          </span>
        </div>

        {/* Delivery Fee */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-1 mb-2 text-sm">
          <CarSVG width="24" height="24" />
          <span>
            {'₪'} {deliveryRate}
          </span>
        </div>

        {/* Minimum Order */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 p-2 mb-2 text-sm">
          <span>{getTranslation('min_order')}</span>
          <span>
            {'₪'} {restaurant?.minimumOrder}
          </span>
        </div>
      </div>
      <div className="mb-2 px-4">
        <CustomButton
          className="h-10 w-full bg-[#EBEDE6] text-black"
          label={getTranslation('view_details')}
          onClick={() => {
            onUseLocalStorage('save', 'restaurantId', _id);
            onUseLocalStorage('save', 'shopType', shopType);
            const routeStack = ['Admin'];
            onUseLocalStorage('save', 'routeStack', JSON.stringify(routeStack));
            router.push(`/admin/store/`);
          }}
        />
      </div>
    </div>
  );
}
