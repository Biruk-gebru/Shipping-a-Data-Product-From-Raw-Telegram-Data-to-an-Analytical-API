// Dashboard JavaScript - Interactive functionality

class PipelineDashboard {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadDashboardData();
        this.startAutoRefresh();
    }

    attachEventListeners() {
        const refreshBtn = document.getElementById('refreshBtn');
        const runPipelineBtn = document.getElementById('runPipelineBtn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }

        if (runPipelineBtn) {
            runPipelineBtn.addEventListener('click', () => this.runPipeline());
        }

        // Action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach((card, index) => {
            card.addEventListener('click', () => this.handleQuickAction(index));
        });

        // Pipeline steps
        const pipelineSteps = document.querySelectorAll('.pipeline-step');
        pipelineSteps.forEach(step => {
            step.addEventListener('click', () => {
                const stepName = step.dataset.step;
                this.showStepDetails(stepName);
            });
        });
    }

    async loadDashboardData() {
        try {
            this.showLoading();
            await this.fetchStats();
            await this.fetchPipelineStatus();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    async fetchStats() {
        try {
            // Since we might not have the API running yet, we'll use mock data
            // In production, this would fetch from your FastAPI endpoints
            const stats = {
                totalRuns: 156,
                totalMessages: 12847,
                totalImages: 3456,
                dataQuality: 98.5
            };

            this.updateStats(stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Use default values
            this.updateStats({
                totalRuns: 0,
                totalMessages: 0,
                totalImages: 0,
                dataQuality: 0
            });
        }
    }

    updateStats(stats) {
        const totalRunsEl = document.getElementById('totalRuns');
        const totalMessagesEl = document.getElementById('totalMessages');
        const totalImagesEl = document.getElementById('totalImages');

        if (totalRunsEl) {
            this.animateNumber(totalRunsEl, 0, stats.totalRuns, 1500);
        }
        if (totalMessagesEl) {
            this.animateNumber(totalMessagesEl, 0, stats.totalMessages, 2000);
        }
        if (totalImagesEl) {
            this.animateNumber(totalImagesEl, 0, stats.totalImages, 1800);
        }
    }

    animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    async fetchPipelineStatus() {
        // Mock pipeline status
        const status = {
            overall: 'running',
            steps: {
                scraper: 'success',
                loader: 'success',
                transform: 'running',
                enrich: 'pending'
            }
        };

        this.updatePipelineStatus(status);
    }

    updatePipelineStatus(status) {
        const statusBadge = document.getElementById('pipelineStatus');
        if (statusBadge) {
            statusBadge.textContent = status.overall.charAt(0).toUpperCase() + status.overall.slice(1);
            statusBadge.className = `badge badge-${this.getStatusClass(status.overall)}`;
        }

        // Update individual steps if needed
        Object.entries(status.steps).forEach(([step, stepStatus]) => {
            const stepEl = document.querySelector(`[data-step="${step}"]`);
            if (stepEl) {
                const statusEl = stepEl.querySelector('.step-status');
                if (statusEl) {
                    statusEl.className = `step-status status-${stepStatus}`;
                    statusEl.textContent = this.formatStatus(stepStatus);
                }
            }
        });
    }

    getStatusClass(status) {
        const statusMap = {
            'running': 'info',
            'success': 'success',
            'completed': 'success',
            'failed': 'error',
            'pending': 'warning'
        };
        return statusMap[status] || 'info';
    }

    formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    async runPipeline() {
        const btn = document.getElementById('runPipelineBtn');
        const originalText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="spinning">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="10 10"/>
            </svg>
            Running...
        `;

        try {
            // In production, this would trigger the Dagster pipeline
            await this.simulatePipelineRun();
            this.showSuccess('Pipeline started successfully!');
            await this.loadDashboardData();
        } catch (error) {
            console.error('Error running pipeline:', error);
            this.showError('Failed to start pipeline');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    simulatePipelineRun() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    handleQuickAction(index) {
        const actions = [
            'extract_and_load',
            'transform_only',
            'enrich_only',
            'view_schedules'
        ];

        const action = actions[index];

        switch (action) {
            case 'extract_and_load':
                this.showNotification('Starting Extract & Load job...');
                break;
            case 'transform_only':
                this.showNotification('Starting Transformations job...');
                break;
            case 'enrich_only':
                this.showNotification('Starting YOLO Detection job...');
                break;
            case 'view_schedules':
                this.showNotification('Opening Dagster UI...');
                // In production, open Dagster UI in new tab
                break;
        }
    }

    showStepDetails(stepName) {
        const stepInfo = {
            scraper: {
                title: 'Telegram Scraper',
                description: 'Extracts messages and images from Telegram channels',
                lastRun: '2 hours ago',
                duration: '3m 45s'
            },
            loader: {
                title: 'Data Loader',
                description: 'Loads raw JSON data into PostgreSQL',
                lastRun: '2 hours ago',
                duration: '1m 12s'
            },
            transform: {
                title: 'dbt Transform',
                description: 'Transforms data using dbt models',
                lastRun: 'Running',
                duration: 'In progress'
            },
            enrich: {
                title: 'YOLO Enrichment',
                description: 'Detects objects in images using YOLOv8',
                lastRun: 'Pending',
                duration: 'Not started'
            }
        };

        const info = stepInfo[stepName];
        if (info) {
            this.showNotification(`${info.title}: ${info.description}`);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            z-index: 1000;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showSuccess(message) {
        this.showNotification('✓ ' + message);
    }

    showError(message) {
        this.showNotification('✗ ' + message);
    }

    showLoading() {
        // Could add a loading overlay
        console.log('Loading...');
    }

    hideLoading() {
        console.log('Loading complete');
    }

    startAutoRefresh() {
        // Refresh dashboard every 30 seconds
        setInterval(() => {
            this.loadDashboardData();
        }, 30000);
    }
}

// Add animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .spinning {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PipelineDashboard();
});
