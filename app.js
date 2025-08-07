class TransactionExplorer {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.pageSize = 50;
        this.totalPages = 0;
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        document.getElementById('load-data').addEventListener('click', () => this.loadData());
        document.getElementById('search').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('filter-status').addEventListener('change', (e) => this.handleFilter());
        document.getElementById('filter-fraud').addEventListener('change', (e) => this.handleFilter());
        document.getElementById('prev-page').addEventListener('click', () => this.previousPage());
        document.getElementById('next-page').addEventListener('click', () => this.nextPage());
        
        // Auto-load data on page load
        this.loadData();
    }
    
    async loadData() {
        try {
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('data-table').classList.add('hidden');
            document.getElementById('pagination').classList.add('hidden');
            
            const response = await fetch('data.csv');
            const csvText = await response.text();
            
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    this.data = results.data;
                    this.filteredData = [...this.data];
                    this.updateStats();
                    this.renderTable();
                    this.updatePagination();
                    
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('data-table').classList.remove('hidden');
                    document.getElementById('pagination').classList.remove('hidden');
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                    alert('Error loading data. Please check the console for details.');
                }
            });
        } catch (error) {
            console.error('Error loading CSV file:', error);
            alert('Error loading CSV file. Please make sure data.csv is accessible.');
        }
    }
    
    updateStats() {
        const totalTransactions = this.data.length;
        const fraudCount = this.data.filter(row => row.fraud === '1').length;
        const declinedCount = this.data.filter(row => row.state === 'declined').length;
        const fraudRate = totalTransactions > 0 ? ((fraudCount / totalTransactions) * 100).toFixed(2) : 0;
        
        document.getElementById('total-transactions').textContent = totalTransactions.toLocaleString();
        document.getElementById('fraud-count').textContent = fraudCount.toLocaleString();
        document.getElementById('declined-count').textContent = declinedCount.toLocaleString();
        document.getElementById('fraud-rate').textContent = fraudRate + '%';
    }
    
    handleSearch(searchTerm) {
        this.applyFilters();
    }
    
    handleFilter() {
        this.applyFilters();
    }
    
    applyFilters() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const fraudFilter = document.getElementById('filter-fraud').value;
        
        this.filteredData = this.data.filter(row => {
            const matchesSearch = !searchTerm || 
                Object.values(row).some(value => 
                    String(value).toLowerCase().includes(searchTerm)
                );
            
            const matchesStatus = !statusFilter || row.state === statusFilter;
            const matchesFraud = !fraudFilter || row.fraud === fraudFilter;
            
            return matchesSearch && matchesStatus && matchesFraud;
        });
        
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }
    
    renderTable() {
        if (this.filteredData.length === 0) return;
        
        const headers = Object.keys(this.filteredData[0]);
        this.renderHeaders(headers);
        this.renderRows();
    }
    
    renderHeaders(headers) {
        const headerRow = document.getElementById('table-header');
        headerRow.innerHTML = headers.map(header => 
            `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="explorer.sortBy('${header}')">
                ${this.formatHeaderName(header)}
                <i class="fas fa-sort ml-1 text-gray-400"></i>
            </th>`
        ).join('');
    }
    
    renderRows() {
        const tbody = document.getElementById('table-body');
        const startIdx = (this.currentPage - 1) * this.pageSize;
        const endIdx = Math.min(startIdx + this.pageSize, this.filteredData.length);
        const pageData = this.filteredData.slice(startIdx, endIdx);
        
        tbody.innerHTML = pageData.map(row => 
            `<tr class="hover:bg-gray-50">
                ${Object.values(row).map(value => 
                    `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${this.formatCellValue(value)}
                    </td>`
                ).join('')}
            </tr>`
        ).join('');
    }
    
    formatHeaderName(header) {
        return header
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    formatCellValue(value) {
        if (!value || value === '') return '-';
        
        // Format currency amounts
        if (typeof value === 'string' && value.match(/^\d+\.\d{2}$/)) {
            return '$' + parseFloat(value).toLocaleString();
        }
        
        // Format boolean values
        if (value === '1' || value === 'True') {
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Yes</span>';
        }
        if (value === '0' || value === 'False') {
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">No</span>';
        }
        
        // Format status values
        if (value === 'declined') {
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Declined</span>';
        }
        if (value === 'pending') {
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>';
        }
        
        // Truncate long text
        if (typeof value === 'string' && value.length > 50) {
            return `<span title="${value}">${value.substring(0, 50)}...</span>`;
        }
        
        return value;
    }
    
    sortBy(column) {
        const currentSort = this.currentSort;
        if (currentSort && currentSort.column === column) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort = { column, direction: 'asc' };
        }
        
        this.filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            
            // Handle numeric values
            if (!isNaN(aVal) && !isNaN(bVal)) {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }
            
            if (aVal < bVal) return this.currentSort.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        this.renderRows();
        this.updateSortIcons();
    }
    
    updateSortIcons() {
        // Reset all sort icons
        document.querySelectorAll('#table-header i').forEach(icon => {
            icon.className = 'fas fa-sort ml-1 text-gray-400';
        });
        
        // Update current sort icon
        if (this.currentSort) {
            const headerCells = document.querySelectorAll('#table-header th');
            const headers = Object.keys(this.filteredData[0]);
            const columnIndex = headers.indexOf(this.currentSort.column);
            
            if (columnIndex >= 0) {
                const icon = headerCells[columnIndex].querySelector('i');
                icon.className = `fas fa-sort-${this.currentSort.direction === 'asc' ? 'up' : 'down'} ml-1 text-blue-600`;
            }
        }
    }
    
    updatePagination() {
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        
        const startIdx = (this.currentPage - 1) * this.pageSize + 1;
        const endIdx = Math.min(this.currentPage * this.pageSize, this.filteredData.length);
        
        document.getElementById('page-info').textContent = 
            `${startIdx}-${endIdx} of ${this.filteredData.length.toLocaleString()}`;
        
        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = this.currentPage === this.totalPages;
        
        // Update button styles
        document.getElementById('prev-page').classList.toggle('opacity-50', this.currentPage === 1);
        document.getElementById('next-page').classList.toggle('opacity-50', this.currentPage === this.totalPages);
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderRows();
            this.updatePagination();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.renderRows();
            this.updatePagination();
        }
    }
}

// Initialize the application
const explorer = new TransactionExplorer();