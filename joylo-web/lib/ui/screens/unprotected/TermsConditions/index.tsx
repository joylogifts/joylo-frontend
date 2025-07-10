"use client";

import React from "react";

import Image from "next/image";
import OnePara from "@/lib/ui/screen-components/un-protected/TermsConditions/OnePara";
import { useLangTranslation } from "@/lib/context/global/language.context";

const TermsConditions = () => {
    const { getTranslation } = useLangTranslation()
    const ParasData = [
        {
            number: "1.",
            head: getTranslation("terms_of_use"),
            paras: [
                getTranslation("terms_paragraph_1_1"),
                getTranslation("terms_paragraph_1_2"),
                getTranslation("terms_paragraph_1_3"),
                getTranslation("terms_paragraph_1_4"),
            ],
        },
        {
            number: "2.",
            head: getTranslation("use_of_platforms_and_account"),
            paras: [
                getTranslation("terms_paragraph_2_1"),
                getTranslation("terms_paragraph_2_2"),
                getTranslation("terms_paragraph_2_3"),
                getTranslation("terms_paragraph_2_4"),
            ],
        },
        {
            number: "3.",
            head: getTranslation("intellectual_property"),
            paras: [
                getTranslation("terms_paragraph_3_1"),
            ],
        },
        {
            number: "4. ",
            head: getTranslation("vendor_liability"),
            paras: [
                getTranslation("terms_paragraph_4_1"),
            ],
        },
        {
            number: "5.",
            head: getTranslation("personal_data_protection"),
            paras: [
                getTranslation("terms_paragraph_5_1"),
            ],
        },
        {
            number: "6.",
            head: getTranslation("indemnity"),
            paras: [
                getTranslation("terms_paragraph_6_1"),
            ],
        },
        {
            number: "7.",
            head: getTranslation("third_party_links_and_websites"),
            paras: [
                getTranslation("terms_paragraph_7_1"),
            ],
        },
        {
            number: "8.",
            head: getTranslation("termination"),
            paras: [
                getTranslation("terms_paragraph_8_1"),
            ],
        },
        {
            number: "9.",
            head: getTranslation("amendments"),
            paras: [
                getTranslation("terms_paragraph_9_1"),
            ],
        },
        {
            number: "10.",
            head: getTranslation("severability"),
            paras: [
                getTranslation("terms_paragraph_10_1"),
            ],
        },
        {
            number: "11.",
            head: getTranslation("governing_law"),
            paras: [
                getTranslation("terms_paragraph_11_1"),
            ],
        },
        {
            number: "12.",
            head: getTranslation("contact_us"),
            paras: [
                getTranslation("terms_paragraph_12_1"),
            ],
        },
        {
            number: "13.",
            head: getTranslation("prevailing_language"),
            paras: [
                getTranslation("terms_paragraph_13_1"),
            ],
        },
    ];

    const ListDatas = [
        {
            number: "14.",
            head: getTranslation("restrictions"),
            paras: [],
            list: [
                {
                    text: getTranslation("list_14_1"),
                    subList: [],
                },
                {
                    text: getTranslation("list_14_2"),
                    subList: [],
                },
            ],
        },

        {
            number: "15.",
            head: getTranslation("joylo"),
            paras: [
                getTranslation("list_15_1"),
            ],
            list: [
                { text: getTranslation("list_15_1_item_1"), subList: [] },
                { text: getTranslation("list_15_1_item_2"), subList: [] },
                { text: getTranslation("list_15_1_item_3"), subList: [] },
                { text: getTranslation("list_15_1_item_4"), subList: [] },
                { text: getTranslation("list_15_1_item_5"), subList: [] },
                { text: getTranslation("list_15_1_item_6"), subList: [] },
                { text: getTranslation("list_15_1_item_7"), subList: [] },
                { text: getTranslation("list_15_1_item_8"), subList: [] },
                { text: getTranslation("list_15_1_item_9"), subList: [] },
                { text: getTranslation("list_15_1_item_10"), subList: [] },
                { text: getTranslation("list_15_1_item_11"), subList: [] },
                { text: getTranslation("list_15_1_item_12"), subList: [] },
                { text: getTranslation("list_15_1_item_13"), subList: [] },
                { text: getTranslation("list_15_1_item_14"), subList: [] },
                { text: getTranslation("list_15_1_item_15"), subList: [] },
                { text: getTranslation("list_15_1_item_16"), subList: [] },
                { text: getTranslation("list_15_1_item_17"), subList: [] },
                { text: getTranslation("list_15_1_item_18"), subList: [] },
            ],
        },

        {
            number: "16.",
            head: getTranslation("restrictions_on_goods"),
            paras: [getTranslation("list_16_1")],
            list: [
                { text: getTranslation("list_16_1_item_1"), subList: [] },
                { text: getTranslation("list_16_1_item_2"), subList: [] },
                { text: getTranslation("list_16_1_item_3"), subList: [] },
                { text: getTranslation("list_16_1_item_4"), subList: [] },
                { text: getTranslation("list_16_1_item_5"), subList: [] },
                {
                    text: getTranslation("list_16_1_item_6"), subList: [
                        getTranslation("list_16_1_item_6_sub_1"),
                        getTranslation("list_16_1_item_6_sub_2")
                    ]
                },
                { text: getTranslation("list_16_1_item_7"), subList: [] },
            ],
        },

        {
            number: "17.",
            head: getTranslation("orders"),
            paras: [getTranslation("list_17_1")],
            list: [
                { text: getTranslation("list_17_1_item_1"), subList: [] },
                { text: getTranslation("list_17_1_item_2"), subList: [] },
                { text: getTranslation("list_17_1_item_3"), subList: [] },
                { text: getTranslation("list_17_1_item_4"), subList: [] },
            ],
        },

        {
            number: "18.",
            head: getTranslation("prices_and_payments"),
            paras: [
                getTranslation("list_18_1"),
                getTranslation("list_18_2"),
                getTranslation("list_18_3"),
                getTranslation("list_18_4"),
            ],
            list: [
                { text: getTranslation("list_18_1_item_1") },
                { text: getTranslation("list_18_1_item_2") },
                { text: getTranslation("list_18_1_item_3") },
                { text: getTranslation("list_18_1_item_4") },
                { text: getTranslation("list_18_1_item_5") },
                { text: getTranslation("list_18_1_item_6") },
                { text: getTranslation("list_18_1_item_7") },
                { text: getTranslation("list_18_1_item_8") },
                { text: getTranslation("list_18_1_item_9") },
                { text: getTranslation("list_18_1_item_10") },
            ],
        },
        {
            number: "19.",
            head: getTranslation("delivery_pickup_vendor_delivery"),
            paras: [
                getTranslation("list_19_1"),
                getTranslation("list_19_2"),
                getTranslation("list_19_3"),
                getTranslation("list_19_4"),
                getTranslation("list_19_5"),
            ],
            list: [
                { text: getTranslation("list_19_1_item_1") },
                { text: getTranslation("list_19_1_item_2") },
                { text: getTranslation("list_19_1_item_3") },
                { text: getTranslation("list_19_1_item_4") },
                { text: getTranslation("list_19_1_item_5") },
                { text: getTranslation("list_19_1_item_6") },
                { text: getTranslation("list_19_1_item_7") },
                { text: getTranslation("list_19_1_item_8") },
                { text: getTranslation("list_19_1_item_9") },
                { text: getTranslation("list_19_1_item_10") },
                { text: getTranslation("list_19_1_item_11") },
                { text: getTranslation("list_19_1_item_12") },
            ],
        },
        {
            number: "20.",
            head: getTranslation("vouchers_discounts_promotions"),
            paras: [
                getTranslation("list_20_1"),
            ],
            list: [
                { text: getTranslation("list_20_1_item_1") },
                { text: getTranslation("list_20_1_item_2") },
                { text: getTranslation("list_20_1_item_3") },
                { text: getTranslation("list_20_1_item_4") },
                { text: getTranslation("list_20_1_item_5") },
            ],
        },

        {
            number: "20.",
            head: getTranslation("representations_warranties_limitations"),
            paras: [
                getTranslation("terms_paragraph_20_1"),
                getTranslation("terms_paragraph_20_2"),
                getTranslation("terms_paragraph_20_3"),
            ],
            list: [],
        },
    ];

    return (
        <div>
            <div className="relative w-screen h-[400px]">
                <Image
                    alt={getTranslation("terms_conditions_banner_alt")}
                    src="https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=2000&height=500"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
                        {getTranslation("joylo_terms_and_conditions")}
                    </h1>
                </div>
            </div>

            <div className="w-[90%] mx-auto">
                {ParasData?.map((item) => {
                    return <OnePara Para={item} key={item.head} />;
                })}
                {ListDatas?.map((item) => {
                    return <OnePara Para={item} key={item.head} />;
                })}
            </div>
        </div>
    );
};

export default TermsConditions;
