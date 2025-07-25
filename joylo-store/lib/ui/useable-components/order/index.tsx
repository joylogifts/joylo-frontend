import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import { useLanguage } from "@/lib/context/global/language.context";
import { MAX_TIME } from "@/lib/utils/constants";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { orderSubTotal } from "@/lib/utils/methods";
import { getIsAcceptButtonVisible } from "@/lib/utils/methods/gloabl";
import { ORDER_TYPE } from "@/lib/utils/types";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CountdownTimer from "../custom-timer";
import SpinnerComponent from "../spinner";
import { TimeLeftIcon } from "../svg";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import useCancelOrder from "@/lib/hooks/useCancelOrder";
import useOrderPickedUp from "@/lib/hooks/useOrderPickedUp";
import { useTranslation } from "react-i18next";
import CancelOrderButton from "./CancelOrderButton";

const Order = ({
  order,
  tab,
  handlePresentModalPress,
}: {
  order: IOrder;
  tab: ORDER_TYPE;
  handlePresentModalPress?: (order: IOrder) => void;
}) => {
  // Context
  const configuration = useContext(ConfigurationContext);

  // Hooks
  const { getTranslation, selectedLanguage } = useLanguage();
  const { appTheme } = useApptheme();
  const { cancelOrder, loading: loadingCancelOrder } = useCancelOrder();
  const { pickedUp, loading: loadingPicked } = useOrderPickedUp();

  // Ref
  const timer = useRef<NodeJS.Timeout>(null);

  // States
  const [isAcceptButtonVisible, setIsAcceptButtonVisible] = useState(
    getIsAcceptButtonVisible(order?.orderDate),
  );

  // Timer
  const timeNow = new Date();
  const date = new Date(order.orderDate);
  const acceptanceTime = moment(date).diff(timeNow, "seconds");
  const createdTime = new Date(order?.createdAt);
  let remainingTime = moment(createdTime)
    .add(MAX_TIME, "seconds")
    .diff(timeNow, "seconds");

  // Preparation Time
  const prep = new Date(order.preparationTime ?? "2023-08-16T08:00:00.000Z");
  const diffTime = prep.getTime() - timeNow.getTime();
  const totalPrep = diffTime > 0 ? diffTime / 1000 : 0;

  const decision = !isAcceptButtonVisible
    ? acceptanceTime
    : remainingTime > 0
      ? remainingTime
      : 0;

  if (decision === acceptanceTime) {
    remainingTime = 0;
  }

  // Handlers
  const onCancelOrderHandler = () => {
    cancelOrder(order._id, "not available");
  };

  const onPickupOrder = () => {
    pickedUp(order._id);
  };

  // Use Effects
  useEffect(() => {
    let isSubscribed = true;
    (() => {
      timer.current = setInterval(() => {
        const isAcceptButtonVisible = !moment().isBefore(order?.orderDate);
        if (isSubscribed) {
          setIsAcceptButtonVisible(isAcceptButtonVisible);
        }
        if (isAcceptButtonVisible) {
          if (timer.current) clearInterval(timer.current);
        }
      }, 10000);
    })();
    return () => {
      if (timer.current) clearInterval(timer.current);
      isSubscribed = false;
    };
  }, []);

  // Helper function to get text based on language
  const getLocalizedText = (textObject: Record<string, string> | JSON | undefined | null, fallback: string = "") => {
    if (!textObject || typeof textObject !== "object") return fallback;
    return (textObject as Record<string, string>)[selectedLanguage ?? "en"] ?? 
           (textObject as Record<string, string>)["en"] ?? 
           fallback;
  };

  return (
    <View className="w-full">
      <View
        className="flex-1 gap-y-2 rounded-[8px] m-4 p-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        {/* Status */}
        <View className="flex-1 flex-row justify-between items-center">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {getTranslation("status")}
          </Text>
          <View
            className={`ps-3 pe-3 bg-green-100 border border-1 rounded-[12px] ${
              tab === "delivered"
                ? "border-blue-500 bg-blue-100"
                : tab === "processing"
                  ? "border-yellow-500 bg-yellow-100"
                  : "border-green-500 bg-green-100"
            }`}
          >
            <Text
              style={{
                color:
                  tab === "delivered"
                    ? "navy"
                    : tab === "processing"
                      ? "#92400E"
                      : "#166534",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {getTranslation(order?.orderStatus?.toLowerCase() ?? "")}
            </Text>
          </View>
        </View>

        {/* Order ID */}
     {/*    <View className="flex-1 flex-row justify-between items-center">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {getTranslation("order_id")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 16,
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            #{order?.orderId}
          </Text>
        </View> */}

        

        {/* Order Items */}
        <View className="flex-1 flex-row justify-between items-center">
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {getTranslation("order")}
          </Text>
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {getTranslation("price")}
          </Text>
        </View>


       
        <View>
            {order?.items?.map((item, itemIndex) => {
              return (
                <View
                  key={item._id + itemIndex.toString()}
                  className="flex-1 flex-row justify-between items-center mb-6"
              
                >
                  <View
                    className="w-full flex-row justify-between"
                  
                  >
                    {/* Left */}

                    <View
                      className="flex-row gap-x-2 w-[90%]"
                    
                    >
                      {/* Image */}
                      <View
                        className="w-[60px] h-[70px] rounded-[8px] overflow-hidden"
                        style={{
                          backgroundColor: appTheme.lowOpacityPrimaryColor,
                        }}
                      >
                        <Image
                          src={item.image}
                          style={{ width: 60, height: 70, borderRadius: 8 }}
                        />
                      </View>
                      {/* Item Details */}
                      <View className="flex-1 justify-between">
                        <View>
                          <View
                            className="flex-row items-baseline justify-between"
                          
                          >
                            <Text
                              style={{
                                color: appTheme.fontMainColor,
                                fontSize: 14,
                                fontWeight: "600",
                              }}
                            >
                              {getLocalizedText(item?.title, "")}
                            </Text>
                            {item?.variation?.title && (
                              <Text
                                style={{
                                  color: appTheme.fontSecondColor,
                                  fontSize: 10,
                                  fontWeight: "400",
                                }}
                              >
                                ({item?.variation?.title})
                              </Text>
                            )}
                          </View>
                          <View
                            className="flex-row items-center justify-between mt-1"
                         
                          >
                            <Text
                              style={{
                                color: appTheme.fontMainColor,
                                fontSize: 14,
                                fontWeight: "600",
                              }}
                            >
                              x{item?.quantity}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: appTheme.fontSecondColor,
                              fontSize: 12,
                              marginTop: 2,
                            }}
                          >
                            {getLocalizedText(item?.description, "")}
                          </Text>
                        </View>
                        {/*Special Instructions*/}
                        {item?.specialInstructions && (
                          <View className="w-full mt-2">
                            <Text
                              className="font-[Inter] text-base font-[500]"
                              style={{
                                color: appTheme.fontSecondColor,
                            
                              }}
                            >
                              {getTranslation("item_instructions")}
                            </Text>
                            <Text
                              className="font-[Inter] text-base font-semibold underline underline-offset-2 mt-1"
                              style={{
                                color: appTheme.fontMainColor,
                             
                              }}
                            >
                              {item?.specialInstructions}
                            </Text>
                          </View>
                        )}
                        {/* Addons */}
                        <View
                          className={`mt-1`}
                        >
                          {item?.addons?.map((addon, addonIndex) => {
                            return (
                              <View
                                key={addon._id + addonIndex.toString()}
                                className="mt-1"
                              >
                                <Text
                                  style={{
                                    color: appTheme.fontMainColor,
                                    fontSize: 14,
                                    fontWeight: "600",
                                  }}
                                >
                                  {(addonIndex + 1).toString().concat(" -")}{" "}
                                  {addon?.title}
                                </Text>
                                {addon?.description ? (
                                  <Text
                                    style={{
                                      color: appTheme.fontSecondColor,
                                      fontSize: 12,
                                    }}
                                  >
                                    {addon?.description}
                                  </Text>
                                ) : (
                                  <></>
                                )}

                                {/* Options */}
                                <View className="pl-2 mt-0.5">
                                  {addon?.options?.map(
                                    (option, optionIndex) => {
                                      return (
                                        <View
                                          key={
                                            option._id + optionIndex.toString()
                                          }
                                          className="flex-row justify-between my-2"
                                         
                                        >
                                          <View className="flex-1">
                                            <Text
                                              style={{
                                                color: appTheme.fontMainColor,
                                                fontSize: 14,
                                              }}
                                            >
                                              - {option?.title}
                                            </Text>
                                            {option?.description ? (
                                              <Text
                                                style={{
                                                  color:
                                                    appTheme.fontSecondColor,
                                                  fontSize: 12,
                                                }}
                                              >
                                                {option?.description}
                                              </Text>
                                            ) : (
                                              <></>
                                            )}
                                          </View>
                                          <View className="items-end">
                                            <Text
                                              style={{
                                                color: appTheme.fontMainColor,
                                                fontSize: 12,
                                              }}
                                            >
                                              {configuration?.currencySymbol}
                                              {option?.price}
                                            </Text>
                                            <Text
                                              style={{
                                                color: appTheme.fontSecondColor,
                                                fontSize: 12,
                                              }}
                                            >
                                              x{item?.quantity}
                                            </Text>
                                          </View>
                                          {optionIndex + 1 ===
                                            addon?.options?.length && (
                                            <View>
                                              <Text>{"\n"}</Text>
                                            </View>
                                          )}
                                        </View>
                                      );
                                    },
                                  )}
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                    {/* Right */}
                    <View className="w-auto items-end">
                      <Text style={{ color: appTheme.fontMainColor }}>
                        {configuration?.currencySymbol}
                        {item?.variation.price}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

        {/* Divider */}
        <View
          className="h-0.5 mb-4 mt-4"
          style={{ backgroundColor: appTheme.borderLineColor }}
        />

        {/* Sub Total */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {getTranslation("sub_total")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {orderSubTotal(order)}
          </Text>
        </View>

        {/* Tip */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {getTranslation("tip")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {order?.tipping}
          </Text>
        </View>

        {/* Tax */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {getTranslation("tax")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {order?.taxationAmount}
          </Text>
        </View>

        {/* Delivery */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {getTranslation("delivery_charges")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {order?.deliveryCharges}
          </Text>
        </View>

        {/* Total Amount */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {getTranslation("total")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {order?.orderAmount}
          </Text>
        </View>

        {/* Order Instructions */}
        {order?.instructions && (
          <View
            className="rounded-[4px] p-2"
            style={{ backgroundColor: appTheme.lowOpacityPrimaryColor }}
          >
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {getTranslation("comment")}
            </Text>
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
                fontStyle: "italic",
              }}
            >
              {order?.instructions}
            </Text>
          </View>
        )}

        {/* New Order */}
        {order?.orderStatus === "PENDING" && (
          <View>
            <View className="flex-row gap-x-4 w-full mt-10">
              {/* Decline */}
              <TouchableOpacity
                className="flex-1 h-16 items-center justify-center rounded-[30px]"style={{ borderWidth: 1, borderColor: "#ef4444" }}
                
                onPress={() => onCancelOrderHandler()}
              >
                {loadingCancelOrder ? (
                  <SpinnerComponent color="#ef4444" />
                ) : (
                  <Text
                    style={{
                      color: "#ef4444",
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    {getTranslation("decline")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Accept */}
              {handlePresentModalPress && (
                <TouchableOpacity
                  className="flex-1 h-16 items-center justify-center rounded-[30px]"
                  style={{
                    backgroundColor: appTheme.primary,
                    borderWidth: 1,
                    borderColor: appTheme.primary,
                  }}
                  onPress={() => handlePresentModalPress(order)}
                >
                  <Text
                    style={{
                      color: appTheme.white,
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    {getTranslation("accept")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Processing */}
        {["ACCEPTED", "ASSIGNED", "PICKED"].includes(
          order?.orderStatus ?? "",
        ) && (
          <>
            <View className="w-full items-center">
              <View className="flex-row items-center justify-center gap-x-2">
                <TimeLeftIcon />
                <View>
                  <Text
                    style={{
                      color: appTheme.fontMainColor,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {getTranslation("time_left")}
                  </Text>

                  <CountdownTimer duration={totalPrep} />
                </View>
              </View>
            </View>
            

            {order.orderStatus === "ASSIGNED" && (
              <View className="flex-row gap-x-4 w-full mt-10">
                {/* Hand Order to Rider */}
                {/* <TouchableOpacity
                  className="flex-1 h-16 items-center justify-center rounded-[30px]"
                  style={{
                    backgroundColor: appTheme.primary,
                    borderWidth: 1,
                    borderColor: appTheme.primary,
                  }}
                  onPress={() => onPickupOrder()}
                >
                  {loadingPicked ? (
                    <SpinnerComponent color={appTheme.white} />
                  ) : (
                    <Text
                      style={{
                        color: appTheme.white,
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {getTranslation("hand_order_to_rider")}
                    </Text>
                  )}
                </TouchableOpacity> */}
              </View>
            )}
            {order.orderStatus === "ACCEPTED" && order.isPickedUp && (
              <View className="flex-row gap-x-4 w-full mt-10">
                {/* Hand Order to Rider */}
                <TouchableOpacity
                  className="flex-1 h-16 items-center justify-center rounded-[30px]"
                  style={{
                    backgroundColor: appTheme.primary,
                    borderWidth: 1,
                    borderColor: appTheme.primary,
                  }}
                  onPress={() => onPickupOrder()}
                >
                  {loadingPicked ? (
                    <SpinnerComponent color={appTheme.white} />
                  ) : (
                    <Text
                      style={{
                        color: appTheme.white,
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {getTranslation("deliver_order_to_customer")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {
              order?.orderStatus === 'ACCEPTED' && (
                <View className="mt-4">
                  <CancelOrderButton orderId={order._id} />
                </View>
              )
            }
            
          </>
        )}
      </View>
      
    </View>
  );
};

export default Order;
