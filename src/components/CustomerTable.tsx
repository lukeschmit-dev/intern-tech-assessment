import { Button, Table, TableHead, TableRow, TableBody, TableCell, Paper, Box, CircularProgress, Typography } from "@mui/material"
import { Customer, Customers } from '@/types/customer'
import { AddRounded } from "@mui/icons-material"
import { ApiError } from '@/types/common'


type CustomerTableProps = {
    customers: Customers;
    isLoading: boolean;
    error: ApiError | undefined;
    onAddCustomer: () => void;
};

export const CustomerTable = ({ customers, isLoading, error, onAddCustomer }: CustomerTableProps) => {


    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Typography color="error">Error loading customers: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ width: '70%', marginTop: '20px', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ borderBottom: 'none' }}>
                                {`${customers.length} Customers`}
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none' }} align="right">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: 'none', padding: '6px 12px' }}
                                    onClick={onAddCustomer}
                                >
                                    Add Customer
                                    <AddRounded sx={{ marginLeft: '8px', fontSize: '18px' }} />
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer: Customer) => (
                            <TableRow key={customer.email}>
                                <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    )
}