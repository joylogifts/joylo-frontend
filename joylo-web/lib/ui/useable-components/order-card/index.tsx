"use client";

import { useCallback, type FC } from "react";
import { Rating } from "primereact/rating";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import {
    IOrder,
    IOrderCardProps,
} from "@/lib/utils/interfaces/orders.interface";
import {
    formatDate,
    formatDateAndTime,
    // getStatusColor,
    // getStatusLabel,
} from "@/lib/utils/methods/helpers";
import CustomIconButton from "../custom-icon-button";
// import OrderItemsWithImages from "../order-items-with-images";
import OrderItems from "../order-items";
import { useLangTranslation } from "@/lib/context/global/language.context";

const OrderCard: FC<IOrderCardProps> = ({
    order,
    type,
    className,
    handleTrackOrderClicked,
    handleReOrderClicked,
    handleRateOrderClicked,
}) => {
    const { getTranslation, selectedLanguage } = useLangTranslation();
    const handleTrackOrder = (order: IOrder) => {
        // Implement tracking functionality
        // The ?. (optional chaining) operator is used to safely call the function handleTrackOrderClicked only if it is defined.
        handleTrackOrderClicked?.(order?._id);
    };

    const handleReorder = useCallback((order: IOrder) => {
        // Implement reorder functionality
        // pass restaurant id of that order
        handleReOrderClicked?.(
            order?.restaurant?._id,
            order?.restaurant?.slug,
            order?.restaurant?.shopType
        );
    }, []);

    const handleRateOrder = () => {
        // Implement rating functionality
        handleRateOrderClicked?.(order?._id);
    };

    return (
        <div className={twMerge("p-6", className)}>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Restaurant Info */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                            src={
                                order?.restaurant?.image ||
                                "https://placehold.co/400"
                            }
                            alt={
                                order?.restaurant?.name ||
                                getTranslation("restaurant_label")
                            }
                            width={64}
                            height={64}
                            className="rounded-md object-cover w-full h-full"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                            {order?.restaurant?.name}
                        </h3>
                        {type === "active" && (
                            <h1 className="text-gray-600 text-sm">
                                {order?.items && order?.items[0]?.title
                                    ? typeof order?.items[0]?.title === "object"
                                        ? order?.items[0]?.title[selectedLanguage]
                                        : order?.items[0]?.title
                                    : ""}
                            </h1>
                        )}
                        {type === "active" ? (
                            <>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <i className="fa-solid fa-clock text-gray-400"></i>
                                </div>
                                {/* <Badge
                  value={getStatusLabel(order.orderStatus)}
                  severity={getStatusColor(order.orderStatus)}
                  className="mt-2"
                /> */}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center  text-sm text-gray-600 mt-1">
                                    <i className="fa-solid fa-calendar-alt text-gray-400"></i>
                                    <span>
                                        {order?.deliveredAt
                                            ? getTranslation(
                                                  "delivered_on"
                                              ).replace(
                                                  "{date}",
                                                  formatDateAndTime(
                                                      order.deliveredAt
                                                  )
                                              )
                                            : order?.cancelledAt
                                              ? getTranslation(
                                                    "cancelled_on"
                                                ).replace(
                                                    "{date}",
                                                    formatDate(
                                                        order.cancelledAt
                                                    )
                                                )
                                              : getTranslation("cancelled")}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {getTranslation("order_number").replace(
                                        "{orderId}",
                                        order.orderId?.substring(0, 8) || ""
                                    )}
                                </div>
                                {/* order list without images */}
                                <OrderItems order={order} />
                            </>
                        )}
                    </div>
                </div>

                {/* Price and Action */}
                <div className="flex md:flex-col md:items-end justify-between gap-2">
                    <div className="font-semibold text-lg">
                        ${order.orderAmount?.toFixed(2)}
                    </div>

                    {(type === "active" || type === "past") && (
                        <CustomIconButton
                            title={
                                type === "active"
                                    ? getTranslation("track_your_order")
                                    : getTranslation("select_item_to_reorder")
                            }
                            iconColor="black"
                            classNames="bg-[#FFA500] w-[content] px-4 gap-x-0 text-[12px] font-medium m-0"
                            handleClick={
                                type === "active"
                                    ? () => handleTrackOrder(order)
                                    : () => handleReorder(order)
                            }
                            loading={false}
                        />
                    )}
                </div>
            </div>

            {/* Another variant for order items list with images */}
            {/* Order Items with images */}
            {/* <OrderItemsWithImages order={order} /> */}

            {/* Rating for past orders */}
            {type === "past" && order.orderStatus === "DELIVERED" && (
                <div className="mt-4 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            {getTranslation("rate_the_order")}
                        </span>
                        <Rating
                            value={order.review?.rating || 0}
                            cancel={false}
                            onChange={handleRateOrder}
                            pt={{
                                onIcon: { className: "text-yellow-400" },
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCard;
