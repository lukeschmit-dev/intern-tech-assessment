import { Button, CircularProgress } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react";
import { Customer, Customers } from '@/types/customer';
import { mutate } from 'swr';
import { Alert } from '@mui/material';

type FormErrors = {
    firstName?: string;
    lastName?: string;
    email?: string;
};

type AddDialogeProps = {
    customers: Customers;
    showAddCustomer: boolean;
    onClose: (v: boolean) => void;
};

export const AddDialoge = ({ customers, showAddCustomer, onClose }: AddDialogeProps) => {
    const [newCustomer, setNewCustomer] = useState<Customer>({
        firstName: '',
        lastName: '',
        email: '',
        businessName: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setNewCustomer((prev) => ({ ...prev, [id]: value }));
        if (formErrors[id as keyof FormErrors]) {
            setFormErrors((prev) => ({ ...prev, [id]: undefined }));
        }
        setSubmitError(null);
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;
        const trimmedEmail = newCustomer.email.trim();
        const trimmedFirstName = newCustomer.firstName.trim();
        const trimmedLastName = newCustomer.lastName.trim();

        if (!trimmedFirstName) {
            errors.firstName = 'First Name is required';
            isValid = false;
        }
        if (!trimmedLastName) {
            errors.lastName = 'Last Name is required';
            isValid = false;
        }
        if (!trimmedEmail) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        } else if (customers && customers.some(customer => customer.email.toLowerCase() === trimmedEmail.toLowerCase())) {
            errors.email = 'Email address already exists';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleAddCustomer = async () => {
        if (!validateForm()) {
            return;
        }

        const newCustomerData = {
            firstName: newCustomer.firstName.trim(),
            lastName: newCustomer.lastName.trim(),
            email: newCustomer.email.trim(),
            businessName: newCustomer.businessName?.trim(),
        };

        setIsLoading(true);
        setSubmitError(null);

        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomerData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to add customer:', errorData);
                setSubmitError(errorData.message || 'Failed to add customer. Please try again.');
                return;
            }

            mutate('/api/customers');
            handleCloseDialog();
        } catch (error) {
            console.error('Error adding customer:', error);
            setSubmitError('An unexpected error occurred. Please try again.');
        } finally { setIsLoading(false) }
    };

    const clearForm = () => {
        setNewCustomer({ firstName: '', lastName: '', email: '', businessName: '' });
        setFormErrors({});
    };

    const handleCloseDialog = () => {
        clearForm();
        onClose(false);
        setSubmitError(null);
    };


    return (
        <Dialog open={showAddCustomer} onClose={handleCloseDialog} fullWidth maxWidth="sm" >
            <DialogTitle sx={{ padding: '16px 24px' }}>Add Customer</DialogTitle>
            <DialogContent sx={{ padding: '20px 24px' }}>
                {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px',
                    }}
                >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="firstName"
                        label="First Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newCustomer.firstName}
                        onChange={handleInputChange}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="lastName"
                        label="Last Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newCustomer.lastName}
                        onChange={handleInputChange}
                        error={!!formErrors.lastName}
                        helperText={formErrors.lastName}
                    />
                    <TextField
                        margin="dense"
                        id="businessName"
                        label="Business Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newCustomer.businessName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        style={{ gridColumn: '1 / -1' }}
                        value={newCustomer.email}
                        onChange={handleInputChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCloseDialog}
                    sx={{ textTransform: 'none' }}
                    disabled={isLoading}
                >Cancel</Button>
                <Button
                    onClick={handleAddCustomer}
                    sx={{ textTransform: 'none' }}
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={20} /> : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}