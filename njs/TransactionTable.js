const TransactionTable = {
    init: async () => {
        try {
            await updateTable();
            startAutoUpdate();
        } catch (error) {
            handleError(error, 'Initialization failed');
        }
    },

    cleanup: () => {
        if (updateInterval) clearInterval(updateInterval);
    }
};

let updateInterval = null;

async function fetchTransactions(url) {
    const response = await fetch(`${url}?t=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Object.entries(data).map(([id, tx]) => ({
        id,
        ...tx
    }));
}

async function updateTable() {
    const transactions = await fetchTransactions('faucet-config/usersClaim.json');
    if (!Array.isArray(transactions) || !transactions.length) return;
    populateTable(transactions);
}

function populateTable(transactions) {
    const validTxs = transactions.filter(tx => !isNaN(new Date(tx.last_claim_datetime)));
    if (!validTxs.length) return;

    const tbody = document.getElementById('transactionTableBody');
    tbody.innerHTML = validTxs
        .sort((a, b) => new Date(b.last_claim_datetime) - new Date(a.last_claim_datetime))
        .slice(0, 10)
        .map(tx => `
      <tr class="hover:bg-purple-900/10 transition-colors duration-300">
        <td class="px-4 py-2 text-center text-sm text-gray-300 border-b border-[rgba(178,8,8,1)]">${tx.id}</td>
        <td class="px-4 py-2 text-center text-sm text-green-500 border-b border-[rgba(178,8,8,1)]">${protectEmail(tx.email)}</td>
        <td class="px-4 py-2 text-center text-sm text-gray-300 border-b border-[rgba(178,8,8,1)]">${tx.last_claim_datetime}</td>
      </tr>
    `).join('') || `
      <tr>
        <td colspan="3" class="text-center text-gray-500 py-4">No transactions available.</td>
      </tr>
    `;
}

function protectEmail(email) {
    const [name, domain] = email.split('@');
    return `${name.slice(0, 2)}${'*'.repeat(name.length - 2)}@${domain}`;
}

function startAutoUpdate() {
    updateInterval = setInterval(() => updateTable().catch(error =>
        handleError(error, 'Auto-update failed')), 5000);
}

function handleError(error, context) {
    console.error(`${context}:`, error.message);
    AlertHandler.showAlert(`Error: ${error.message}`, 'error', 'alertContainer');
}