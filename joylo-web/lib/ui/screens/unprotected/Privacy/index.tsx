"use client"
import React from "react";
import { useLangTranslation } from "@/lib/context/global/language.context";
import Image from "next/image";
import Heading from "@/lib/ui/screen-components/un-protected/TermsConditions/Heading";
import Paragraph from "@/lib/ui/screen-components/un-protected/TermsConditions/Para";

const Privacy = () => {
    const { getTranslation } = useLangTranslation();
    return (
        <div>
            <div className="relative w-screen h-[400px]">
                <Image
                    alt="image"
                    src="https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=2000&height=500"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
                        {getTranslation("joylo_privacy_policy")}
                    </h1>
                </div>
            </div>

            <div className="w-[90%] mx-auto my-12">
                <Paragraph paragraph={getTranslation("privacy_policy_intro")} />
                <Heading
                    heading={getTranslation(
                        "what_information_we_collect_about_you"
                    )}
                />

                <Paragraph
                    paragraph={getTranslation("privacy_policy_collect_info")}
                />
                <Heading
                    heading={getTranslation("cookies_and_google_analytics")}
                />

                <Paragraph
                    paragraph={getTranslation(
                        "privacy_policy_cookies_explanation"
                    )}
                />
                <Paragraph
                    paragraph={getTranslation(
                        "privacy_policy_google_analytics_explanation"
                    )}
                />
                <Paragraph
                    paragraph={getTranslation("privacy_policy_cookies_control")}
                />

                <Heading
                    heading={getTranslation(
                        "how_will_we_use_the_information_we_collect_from_you"
                    )}
                />
                <Paragraph
                    paragraph={getTranslation("privacy_policy_use_of_info")}
                />

                <Heading
                    heading={getTranslation("access_to_your_information")}
                />
                <Paragraph
                    paragraph={getTranslation("privacy_policy_access_info")}
                />

                <Heading heading={getTranslation("other_websites")} />
                <Paragraph
                    paragraph={getTranslation("privacy_policy_other_websites")}
                />
            </div>
        </div>
    );
};

export default Privacy;
