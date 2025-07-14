import React from "react";
import { Dialog } from "primereact/dialog";
import { useMutation } from "@apollo/client";
import { ABORT_ORDER } from "@/lib/api/graphql";
import useToast from "@/lib/hooks/useToast";
import { useAuth } from "@/lib/context/auth/auth.context";
import { useLangTranslation } from "@/lib/context/global/language.context";

interface CancelOrderModalProps {
  visible: boolean;
  onHide: () => void;
  orderId: string;
  onSuccess: () => void;
}

function CancelOrderModal({ visible, onHide, orderId, onSuccess }: CancelOrderModalProps) {
  const { getTranslation } = useLangTranslation();
  const { showToast } = useToast();
  const { authToken } = useAuth(); // Get auth context for authentication
 
  const [abortOrder, { loading }] = useMutation(ABORT_ORDER, {
    onCompleted: (data) => {
      console.log("Order cancelled successfully:", data);
      showToast({
        type: "success",
        title: getTranslation("order_cancelled_title"),
        message: getTranslation("order_cancelled_success_message"),
      });
      console.log("onSuccess is called");
      onSuccess();
      // Refresh the order tracking page to show the updated status
    
    },
    onError: (error) => {
      console.error("Abort order error:", error);
      console.error("Error details:", {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      });
      showToast({
        type: "error",
        title: getTranslation("cancellation_failed_title"),
        message: getTranslation("unable_to_cancel_order_message"),
      });
    },
    // Ensure token is sent with the request
    context: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "", // Changed to uppercase 'Authorization'
      },
    },
  });

  const handleCancelOrder = () => {
    if (!authToken) {
      console.error("No authentication token available");
      showToast({
        type: "error",
        title: getTranslation("authentication_required_title"),
        message: getTranslation("login_to_cancel_order_message"),
      });
      return;
    }

    console.log("Cancelling order:", {
      orderId,
      authToken: authToken ? "Present" : "Missing",
      tokenLength: authToken?.length,
    });

    abortOrder({
      variables: {
        id: orderId,
      },
    });
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      modal
      className="w-full max-w-md mx-4 bg-white p-5"
      contentClassName="p-6"
      showHeader={false}
      closable={true}
      dismissableMask
    >
      <div className="text-center">
        <div className="flex justify-end mb-2">
          <button
            onClick={onHide}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-3">{getTranslation("cancel_your_order_heading")}</h2>
        <p className="text-gray-600 text-sm mb-6">
          {getTranslation("order_cancel_warning_line1")}
          <br />
          {getTranslation("order_cancel_warning_line2")}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleCancelOrder}
            disabled={loading}
            className="w-full py-3 px-4 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? getTranslation("cancelling_text") : getTranslation("cancel_my_order_button")}
          </button>

          <button
            onClick={onHide}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {getTranslation("ill_wait_for_my_order_button")}
          </button>
        </div>
      </div>

   
    </Dialog>
  );
}

export default CancelOrderModal;
