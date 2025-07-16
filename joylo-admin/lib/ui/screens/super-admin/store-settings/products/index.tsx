import { useLangTranslation } from "@/lib/context/global/language.context";
import ProductsTable from "@/lib/ui/screen-components/protected/super-admin/products/ProductsTable";
import ProductsTabs from "@/lib/ui/screen-components/protected/super-admin/products/ProductsTabs";
import HeaderText from "@/lib/ui/useable-components/header-text";
import { useSearchParams } from "next/navigation";


type TabKey = 'pending' | 'approved' | 'rejected';

export default function Products() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('activeTab') as TabKey || 'pending';
  
    // Hooks
  const {getTranslation}= useLangTranslation();

    return (
        <div className="screen-container">
            <div className="flex w-full justify-between mt-4">
                <HeaderText className="heading" text={getTranslation('products')} />
            </div>
            <div>
                <ProductsTabs />

                <div className="">
                    <ProductsTable status={activeTab} />
                </div>
            </div>
        </div>
    )

}