// Prime React
import { Dialog } from 'primereact/dialog';

// Components
import CustomButton from '../button';

// Interface and Types
import { IDialogComponentProps } from '@/lib/utils/interfaces/dialog.interface';
import { InputTextarea } from 'primereact/inputtextarea'; // PrimeReact input for multiline text
import { useState } from 'react';

const CustomDialog = ({
	title = 'Confirm Deletion',
	message,
	visible,
	onHide,
	onConfirm,
	loading,
	buttonConfig,
	showReasonInput,
	setReason,
	reasonRequired,
}: IDialogComponentProps & {
	showReasonInput?: boolean;
	setReason?: (val: string) => void;
	reasonRequired?: boolean;
}) => {
	const [reasonValue, setReasonValue] = useState('');
	const [error, setError] = useState('');

	const {
		primaryButtonProp: {
			label: primaryButtonLabel = 'Confirm',
			icon: primaryButtonIcon = 'pi pi-check',
			textColor: primaryButtonTextColor = 'text-white',
			bgColor: primaryButtonBGColor = 'bg-red-500',
		} = {},
		secondaryButtonProp: {
			label: secondaryButtonLabel = 'Cancel',
			icon: secondaryButtonIcon = 'pi pi-times',
			textColor: secondaryButtonTextColor = 'text-black',
			bgColor: secondaryButtonBGColor = 'bg-transparent',
		} = {},
	} = buttonConfig || {};

	const handleConfirm = () => {
		if (showReasonInput && reasonRequired && !reasonValue.trim()) {
			setError('Reason is required.');
			return;
		}
		setError('');
		onConfirm();
	};

	const handleReasonChange = (val: string) => {
		setReasonValue(val);
		setReason?.(val);
		if (reasonRequired && val.trim()) {
			setError('');
		}
	};

	const footer = (
		<div className="space-x-2">
			<CustomButton
				label={secondaryButtonLabel}
				icon={secondaryButtonIcon}
				onClick={onHide}
				className={`h-9 rounded border border-gray-300 px-5 ${secondaryButtonBGColor} ${secondaryButtonTextColor}`}
			/>
			<CustomButton
				loading={loading}
				label={primaryButtonLabel}
				className={`h-9 rounded border-gray-300 px-4 ${primaryButtonBGColor} ${primaryButtonTextColor}`}
				icon={primaryButtonIcon}
				onClick={handleConfirm}
			/>
		</div>
	);

	return (
		<Dialog
			visible={visible}
			style={{ width: '32rem' }}
			breakpoints={{ '960px': '75vw', '641px': '90vw' }}
			header={title}
			modal
			footer={footer}
			onHide={onHide}
		>
			<div className="confirmation-content space-y-4">
				{
					!showReasonInput && (
						<span>{message || 'Are you sure you want to delete this item?'}</span>
					)
				}

				{showReasonInput && (
					<div>
						<label className='text-gray-500 font-medium'>Reason</label>
						<InputTextarea
							rows={3}
							className="w-full mt-2 border border-primary-color p-2"
							placeholder="Please enter the reason..."
							value={reasonValue}
							onChange={(e) => handleReasonChange(e.target.value)}
						/>
						{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
					</div>
				)}
			</div>
		</Dialog>
	);
};

export default CustomDialog;
