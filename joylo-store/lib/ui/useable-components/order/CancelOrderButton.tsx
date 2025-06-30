import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import useCancelOrder from "@/lib/hooks/useCancelOrder";
import SpinnerComponent from "../spinner";
import { useApptheme } from "@/lib/context/theme.context";

const CANCEL_REASONS = [
    { id: 1, label: "Rider not available" },
    { id: 2, label: "Product not available" },
    { id: 3, label: "Technical Problem" },
    { id: 4, label: "Other reasons" },
];

const CancelOrderButton = ({ orderId }: { orderId: string }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const { cancelOrder, loading } = useCancelOrder();
    const { appTheme } = useApptheme();

    const handleCancelOrder = () => {
        if (!selectedReason) return;
        cancelOrder(orderId, selectedReason);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.cancelButton,
                    { borderColor: "#ef4444", backgroundColor: appTheme.white },
                ]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: '#ef4444' }}>Cancel Order</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: appTheme.themeBackground },
                        ]}
                    >
                        <Text style={[styles.modalTitle, { color: appTheme.fontMainColor }]}>
                            Select Reason for Cancellation
                        </Text>

                        {CANCEL_REASONS.map((reason) => (
                            <TouchableOpacity
                                key={reason.id}
                                style={[
                                    styles.reasonButton,
                                    {
                                        backgroundColor:
                                            selectedReason === reason.label
                                                ? appTheme.lowOpacityPrimaryColor
                                                : appTheme.white,
                                        borderColor: appTheme.borderLineColor,
                                    },
                                ]}
                                onPress={() => setSelectedReason(reason.label)}
                            >
                                <Text style={{ color: appTheme.fontMainColor }}>
                                    {reason.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    { borderColor: appTheme.borderLineColor },
                                ]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={{ color: appTheme.fontMainColor }}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {
                                        borderWidth: 0,
                                        backgroundColor: selectedReason
                                            ? "#ef4444"
                                            : '#a9a9a9',
                                        opacity: selectedReason ? 1 : 0.6,
                                    },
                                ]}
                                onPress={handleCancelOrder}
                                disabled={!selectedReason || loading}
                            >
                                {loading ? (
                                    <SpinnerComponent color={appTheme.white} />
                                ) : (
                                    <Text 
                                    style={{ color: appTheme.white }}
                                    >
                                        Confirm Cancel
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    cancelButton: {
        flex: 1,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        borderWidth: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        borderRadius: 10,
        gap: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    reasonButton: {
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
});

export default CancelOrderButton;