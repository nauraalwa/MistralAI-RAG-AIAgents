const data = [
    { transaction_id: 'T1001', customer_id: 'C001', payment_amount: 125.50, payment_date: '2021-10-05', payment_status: 'Paid' },
    { transaction_id: 'T1002', customer_id: 'C002', payment_amount: 89.99, payment_date: '2021-10-06', payment_status: 'Unpaid' },
    { transaction_id: 'T1003', customer_id: 'C003', payment_amount: 120.00, payment_date: '2021-10-07', payment_status: 'Paid' },
    { transaction_id: 'T1004', customer_id: 'C002', payment_amount: 54.30, payment_date: '2021-10-05', payment_status: 'Paid' },
    { transaction_id: 'T1005', customer_id: 'C001', payment_amount: 210.20, payment_date: '2021-10-08', payment_status: 'Pending' }
];

export function getPaymentStatus({transactionId}) {
    const transaction = data.find(row => row.transaction_id === transactionId);
    if (transaction) {
        return JSON.stringify({ status: transaction.payment_status });
    } 
    return JSON.stringify({ error: 'transaction id not found.' });
}

export function getPaymentDate({ transactionId }) {
    const transaction = data.find(row => row.transaction_id === transactionId);
    if (transaction) {
        return JSON.stringify({ date: transaction.payment_date });
    } 
    return JSON.stringify({ error: 'transaction id not found.' });
}

// Describes the function to the AI
//AI doesn't look at the code inside the function, so we have to give an outline of what the function does. 
//AI then decides whether or not to call the function
//The schema below shows the outline

export const tools = [
    {
        "type": "function",
        "function": {
            "name": "getPaymentStatus",
            "description": "Get payment status of a transaction",
            "parameters": {
                "type": "object",
                "properties": {
                    "transactionId": {
                        "type": "string",
                        "description": "The transaction id.",
                    }
                },
                "required": ["transactionId"],
            },
        },
    }, {
        "type": "function",
        "function": {
            "name": "getPaymentDate",
            "description": "Get payment date of a transaction",
            "parameters": {
                "type": "object",
                "properties": {
                    "transactionId": {
                        "type": "string",
                        "description": "The transaction id.",
                    }
                },
                "required": ["transactionId"],
            },
        },
    }
]