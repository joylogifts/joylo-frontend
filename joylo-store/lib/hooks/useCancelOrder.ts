import { useMutation } from "@apollo/client";
import { CANCEL_ORDER , CANCEL_ORDER_BY_STORE} from "../api/graphql";

export default function useCancelOrder() {
  const [mutateCancel, { loading, error }] = useMutation(CANCEL_ORDER_BY_STORE);
  const cancelOrderFunc = (_id: string, reason: string) => {
    mutateCancel({ variables: { orderId : _id, reason } });
  };
  return { loading, error, cancelOrder: cancelOrderFunc };
}
