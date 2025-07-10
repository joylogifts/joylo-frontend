"use client";
import { useLangTranslation } from "@/lib/context/global/language.context";
import AppLinks from "@/lib/ui/useable-components/Footer/AppLinks";
import FooterLinks from "@/lib/ui/useable-components/Footer/FooterLinks";


import { usePathname } from "next/navigation";

const AppFooter = () => {
    const { getTranslation } = useLangTranslation();

    const partnerWithEnatega = {
        title: getTranslation("partner_with_joylo_title"),
        links: [
            { label: getTranslation("home_label"), link: "/", internal: true },
            {
                label: getTranslation("for_riders_heading"),
                link: "/rider",
                internal: true,
            },
            {
                label: getTranslation("for_restaurants_btn"),
                link: "/restaurantInfo",
                internal: true,
            },
        ],
    };

    const products = {
        title: getTranslation("products_title"),
        links: [
            {
                label: getTranslation("joylo_rider_label"),
                link: "https://play.google.com/store/apps/details?id=com.enatega.multirider&hl=en",
                internal: false,
            },
            {
                label: getTranslation("joylo_restaurant_label"),
                link: "https://play.google.com/store/apps/details?id=multivendor.enatega.restaurant&hl=en",
                internal: false,
            },
        ],
    };

    const usefulLinks = {
        title: getTranslation("company_title"),
        links: [
            {
                label: getTranslation("about_us_label"),
                link: "https://ninjascode.com/",
                internal: false,
            },
            {
                label: getTranslation("terms_conditions_label"),
                link: "/terms",
                internal: true,
            },
            {
                label: getTranslation("privacy_policy_label"),
                link: "/privacy",
                internal: true,
            },
            {
                label: getTranslation("contact_label"),
                link: "https://ninjascode.com/",
                internal: false,
            },
            {
                label: getTranslation("developers_label"),
                link: "https://ninjascode.com/",
                internal: false,
            },
        ],
    };

    const followUs = {
        title: getTranslation("follow_us_title"),
        links: [
            {
                label: getTranslation("blog_label"),
                link: "https://ninjascode.com/blog",
                internal: false,
            },
            {
                label: getTranslation("instagram_label"),
                link: "https://www.instagram.com/ninjascodeofficial?igsh=ajFoeGxud3FqYnd3",
                internal: false,
            },
            {
                label: getTranslation("facebook_label"),
                link: "https://www.facebook.com/enatega/",
                internal: false,
            },
            {
                label: getTranslation("linkedin_label"),
                link: "https://www.linkedin.com/company/enatega/?originalSubdomain=pk",
                internal: false,
            },
        ],
    };

    const pathname = usePathname();
    const isDiscoveryPage =
        pathname?.endsWith("/restaurants") ||
        pathname?.endsWith("/discovery") ||
        pathname?.endsWith("/store");

    return (
        <div
            className={`"w-full h-auto bg-[#141414] flex items-center justify-center ${isDiscoveryPage ? "md:pb-0 pb-20" : ""}`}
        >
            <div className=" mx-auto my-[30px]  md:mt-[60px] md:mb-[60px] p-4  flex md:items-center md:justify-center flex-col ">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-screen md:w-full md:px-0 px-4  ">
                    <div className="p-2">
                        <AppLinks />
                    </div>
                    <div className="p-2">
                        <FooterLinks section={partnerWithEnatega} />
                    </div>
                    <div className="p-2">
                        <FooterLinks section={products} />
                    </div>
                    <div className="p-2">
                        <FooterLinks section={usefulLinks} />
                    </div>
                    <div className="p-2">
                        <FooterLinks section={followUs} />
                    </div>
                </div>
            </div>
        </div>
    );
};

AppFooter.displayName = "AppFooter";

export default AppFooter;
