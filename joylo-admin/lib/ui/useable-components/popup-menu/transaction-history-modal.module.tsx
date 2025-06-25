import React from 'react';
import { Dialog } from 'primereact/dialog';
import { ITransactionHistory } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
import { Rating } from 'primereact/rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { useLangTranslation } from '@/lib/context/global/language.context';

interface ITransactionDetailModalProps {
  visible: boolean;
  onHide: () => void;
  transaction: ITransactionHistory | null;
}

const TransactionDetailModal: React.FC<ITransactionDetailModalProps> = ({
  visible,
  onHide,
  transaction,
}) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  if (!transaction) return null;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Transaction Details #${transaction.transactionId}`}
      className="w-full max-w-2xl"
    >
      <div className="space-y-6 p-4">
        {/* Basic Transaction Info */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 text-lg font-semibold">
            {getTranslation('transaction_information')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">{getTranslation('amount')}</p>
              <p className="font-medium">{`${transaction?.amountCurrency} ${transaction.amountTransferred.toFixed(2)}`}</p>
            </div>
            <div>
              <p className="text-gray-600">{getTranslation('status')}</p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  transaction.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : transaction.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {transaction?.status}
              </span>
            </div>
            <div>
              <p className="text-gray-600">{getTranslation('date')}</p>
              <p className="font-medium">
                {new Date(transaction?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">{getTranslation('user_type')}</p>
              <p className="font-medium">{transaction?.userType}</p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details */}
        {transaction.toBank && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">
              {getTranslation('bank_details')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  {getTranslation('account_name')}
                </p>
                <p className="font-medium">
                  {transaction?.toBank?.accountName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('bank_name')}</p>
                <p className="font-medium">{transaction?.toBank?.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600">
                  {getTranslation('account_number')}
                </p>
                <p className="font-medium">
                  {transaction?.toBank?.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  {getTranslation('account_code')}
                </p>
                <p className="font-medium">
                  {transaction?.toBank?.accountCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rider Details */}
        {transaction.rider && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">
              {getTranslation('rider_details')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{getTranslation('name')}</p>
                <p className="font-medium">{transaction?.rider?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('username')}</p>
                <p className="font-medium">{transaction?.rider?.username}</p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('phone')}</p>
                <p className="font-medium">{transaction?.rider?.phone}</p>
              </div>
              {/* <div>
                <p className="text-gray-600">{t('Account Number')}</p>
                <p className="font-medium">
                  {transaction?.rider?.accountNumber}
                </p>
              </div> */}
              <div>
                <p className="text-gray-600">
                  {getTranslation('current_wallet_amount')}
                </p>
                <p className="font-medium">
                  ${transaction?.rider?.currentWalletAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  {getTranslation('total_earnings')}
                </p>
                <p className="font-medium">
                  ${transaction?.rider?.totalWalletAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Store Details */}
        {transaction.store && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">
              {getTranslation('store_details')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">{getTranslation('store_name')}</p>
                <p className="font-medium">{transaction?.store?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('store_id')}</p>
                <p className="font-medium">
                  {transaction?.store?.unique_restaurant_id}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('rating')}</p>
                <p className="font-medium">
                  <Rating
                    value={transaction?.store?.reviewAverage}
                    onIcon={
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500"
                      />
                    } // Filled Star
                    offIcon={
                      <FontAwesomeIcon
                        icon={faStarHalfAlt}
                        className="text-yellow-500"
                      />
                    } // Empty Star
                    readOnly
                    cancel={false}
                  />
                </p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('phone')}</p>
                <p className="font-medium">{transaction?.store?.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('location')}</p>
                <p className="font-medium">{transaction?.store?.address}</p>
              </div>
              <div>
                <p className="text-gray-600">{getTranslation('status')}</p>
                <div className="space-x-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction?.store?.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction?.store?.isActive
                      ? getTranslation('active')
                      : getTranslation('in_active')}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction?.store?.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction?.store?.isAvailable
                      ? getTranslation('available')
                      : getTranslation('unavailable')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default TransactionDetailModal;
