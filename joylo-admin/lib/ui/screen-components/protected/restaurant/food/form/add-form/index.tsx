'use client';

// Core imports
import { useContext, useRef } from 'react';

// PrimeReact components
import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';

// Interfaces
import { IFoodAddFormComponentProps } from '@/lib/utils/interfaces';

// Components
import FoodDetails from './food.index';
import VariationAddForm from './variations';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

const FoodForm = ({ position = 'right' }: IFoodAddFormComponentProps) => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Ref
  const stepperRef = useRef(null);

  // Context
  const {
    activeIndex,
    isFoodFormVisible,
    onClearFoodData,
    onActiveStepChange,
  } = useContext(FoodsContext);

  // Handlers
  const onHandleStepChange = (order: number) => {
    onActiveStepChange(order);
  };

  const onSidebarHideHandler = () => {
    onClearFoodData();
  };

  return (
    <Sidebar
      visible={isFoodFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px]"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header={getTranslation('add_product')}>
            <FoodDetails
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
              isFoodFormVisible={isFoodFormVisible}
            />
          </StepperPanel>
          <StepperPanel header={getTranslation('add_variations')}>
            <VariationAddForm
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
        </Stepper>
      </div>
    </Sidebar>
  );
};

export default FoodForm;
