import Head from 'next/head';
import useSWR from 'swr';
import { useState } from 'react';
import { Customers } from '@/types/customer';
import { AddDialoge } from '@/components/AddDialoge';
import { CustomerTable } from '@/components/CustomerTable';
import { ApiError } from '@/types/common';


const Home = () => {

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };

  const { data, error, isLoading } = useSWR<Customers, ApiError>(
    '/api/customers',
    fetcher
  );

  const [addDialog, setAddDialog] = useState(false);

  const handleAddCustomerClick = () => {
    setAddDialog(true);
  };


  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <CustomerTable
          customers={data || []}
          isLoading={isLoading}
          error={error}
          onAddCustomer={handleAddCustomerClick}
        />
        <AddDialoge customers={data || []} showAddCustomer={addDialog} onClose={(v: boolean) => setAddDialog(v)} />
      </main>
    </>
  );
};

export default Home;
