// libraries
import React from 'react'
import { useLangTranslation } from '@/lib/context/global/language.context'

// component
import MoveableCard from '@/lib/ui/useable-components/Moveable-Card'
import TranparentButton from '@/lib/ui/useable-components/Home-Buttons/TranparentButton'

//images 
import Banner3 from '@/public/assets/images/png/Banner3.webp'

const GrowBussiness:React.FC = () => {
  const { getTranslation } = useLangTranslation();
  const growButon=<TranparentButton text={getTranslation("get_started_btn")} link='restaurantInfo'/>

  return (
    <div className='w-full'>
        <MoveableCard 
        image={Banner3}
        heading={getTranslation("for_restaurants_and_stores_heading")}
        subText={getTranslation("lets_grow_your_business_together")}
        middle={true}
        button={growButon}
        />
    </div>
  )
}

export default GrowBussiness
