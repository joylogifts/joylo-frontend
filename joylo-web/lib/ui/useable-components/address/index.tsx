/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLangTranslation } from "@/lib/context/global/language.context";
import { Dialog } from "primereact/dialog";
import { useMutation } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowCircleLeft,
    faCirclePlus,
    faMapMarker,
    faPlus,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { AutoComplete, AutoCompleteSelectEvent } from "primereact/autocomplete";
import { throttle } from "lodash";
import parse from "autosuggest-highlight/parse";

// SVG
import {
    ApartmentSvg,
    HomeSvg,
    OfficeSvg,
    OtherSvg,
} from "@/lib/utils/assets/svg";

// Components
import CustomButton from "../button";
import CustomLoader from "../custom-progress-indicator";
import CustomDropdownComponent from "../custom-dropdown";

// Context
import { useUserAddress } from "@/lib/context/address/address.context";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { useLocationContext } from "@/lib/context/Location/Location.context";

// Hook
import useUser from "@/lib/hooks/useUser";
import useLocation from "@/lib/hooks/useLocation";
import useGeocoding from "@/lib/hooks/useGeocoding";
import useToast from "@/lib/hooks/useToast";
import useSetUserCurrentLocation from "@/lib/hooks/useSetUserCurrentLocation";

// Interface
import {
    IDropdownSelectItem,
    IPlaceSelectedOption,
    IUserAddress,
    IUserAddressComponentProps,
} from "@/lib/utils/interfaces";

// API
import {
    CREATE_ADDRESS,
    EDIT_ADDRESS,
    SELECT_ADDRESS,
} from "@/lib/api/graphql";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { USER_CURRENT_LOCATION_LS_KEY } from "@/lib/utils/constants";
import AppartmentSvg from "@/lib/utils/assets/svg/apartment";

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};



const autocompleteService: {
    current: google.maps.places.AutocompleteService | null;
} = { current: null };

export default function UserAddressComponent(
    props: IUserAddressComponentProps
) {
    // Props
    const { visible, onHide, editAddress } = props;

    // States
    const [modifiyingId, setModifyingId] = useState("");
    const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
    const [selectedCity, setSelectedCity] =
        useState<IDropdownSelectItem | null>(null);
    const [newDraggedCenter, setNewDraggedCenter] = useState({
        lat: 0,
        lng: 0,
    });
    const [selectedLocationType, setSelectedLocationType] =
        useState<string>("House");
    const [search, setSearch] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [options, setOptions] = useState<IPlaceSelectedOption[]>([]);
    const [selectedPlaceObject, setSelectedPlaceObject] =
        useState<IPlaceSelectedOption | null>(null);

    // Hook
    const { getTranslation } = useLangTranslation();
    const { profile, loadingProfile } = useUser();

    const { getCurrentLocation } = useLocation();
    const { getAddress } = useGeocoding();
    const { userAddress, setUserAddress } = useUserAddress();
    const { isLocationFetching, onSetUserLocation } =
        useSetUserCurrentLocation();
    const { showToast } = useToast();

    // Context
    const { isLoaded } = useContext(GoogleMapsContext);
    const { cities } = useLocationContext();

    // API
    const [changeUserSelectedAddress, { loading }] =
        useMutation(SELECT_ADDRESS);
    const [mutate, { loading: modifyingAddressLoading }] = useMutation(
        editAddress?._id ? EDIT_ADDRESS : CREATE_ADDRESS,
        {
            onCompleted,
            onError,
        }
    );

    // Locatl Storage Constaints
    const hasCurrentLocation = !!onUseLocalStorage(
        "get",
        USER_CURRENT_LOCATION_LS_KEY
    );

    // Memo
    const cities_dropdown = useMemo(() => {
        return cities?.map((city) => {
            return {
                _id: city.id,
                label: city.name,
                code: `{"coords":[${city.longitude || 0}, ${city.latitude || 0}]}`,
            };
        });
    }, [cities]);

    const fetch = React.useMemo(
        () =>
            throttle((request, callback) => {
                autocompleteService?.current?.getPlacePredictions(
                    request,
                    callback
                );
            }, 1500),
        []
    );

    // Handlers
    const onHandleEditAddressInit = () => {
        if (!editAddress) return;

        setSelectedLocationType(editAddress?.label || "");
        setInputValue(editAddress?.deliveryAddress || "");
        setSelectedCity(
            cities_dropdown?.find(
                (city) => city.label === editAddress?.details
            ) || null
        );
        paginate(1);
    };

    const onHandleSelectAddress = async (address: IUserAddress) => {
        setModifyingId(address._id);
        changeUserSelectedAddress({
            variables: { id: address._id },
            onCompleted: () => {
                const new_address = {
                    ...address,
                    location: {
                        coordinates: [
                            +(address.location?.coordinates[0] || "0"),
                            +(address.location?.coordinates[1] || "0"),
                        ] as [number, number],
                    },
                };

                setUserAddress(new_address);
                onUseLocalStorage("delete", USER_CURRENT_LOCATION_LS_KEY);
                setModifyingId("");
                onHide();
            },
        });
    };

    const paginate = (newDirection: number) => {
        const total = COMPONENTS_LIST.length;

        // Calculate the new index and wrap around using modulo
        let newIndex = index + newDirection;

        if (newIndex < 0) {
            newIndex = total - 1; // go to last item if negative overflow
        } else if (newIndex >= total) {
            newIndex = 0; // go to first item if positive overflow
        }

        setIndex([newIndex, newDirection]);
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    const onHandlerAutoCompleteSelectionChange = (
        event: AutoCompleteSelectEvent
    ) => {
        const selectedOption = event?.value as IPlaceSelectedOption;
        if (selectedOption) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
                { placeId: selectedOption.place_id },
                (results: google.maps.GeocoderResult[] | null) => {
                    if (
                        results &&
                        results[0] &&
                        results[0]?.geometry &&
                        results[0]?.geometry.location
                    ) {
                        const location = results[0]?.geometry?.location;

                        setUserAddress({
                            _id: "",
                            deliveryAddress: selectedOption.description,
                            location: {
                                coordinates: [
                                    location?.lng() ?? 0,
                                    location?.lat() ?? 0,
                                ],
                            },
                            label: "Home",
                        });

                        setInputValue(selectedOption.description);
                    }
                }
            );
            setSelectedPlaceObject(selectedOption);
        }
    };

    const onCenterDraggedHandler = async (e?: google.maps.MapMouseEvent) => {
        const new_center = {
            lat: e?.latLng?.lat() || newDraggedCenter.lat || 0,
            lng: e?.latLng?.lng() || newDraggedCenter.lng || 0,
        };

        if (new_center.lat === 0 && new_center.lng === 0) return;

        const { formattedAddress } = await getAddress(
            new_center.lat,
            new_center.lng
        );

        if (!formattedAddress) {
            showToast({
                type: "error",
                title: getTranslation("error_label"),
                message: getTranslation("failed_to_fetch_address"),
            });
            return;
        }

        setInputValue(formattedAddress);

        setUserAddress({
            _id: "",
            deliveryAddress: formattedAddress,
            location: { coordinates: [new_center.lng, new_center.lat] },
            label: "Home",
        });
    };

    const onClickGoogleMaps = (e: google.maps.MapMouseEvent) => {
        setNewDraggedCenter({
            lat: e?.latLng?.lat() ?? 0,
            lng: e?.latLng?.lng() ?? 0,
        });
    };

    const onHandleCreateAddress = () => {
        const addressInput = {
            ...(editAddress?._id ? { _id: editAddress?._id } : {}),
            longitude: `${userAddress?.location?.coordinates[0]}`,
            latitude: `${userAddress?.location?.coordinates[1]}`,
            deliveryAddress: userAddress?.deliveryAddress || "",
            details: selectedCity?.label,
            label: selectedLocationType,
        };

        if (editAddress?._id) {
            addressInput["_id"] = editAddress?._id;
        }
        mutate({ variables: { addressInput } });
    };

    // API Handlers
    function onCompleted({ createAddress, editAddress }) {
        const address_response: IUserAddress = (
            createAddress || editAddress
        )?.addresses.find((a: IUserAddress) => a.selected);

        setUserAddress({
            _id: address_response?._id,
            label: selectedLocationType,
            deliveryAddress: address_response.deliveryAddress,

            location: {
                coordinates: [
                    +(address_response.location?.coordinates[0] || "0"),
                    +(address_response.location?.coordinates[1] || "0"),
                ],
            },
        });
        setModifyingId(address_response?._id);
        changeUserSelectedAddress({
            variables: { id: address_response?._id },
            onCompleted: () => {
                const new_address = {
                    _id: address_response?._id,
                    label: selectedLocationType,
                    deliveryAddress: address_response.deliveryAddress,

                    location: {
                        coordinates: [
                            +(address_response.location?.coordinates[0] || "0"),
                            +(address_response.location?.coordinates[1] || "0"),
                        ] as [number, number],
                    },
                };
                setUserAddress(new_address);
                onUseLocalStorage("delete", USER_CURRENT_LOCATION_LS_KEY);
                setModifyingId("");
                onHide();
            },
        });
        setIndex([0, 0]);
        onHide();
    }

    function onError() {
        showToast({
            title: getTranslation("new_address_label"),
            type: "error",
            message: getTranslation("address_update_failed"),
        });
    }
    const LOCATIONT_TYPE = [
        {
            name: getTranslation("house"),
            icon: (color?: string) => <HomeSvg color={color || "#0F172A"} />,
        },
        {
            name: getTranslation("office"),
            icon: (color?: string) => <OfficeSvg color={color || "#0F172A"} />,
        },
        {
            name: getTranslation("apartment"),
            icon: (color?: string) => <ApartmentSvg color={color || "#0F172A"} />,
        },
        {
            name: getTranslation("other"),
            icon: (color?: string) => <OtherSvg color={color || "#0F172A"} />,
        },
    ];
    /*
  ################
  Templates
  ################
  */
    const CHOOSE_ADDRESS = (
        <div className="w-full space-y-4 flex flex-col items-center">
            {/* Header */}
            <div className="w-full">
                <span className="font-inter font-bold text-[25px] tracking-normal">
                    {getTranslation("where_to_label")}
                </span>
            </div>

            <button
                className="w-[90%] h-fit bg-[#FFA500] mb-2 text-gray-900 py-2 space-x-2 rounded-full text-base lg:text-[14px]"
                onClick={() => {
                    getCurrentLocation(onSetUserLocation);
                    onHide();
                }}
            >
                <FontAwesomeIcon
                    icon={isLocationFetching ? faSpinner : faCirclePlus}
                    spin={isLocationFetching}
                />
                <span>{getTranslation("current_location_btn")}</span>
            </button>

            <div className="w-full flex flex-col items-center">
                {loadingProfile ? (
                    <div className="w-full flex items-center justify-center m-4">
                        <CustomLoader />
                    </div>
                ) : (
                    profile?.addresses.map((address, index) => (
                        <div
                            key={index}
                            className="w-full mb-4 flex items-center justify-between"
                        >
                            <div className="w-full flex items-center gap-x-2">
                                <div className="p-2 bg-gray-50 rounded-full">
                                    {address?.label === "Office" && (
                                        <OfficeSvg
                                            color={
                                                address.selected &&
                                                    !hasCurrentLocation
                                                    ? "#0EA5E9"
                                                    : undefined
                                            }
                                        />
                                    )}
                                    {address?.label === "House" && (
                                        <HomeSvg
                                            height={18}
                                            color={
                                                address.selected &&
                                                    !hasCurrentLocation
                                                    ? "#0EA5E9"
                                                    : "black"
                                            }
                                        />
                                    )}
                                    {address?.label === "Apartment" && (
                                        <AppartmentSvg
                                            color={
                                                address.selected &&
                                                    !hasCurrentLocation
                                                    ? "#0EA5E9"
                                                    : undefined
                                            }
                                        />
                                    )}
                                    {address?.label === "Other" && (
                                        <OtherSvg
                                            color={
                                                address.selected &&
                                                    !hasCurrentLocation
                                                    ? "#0EA5E9"
                                                    : undefined
                                            }
                                        />
                                    )}
                                </div>
                                <div className="w-full flex flex-col gap-y-[2px]">
                                    <span
                                        className={`font-inter font-medium text-sm leading-5 tracking-normal ${address.selected && !hasCurrentLocation ? "text-sky-500" : "text-gray-500"}`}
                                    >
                                        {address.label}
                                    </span>
                                    <span
                                        className={`font-inter font-normal text-xs leading-4 tracking-normal ${address.selected && !hasCurrentLocation ? "text-sky-400" : "text-gray-400"}`}
                                    >
                                        {address.deliveryAddress}
                                    </span>
                                </div>
                            </div>
                            {(!address.selected || hasCurrentLocation) && (
                                <div>
                                    <CustomButton
                                        label={getTranslation("choose_label")}
                                        rounded
                                        loading={
                                            modifiyingId === address._id &&
                                            loading
                                        }
                                        className="border p-2 pl-4 pr-4 border-gray-300 text-sky-500 font-medium"
                                        onClick={() =>
                                            onHandleSelectAddress(address)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}

                <button
                    className="w-[90%] h-fit bg-[#FFA500] text-gray-900 py-2 rounded-full text-base lg:text-[14px]"
                    onClick={() => paginate(1)}
                >
                    <FontAwesomeIcon icon={faPlus} />{" "}
                    <span>{getTranslation("add_new_address_button")}</span>
                </button>
            </div>
        </div>
    );

    const ADD_ADDRESS = (
        <div className="w-full space-y-2">
            {/* Header */}
            <div className="w-full">
                <span className="font-inter font-semibold text-[18px] tracking-normal">
                    {getTranslation("add_new_address_button")}
                </span>
            </div>
            {/* Google Maps */}
            {isLoaded && (
                <div className="w-full">
                    <GoogleMap
                        mapContainerStyle={{
                            width: "100%",
                            height: "35vh",
                        }}
                        center={{
                            lat:
                                Number(userAddress?.location?.coordinates[1]) ||
                                0,
                            lng:
                                Number(userAddress?.location?.coordinates[0]) ||
                                0,
                        }}
                        zoom={13}
                        onClick={onClickGoogleMaps}
                    >
                        {userAddress?.location?.coordinates && (
                            <Marker
                                position={{
                                    lat:
                                        Number(
                                            userAddress?.location
                                                ?.coordinates[1]
                                        ) || 0,
                                    lng:
                                        Number(
                                            userAddress?.location
                                                ?.coordinates[0]
                                        ) || 0,
                                }}
                                draggable
                                onDragEnd={onCenterDraggedHandler}
                            />
                        )}
                    </GoogleMap>
                </div>
            )}

            <div className="w-full flex flex-col items-center gap-y-2">
                <div className="w-full space-y-2">
                    <CustomDropdownComponent
                        name={getTranslation("city_label")}
                        placeholder={getTranslation("select_city_placeholder")}
                        selectedItem={selectedCity}
                        setSelectedItem={async (
                            key: string,
                            item: IDropdownSelectItem
                        ) => {
                            setSelectedCity(item);

                            const { coords } = JSON.parse(item.code || "");

                            const { formattedAddress } = await getAddress(
                                coords[1],
                                coords[0]
                            );

                            setInputValue(formattedAddress);

                            setUserAddress({
                                _id: "",
                                deliveryAddress: formattedAddress,
                                location: {
                                    coordinates: [coords[0], coords[1]],
                                },
                                label: "Home",
                            });
                        }}
                        options={cities_dropdown}
                    />

                    <AutoComplete
                        id="google-map"
                        disabled={!selectedCity}
                        className={`mr-4 h-11 w-full border border-gray-300 px-2 text-sm focus:shadow-none focus:outline-none`}
                        value={inputValue}
                        completeMethod={(event) => {
                            setSearch(event.query);
                        }}
                        onChange={(e) => {
                            if (typeof e.value === "string")
                                handleInputChange(e.value);
                        }}
                        onSelect={onHandlerAutoCompleteSelectionChange}
                        suggestions={options}
                        forceSelection={false}
                        dropdown={false}
                        multiple={false}
                        loadingIcon={undefined}
                        placeholder={getTranslation(
                            "enter_full_address_placeholder"
                        )}
                        style={{ width: "100%" }}
                        itemTemplate={(item) => {
                            const matches =
                                item.structured_formatting
                                    ?.main_text_matched_substrings;
                            let parts:
                                | { text: string; highlight: boolean }[]
                                | null = null;
                            if (matches) {
                                parts = parse(
                                    item.structured_formatting.main_text,
                                    matches.map(
                                        (match: {
                                            offset: number;
                                            length: number;
                                        }) => [
                                                match.offset,
                                                match.offset + match.length,
                                            ]
                                    )
                                );
                            }

                            return (
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon
                                            icon={faMapMarker}
                                            className="mr-2"
                                        />
                                        {parts &&
                                            parts?.map((part, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        fontWeight:
                                                            part.highlight
                                                                ? 700
                                                                : 400,
                                                        color: "black",
                                                        marginRight: "2px",
                                                    }}
                                                >
                                                    {part.text}
                                                </span>
                                            ))}
                                    </div>
                                    <small>
                                        {
                                            item.structured_formatting
                                                ?.secondary_text
                                        }
                                    </small>
                                </div>
                            );
                        }}
                    />
                </div>

                <div className="w-full">
                    <div className="w-full">
                        <span className="font-inter font-semibold text-[12px] tracking-normal">
                            {getTranslation("location_type_label")}
                        </span>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4">
                        {LOCATIONT_TYPE.map((item) => (
                            <div
                                key={item.name}
                                className="p-2 cursor-pointer flex items-center gap-x-2 shadow rounded"
                                onClick={() =>
                                    setSelectedLocationType(item.name)
                                }
                            >
                                <div>
                                    {item.icon(
                                        selectedLocationType === item.name
                                            ? "#0EA5E9"
                                            : undefined
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-[2px]">
                                    <span
                                        className={`font-inter font-medium text-sm leading-5 tracking-normal ${selectedLocationType === item.name ? "text-sky-500" : "text-gray-500"}`}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full flex justify-between gap-x-2">
                    <button
                        className="w-full  h-fit bg-transparent text-gray-900 py-2 border border-black rounded-full text-base lg:text-[14px]"
                        onClick={() => {
                            setIndex([0, 0]);
                            onHide();
                        }}
                    >
                        <span>{getTranslation("cancel_label")}</span>
                    </button>
                    <button
                        className="w-full h-fit bg-[#FFA500] text-gray-900 py-2 rounded-full text-base lg:text-[14px]"
                        onClick={() => onHandleCreateAddress()}
                    >
                        {modifyingAddressLoading ? (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                spin={modifyingAddressLoading}
                            />
                        ) : (
                            <span>{getTranslation("save_label")}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    const EDIT_ADDRESS_UI = (
        <div className="w-full space-y-2">
            {/* Header */}
            <div className="w-full">
                <span className="font-inter font-semibold text-[18px] tracking-normal">
                    {getTranslation("add_new_address_button")}
                </span>
            </div>
            {/* Google Maps */}
            {isLoaded && (
                <div className="w-full">
                    <GoogleMap
                        mapContainerStyle={{
                            width: "100%",
                            height: "400px",
                        }}
                        center={{
                            lat:
                                Number(editAddress?.location?.coordinates[1]) ||
                                0,
                            lng:
                                Number(editAddress?.location?.coordinates[0]) ||
                                0,
                        }}
                        zoom={13}
                        onCenterChanged={() => { }}
                    >
                        {editAddress?.location?.coordinates && (
                            <Marker
                                position={{
                                    lat:
                                        Number(
                                            editAddress?.location
                                                ?.coordinates[1]
                                        ) || 0,
                                    lng:
                                        Number(
                                            editAddress?.location
                                                ?.coordinates[0]
                                        ) || 0,
                                }}
                            />
                        )}
                    </GoogleMap>
                </div>
            )}

            <div className="w-full flex flex-col items-center gap-y-2">
                <div className="w-full space-y-2">
                    <CustomDropdownComponent
                        name={getTranslation("city_label")}
                        placeholder={getTranslation("select_city_placeholder")}
                        selectedItem={selectedCity}
                        setSelectedItem={async (
                            key: string,
                            item: IDropdownSelectItem
                        ) => {
                            setSelectedCity(item);

                            const { coords } = JSON.parse(item.code || "");

                            const { formattedAddress } = await getAddress(
                                coords[1],
                                coords[0]
                            );

                            setInputValue(formattedAddress);

                            setUserAddress({
                                _id: "",
                                deliveryAddress: formattedAddress,
                                location: {
                                    coordinates: [coords[0], coords[1]],
                                },
                                label: "Home",
                            });
                        }}
                        options={cities_dropdown}
                    />

                    <AutoComplete
                        id="google-map"
                        disabled={false}
                        className={`mr-4 h-11 w-full border border-gray-300 px-2 text-sm focus:shadow-none focus:outline-none`}
                        value={inputValue}
                        completeMethod={(event) => {
                            setSearch(event.query);
                        }}
                        onChange={(e) => {
                            if (typeof e.value === "string")
                                handleInputChange(e.value);
                        }}
                        onSelect={onHandlerAutoCompleteSelectionChange}
                        suggestions={options}
                        forceSelection={false}
                        dropdown={false}
                        multiple={false}
                        loadingIcon={undefined}
                        placeholder={getTranslation(
                            "enter_full_address_placeholder"
                        )}
                        style={{ width: "100%" }}
                        itemTemplate={(item) => {
                            const matches =
                                item.structured_formatting
                                    ?.main_text_matched_substrings;
                            let parts:
                                | { text: string; highlight: boolean }[]
                                | null = null;
                            if (matches) {
                                parts = parse(
                                    item.structured_formatting.main_text,
                                    matches.map(
                                        (match: {
                                            offset: number;
                                            length: number;
                                        }) => [
                                                match.offset,
                                                match.offset + match.length,
                                            ]
                                    )
                                );
                            }

                            return (
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon
                                            icon={faMapMarker}
                                            className="mr-2"
                                        />
                                        {parts &&
                                            parts?.map((part, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        fontWeight:
                                                            part.highlight
                                                                ? 700
                                                                : 400,
                                                        color: "black",
                                                        marginRight: "2px",
                                                    }}
                                                >
                                                    {part.text}
                                                </span>
                                            ))}
                                    </div>
                                    <small>
                                        {
                                            item.structured_formatting
                                                ?.secondary_text
                                        }
                                    </small>
                                </div>
                            );
                        }}
                    />
                </div>

                <div className="w-full">
                    <div className="w-full">
                        <span className="font-inter font-semibold text-[12px] tracking-normal">
                            {getTranslation("location_type_label")}
                        </span>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4">
                        {LOCATIONT_TYPE.map((item) => (
                            <div
                                key={item.name}
                                className="p-2 cursor-pointer flex items-center gap-x-2 shadow rounded"
                                onClick={() =>
                                    setSelectedLocationType(item.name)
                                }
                            >
                                <div>
                                    {item.icon(
                                        selectedLocationType === item.name
                                            ? "#0EA5E9"
                                            : undefined
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-[2px]">
                                    <span
                                        className={`font-inter font-medium text-sm leading-5 tracking-normal ${selectedLocationType === item.name ? "text-sky-500" : "text-gray-500"}`}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full flex justify-between gap-x-2">
                    <button
                        className="w-full  h-fit bg-transparent text-gray-900 py-2 border border-black rounded-full text-base lg:text-[14px]"
                        onClick={() => {
                            setIndex([0, 0]);
                            onHide();
                        }}
                    >
                        <span>{getTranslation("cancel_label")}</span>
                    </button>
                    <button
                        className="w-full h-fit bg-[#FFA500] text-gray-900 py-2 rounded-full text-base lg:text-[14px]"
                        onClick={() => onHandleCreateAddress()}
                    >
                        {modifyingAddressLoading ? (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                spin={modifyingAddressLoading}
                            />
                        ) : (
                            <span>{getTranslation("save_label")}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    const COMPONENTS_LIST = [
        CHOOSE_ADDRESS,
        editAddress ? EDIT_ADDRESS_UI : ADD_ADDRESS,
    ];

    // Effects
    useEffect(() => {
        if (
            !autocompleteService.current &&
            window.google &&
            window.google.maps?.places
        ) {
            autocompleteService.current =
                new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return;
        }

        if (search === "") {
            setOptions(selectedPlaceObject ? [selectedPlaceObject] : []);
            return;
        }

        fetch({ input: search }, (results: IPlaceSelectedOption[]) => {
            let newOptions: IPlaceSelectedOption[] = [];
            if (selectedPlaceObject) {
                newOptions = [selectedPlaceObject];
            }
            if (results) {
                newOptions = [...newOptions, ...results];
            }
            setOptions(newOptions);
        });

        return () => {
            autocompleteService.current = null;
        };
    }, [selectedPlaceObject, search, fetch]);

    useEffect(() => {
        onCenterDraggedHandler();
    }, [newDraggedCenter]);

    useEffect(() => {
        onHandleEditAddressInit();
    }, [editAddress]);

    return (
        <Dialog
            visible={visible}
            onHide={() => {
                setIndex([0, 0]);
                onHide();
            }}
            className={`w-[90%] lg:w-1/3 bg-white m-4 `}
            header={
                index !== 0 ? (
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => paginate(-1)}
                    >
                        <FontAwesomeIcon icon={faArrowCircleLeft} />
                    </div>
                ) : null
            }
            headerStyle={{ paddingTop: "10px", paddingBottom: "0px" }}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="w-full relative flex justify-between px-4" // changed from absolute to relative
                >
                    {COMPONENTS_LIST[index]}
                </motion.div>
            </AnimatePresence>
        </Dialog>
    );
}
