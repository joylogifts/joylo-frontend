"use client";
import { useLangTranslation } from "@/lib/context/global/language.context";
import React, { useState } from "react";
import Image from "next/image";
import { IOrderTrackingDetail } from "@/lib/utils/interfaces/order-tracking-detail.interface";
import CancelOrderModal from "./cancelOrderModal";
import CancelOrderSuccessModal from "./cancel-order-success-modal";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { useConfig } from "@/lib/context/configuration/configuration.context";

function TrackingOrderDetails({
    orderTrackingDetails,
}: {
    orderTrackingDetails: IOrderTrackingDetail;
}) {
    const { getTranslation, selectedLanguage } = useLangTranslation();
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [setshowCancelOrderSuccessModal, setSetshowCancelOrderSuccessModal] =
        useState(
            orderTrackingDetails?.orderStatus === "CANCELLED" ? true : false
        );
    const { CURRENCY_SYMBOL } = useConfig();
    // Format currency values
    const formatCurrency = (amount: number) => {
        return `${CURRENCY_SYMBOL}${amount?.toFixed(2) || "0.00"}`;
    };

    // set orderTrackingDetails.restaurant._id in local storage
    const restaurantId = orderTrackingDetails?.restaurant?._id;
    if (restaurantId) {
        onUseLocalStorage("save", "orderTrackingRestaurantId", restaurantId);
    }

    // Calculate subtotal (items only)
    const calculateSubtotal = () => {
        if (!orderTrackingDetails?.items) return 0;

        return orderTrackingDetails?.items.reduce((total, item) => {
            return total + item?.variation?.price * item?.quantity;
        }, 0);
    };

    // Calculate total
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const deliveryCharge = orderTrackingDetails?.deliveryCharges || 0;
        const tax = orderTrackingDetails?.taxationAmount || 0;
        const tip = orderTrackingDetails?.tipping || 0;

        return subtotal + deliveryCharge + tax + tip;
    };

    // Check if order can be cancelled (only PENDING or ACCEPTED)
    const canCancelOrder = () => {
        const cancellableStatuses = ["PENDING"];
        return cancellableStatuses.includes(orderTrackingDetails?.orderStatus);
    };

    if (!orderTrackingDetails) {
        return (
            <div className="mt-8 p-4 text-center">
                {getTranslation("loading_order_details_text")}
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-6 flex-1 max-w-2xl md:w-auto w-full md:px-0 px-4">
            <div>
                <div className="flex flex-col mb-2 md:mb-4">
                    <h1 className="text-lg font-semibold">
                        {orderTrackingDetails?.restaurant?.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <h1>Order # </h1>
                        <h1 className="text-blue-600">
                            {orderTrackingDetails?.orderId}
                        </h1>
                    </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                    {getTranslation("order_details_heading")}
                </h3>

                {/* Display each food item under Order Details */}
                {orderTrackingDetails?.items?.map((item, index) => (
                    <div
                        key={item?._id || index}
                        className="flex items-center justify-between mb-4 pb-4 border-b"
                    >
                        <div className="flex gap-4 items-center">
                            <Image
                                src={
                                    item?.image ||
                                    "https://storage.googleapis.com/a1aa/image/placeholder-food.jpg"
                                }
                                alt={typeof item?.title === "object" ? item?.title[selectedLanguage] : item?.title}
                                width={80}
                                height={80}
                                className="rounded-lg"
                            />
                            <div>
                                <p className="font-medium text-gray-900">
                                    {typeof item?.title === "object" ? item?.title[selectedLanguage] : item?.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                   {typeof item?.variation?.title === "object" ? item?.variation?.title[selectedLanguage] : item?.variation?.title}
                                    <br />
                                    {(() => {
                                        const desc = typeof item?.description === "object"
                                            ? item?.description?.[selectedLanguage]
                                            : item?.description;
                                        if (typeof desc === "string") {
                                            return desc.length > 50
                                                ? desc.substring(0, 50) + "..."
                                                : desc;
                                        }
                                        return "";
                                    })()}
                                </p>

                                {/* Display addons */}
                                {item?.addons && item?.addons?.length > 0 && (
                                    <div className="mt-1">
                                        {item?.addons?.map(
                                            (addon, addonIndex) => (
                                                <div
                                                    key={
                                                        addon._id || addonIndex
                                                    }
                                                >
                                                    {addon?.options?.map(
                                                        (option, optIndex) => (
                                                            <p
                                                                key={
                                                                    option._id ||
                                                                    optIndex
                                                                }
                                                                className="text-xs text-gray-500"
                                                            >
                                                                + {typeof option?.title === "object" ? option?.title[selectedLanguage] : option?.title}
                                                                {option?.price >
                                                                    0
                                                                    ? ` (${formatCurrency(option?.price)})`
                                                                    : ""}
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="text-blue-600 font-semibold">
                            {formatCurrency(item?.variation?.price)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Items Summary */}
            <div>
                <h3 className="text-lg font-semibold mb-4">
                    {getTranslation("order_details_summary_label")} (
                    {orderTrackingDetails?.items?.length || 0}{" "}
                    {getTranslation("order_details_items_label")})
                </h3>
                <div className="text-sm text-gray-700 space-y-3">
                    {/* Display each item with quantity and price */}
                    {orderTrackingDetails?.items?.map((item, idx) => (
                        <div
                            key={`summary-${item._id || idx}`}
                            className="flex justify-between"
                        >
                            <span>
                                {item?.quantity}x {typeof item?.title === "object" ? item?.title[selectedLanguage] : item?.title}
                            </span>
                            <span>
                                {formatCurrency(
                                    item?.variation?.price * item?.quantity
                                )}
                            </span>
                        </div>
                    ))}

                    {/* Subtotal and charges */}
                    <div className="flex justify-between pt-2 border-t">
                        <span>
                            {getTranslation("order_details_subtotal_label")}
                        </span>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>

                    {orderTrackingDetails.taxationAmount > 0 && (
                        <div className="flex justify-between">
                            <span>
                                {getTranslation("order_details_tax_label")}
                            </span>
                            <span>
                                {formatCurrency(
                                    orderTrackingDetails.taxationAmount
                                )}
                            </span>
                        </div>
                    )}

                    {orderTrackingDetails.tipping > 0 && (
                        <div className="flex justify-between">
                            <span>
                                {getTranslation("order_details_tip_label")}
                            </span>
                            <span>
                                {formatCurrency(orderTrackingDetails.tipping)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span>
                            {getTranslation(
                                "order_details_delivery_charge_label"
                            )}
                        </span>
                        <span>
                            {formatCurrency(
                                orderTrackingDetails.deliveryCharges || 0
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>
                            {getTranslation("order_details_total_label")}
                        </span>
                        <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div className="border rounded-md p-4">
                <h4 className="font-semibold mb-2">
                    {getTranslation("order_details_paid_with_label")}
                </h4>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">
                        {orderTrackingDetails.paymentMethod === "COD"
                            ? "💵"
                            : "💳"}
                    </span>
                    <span>
                        {orderTrackingDetails.paymentMethod === "COD"
                            ? getTranslation(
                                "order_details_cash_on_delivery_label"
                            )
                            : orderTrackingDetails.paymentMethod}
                    </span>
                    <span className="ml-auto font-semibold">
                        {formatCurrency(calculateTotal())}
                    </span>
                </div>
            </div>

            {/* Cancel Button - only show for pending/accepted orders */}
            {canCancelOrder() && (
                <div className="text-center">
                    <button
                        onClick={() => setIsCancelModalVisible(true)}
                        className="w-full border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50 transition"
                    >
                        {getTranslation("order_details_cancel_order_button")}
                    </button>
                </div>
            )}

            {/* Cancel Order Modal */}
            <CancelOrderModal
                visible={isCancelModalVisible}
                onHide={() => {
                    setIsCancelModalVisible(false);
                }}
                onSuccess={() => {
                    setIsCancelModalVisible(false);
                    setSetshowCancelOrderSuccessModal(true);
                }}
                orderId={orderTrackingDetails._id}
            />
            <CancelOrderSuccessModal
                visible={setshowCancelOrderSuccessModal}
                onHide={() => setSetshowCancelOrderSuccessModal(false)}
            />
        </div>
    );
}

export default TrackingOrderDetails;
