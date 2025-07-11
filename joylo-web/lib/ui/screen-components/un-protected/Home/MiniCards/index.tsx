import HomeMiniCard from '@/lib/ui/useable-components/Home-miniCard'
import React from 'react'
import { useLangTranslation } from '@/lib/context/global/language.context'

const MiniCards:React.FC = () => {
  const { getTranslation } = useLangTranslation();
  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-sols-4 gap-8 mt-[30px] mb-[30px]'>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/2alPBNdBAcXwckvXjbjWvH/542aac95909dbaa25b9774eb0e092860/3DLivingroom.png?w=960&q=90&fm=webp"} heading={getTranslation("boost_your_sales_heading")} subText={getTranslation("boost_your_sales_subtext")} backColor={"#fff0ee"} headingColor={"#cb5965"}/>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/62XiVYgUMckBTyPl11EVgw/9a0abac47bbd4f788800df7c3bc7c705/3DCouriers.png?w=960&q=90&fm=webp"} heading={getTranslation("we_do_the_heavy_lifting_heading")} subText={getTranslation("we_do_the_heavy_lifting_subtext")} backColor={"#eaf7fc"} headingColor={"#009de0"}/>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/GWTxYReIUvlZ9CqqZVYi2/2c47a3b3d47030e1dd4c9c498c3bc189/3DYuhoRainjacket.png?w=960&q=90&fm=webp"} heading={getTranslation("its_100_percent_risk_free_heading")} subText={getTranslation("its_100_percent_risk_free_subtext")} backColor={"#fff9ef"} headingColor={"#c68000"}/>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/7cXP59KeAyDH1RT7fIi39K/620cc38c08a8a8232bcf0e2db1f15a44/WoltDriveIllustration.png?w=960&q=90&fm=webp"} heading={getTranslation("power_online_sales_with_same_hour_deliveries_heading")} subText={getTranslation("power_online_sales_with_same_hour_deliveries_subtext")} backColor={"#f0faef"} headingColor={"#1dc707"}/>
      </div>
    </div>
  )
}

export default MiniCards
