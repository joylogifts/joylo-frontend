"use client"
import { useLangTranslation } from '@/lib/context/global/language.context'
import CustomButton from '@/lib/ui/useable-components/button'
import TextComponent from '@/lib/ui/useable-components/text-field'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileHeader() {
  const { getTranslation } = useLangTranslation()
  const router = useRouter();
  return (
    <div className='w-full flex justify-between'>
      <TextComponent text="Profile" className='font-semibold md:text-3xl text-xl' />
      <CustomButton onClick={() => router.push("/profile/getHelp")} label={getTranslation('get_help_label')} type='button' className='text-base font-light bg-[#FFDBBB] px-[16px] py-[8px] text-[#FFA500]' />
    </div>
  )
}
