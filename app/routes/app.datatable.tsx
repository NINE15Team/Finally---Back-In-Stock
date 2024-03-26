import { ActionFunctionArgs } from '@remix-run/node';
import { useSubmit } from '@remix-run/react';
import {
    IndexTable,
    useIndexResourceState,
    Text,
    useBreakpoints,
    Card,
} from '@shopify/polaris';

export const action = async ({ request }: ActionFunctionArgs) => {
    let formData = await request.formData();
    let obj = Object.fromEntries(formData) as any;
    console.log(obj);
    return true;
};


export default function index() {
    const submit = useSubmit();

    const orders = [
        {
            id: '1020',
            order: '#1020',
            date: 'Jul 20 at 4:34pm',
            customer: 'Jaydon Stanton',
            total: '$969.44',
        },
        {
            id: '1019',
            order: '#1019',
            date: 'Jul 20 at 3:46pm',
            customer: 'Ruben Westerfelt',
            total: '$701.19',
        },
        {
            id: '1018',
            order: '#1018',
            date: 'Jul 20 at 3.44pm',
            customer: 'Leo Carder',
            total: '$798.24',
        },
    ];
    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);

    const rowMarkup = orders.map(
        (
            { id, order, date, customer, total },
            index,
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {order}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{date}</IndexTable.Cell>
                <IndexTable.Cell>{customer}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="end" numeric>
                        {total}
                    </Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const promotedBulkActions = [
        {
            content: 'Notify Customers',
            onAction: () => {
                const formData = new FormData();
                formData.append("myKey", "myValue");
                submit(formData, { method: "post" });
            },
        }
    ];
    return (
        <Card>
            <IndexTable
                condensed={useBreakpoints().smDown}
                resourceName={resourceName}
                itemCount={orders.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                hasMoreItems
                promotedBulkActions={promotedBulkActions}
                headings={[
                    { title: 'Order' },
                    { title: 'Date' },
                    { title: 'Customer' },
                    { title: 'Total', alignment: 'end' }
                ]}
            >
                {rowMarkup}
            </IndexTable>
        </Card>
    );
}