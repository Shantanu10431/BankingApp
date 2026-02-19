const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const registerUser = async (name) => {
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
    const user = {
        name: `${name} ${uniqueId}`,
        email: `${name.toLowerCase().replace(' ', '')}${uniqueId}@example.com`,
        password: 'password123'
    };
    const res = await axios.post(`${API_URL}/auth/register`, user);
    return { token: res.data.token, accountNumber: res.data.user.accountNumber, email: user.email };
};

const run = async () => {
    try {
        console.log('1. Setting up User A...');
        const userA = await registerUser('User A');
        console.log(`   User A created (${userA.accountNumber})`);

        console.log('2. Setting up User B...');
        const userB = await registerUser('User B');
        console.log(`   User B created (${userB.accountNumber})`);

        console.log('3. User A deposits 1000...');
        await axios.post(
            `${API_URL}/transaction/deposit`,
            { amount: 1000, description: 'Initial Deposit' },
            { headers: { Authorization: `Bearer ${userA.token}` } }
        );

        console.log('4. User A transfers 100 to User B...');
        await axios.post(
            `${API_URL}/transaction/transfer`,
            { amount: 100, receiverAccountNumber: userB.accountNumber, description: 'Test Transfer' },
            { headers: { Authorization: `Bearer ${userA.token}` } }
        );

        console.log('5. Checking User A Transactions...');
        const histA = await axios.get(`${API_URL}/user/transactions`, { headers: { Authorization: `Bearer ${userA.token}` } });
        const txsA = histA.data.transactions;
        console.log(`   User A has ${txsA.length} transactions (Expected: 2 - 1 Deposit, 1 Transfer Debit)`);
        txsA.forEach(t => console.log(`   - [${t.type}] ${t.description} (Amount: ${t.amount})`));

        console.log('6. Checking User B Transactions...');
        const histB = await axios.get(`${API_URL}/user/transactions`, { headers: { Authorization: `Bearer ${userB.token}` } });
        const txsB = histB.data.transactions;
        console.log(`   User B has ${txsB.length} transactions (Expected: 1 - 1 Transfer Credit)`);
        txsB.forEach(t => console.log(`   - [${t.type}] ${t.description} (Amount: ${t.amount})`));

    } catch (error) {
        console.error('Test failed:', error.message);
        if (error.response) console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
};

run();
