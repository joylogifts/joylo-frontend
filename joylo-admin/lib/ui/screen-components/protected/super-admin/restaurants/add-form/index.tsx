'use client';

// Core imports
import { useContext, useMemo, useRef } from 'react';

// API and GraphQL
import { GET_VENDORS } from '@/lib/api/graphql';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';

// Context
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

// Interfaces
import {
  IQueryResult,
  IRestaurantsAddFormComponentProps,
  IRestaurantsContextPropData,
  IVendorReponse,
  IVendorResponseGraphQL,
} from '@/lib/utils/interfaces';

// PrimeReact components
import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

// Local components
import RestaurantDetailsForm from './restaurant-details';
import RestaurantLocation from './restaurant-location';
import VendorDetails from './vendor-details';
import RestaurantTiming from './restaurant-timing';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

const RestaurantsForm = ({
  position = 'right',
}: IRestaurantsAddFormComponentProps) => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Ref
  const stepperRef = useRef(null);

  // Context
  const {
    isRestaurantsFormVisible,
    onRestaurantsFormVisible,
    activeIndex,
    onActiveStepChange,
    onSetRestaurantsContextData,
  } = useContext(RestaurantsContext);

  // API
  const vendorResponse = useQueryGQL(
    GET_VENDORS,
    { fetchPolicy: 'network-only' },
    {
      debounceMs: 300,
    }
  ) as IQueryResult<IVendorResponseGraphQL | undefined, undefined>;

  // Memoized Data
  const vendorsDropdown = useMemo(
    () =>
      vendorResponse?.data?.vendors?.map((vendorItem: IVendorReponse) => {
        return { label: vendorItem.email, code: vendorItem._id };
      }),
    [vendorResponse?.data?.vendors]
  );

  // Handlers
  const onHandleStepChange = (order: number) => {
    onActiveStepChange(order);
  };
  const onSidebarHideHandler = () => {
    // Clean Context State
    onActiveStepChange(0);
    onRestaurantsFormVisible(false);
    onSetRestaurantsContextData({} as IRestaurantsContextPropData);
  };

  // Use Effect

  return (
    <Sidebar
      visible={isRestaurantsFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px]"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header={getTranslation('set_vendor')}>
            <VendorDetails
              vendorsDropdown={vendorsDropdown ?? []}
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
          <StepperPanel header={getTranslation('add_details')}>
            <RestaurantDetailsForm
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
          <StepperPanel header={getTranslation('location')}>
            <RestaurantLocation
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
                isLastStep: true,
              }}
            />
          </StepperPanel>
          <StepperPanel header={getTranslation('timing')}>
            <RestaurantTiming
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
                isLastStep: true,
              }}
            />
          </StepperPanel>
        </Stepper>
      </div>
    </Sidebar>
  );
};

export default RestaurantsForm;
