// مانیتورینگ Real-time با WebSocket
class RealTimeMonitor {
    constructor() {
        this.connections = new Set();
        this.metrics = new Map();
        this.alertSystem = new AlertSystem();
    }

    // ارسال متریک‌های Real-time
    broadcastMetrics() {
        setInterval(() => {
            const metrics = this.collectRealTimeMetrics();
            const message = JSON.stringify({
                type: 'metrics',
                data: metrics,
                timestamp: Date.now()
            });

            this.connections.forEach(connection => {
                if (connection.readyState === WebSocket.OPEN) {
                    connection.send(message);
                }
            });
        }, 1000); // هر ثانیه
    }

    collectRealTimeMetrics() {
        return {
            cpu: process.cpuUsage(),
            memory: process.memoryUsage(),
            connections: this.getActiveConnections(),
            responseTimes: this.getResponseTimeStats(),
            throughput: this.getThroughput(),
            errorRate: this.getErrorRate()
        };
    }

    getResponseTimeStats() {
        return {
            p50: this.calculatePercentile(50),
            p95: this.calculatePercentile(95),
            p99: this.calculatePercentile(99),
            max: Math.max(...this.responseTimes)
        };
    }

    calculatePercentile(percentile) {
        const sorted = [...this.responseTimes].sort((a, b) => a - b);
        const index = Math.ceil(percentile / 100 * sorted.length) - 1;
        return sorted[index] || 0;
    }
}

// سیستم هشدار هوشمند
class IntelligentAlertSystem {
    constructor() {
        this.thresholds = new Map();
        this.anomalyDetector = new AnomalyDetector();
    }

    async checkAndAlert(metrics) {
        // تشخیص ناهنجاری با ML
        const anomalies = await this.anomalyDetector.detect(metrics);
        
        // بررسی آستانه‌ها
        const thresholdAlerts = this.checkThresholds(metrics);
        
        // ترکیب هشدارها
        const allAlerts = [...anomalies, ...thresholdAlerts];
        
        // ارسال هشدارهای مهم
        this.sendCriticalAlerts(allAlerts);
    }

    checkThresholds(metrics) {
        const alerts = [];
        
        for (const [metric, threshold] of this.thresholds) {
            const value = metrics[metric];
            if (value !== undefined && this.exceedsThreshold(value, threshold)) {
                alerts.push({
                    type: 'threshold',
                    metric,
                    value,
                    threshold,
                    severity: this.calculateSeverity(value, threshold)
                });
            }
        }
        
        return alerts;
    }

    exceedsThreshold(value, threshold) {
        if (threshold.direction === 'above') {
            return value > threshold.value;
        } else {
            return value < threshold.value;
        }
    }
}
