// Load Balancer هوشمند با الگوریتم‌های پیشرفته
class IntelligentLoadBalancer {
    constructor() {
        this.servers = new Map();
        this.healthChecker = new HealthChecker();
        this.metricsCollector = new MetricsCollector();
        this.algorithm = 'weighted_least_connections';
    }

    // انتخاب سرور بهینه
    selectServer(request) {
        const healthyServers = this.getHealthyServers();
        
        switch (this.algorithm) {
            case 'weighted_least_connections':
                return this.weightedLeastConnections(healthyServers);
            case 'latency_based':
                return this.latencyBasedSelection(healthyServers, request);
            case 'ai_predictive':
                return this.aiPredictiveSelection(healthyServers, request);
            default:
                return this.roundRobin(healthyServers);
        }
    }

    // الگوریتم وزن‌دار کمترین اتصال
    weightedLeastConnections(servers) {
        return servers.reduce((best, server) => {
            const currentScore = server.connections * server.weight;
            const bestScore = best.connections * best.weight;
            return currentScore < bestScore ? server : best;
        });
    }

    // انتخاب مبتنی بر تاخیر
    latencyBasedSelection(servers, request) {
        const clientRegion = this.detectClientRegion(request);
        
        return servers.reduce((best, server) => {
            const latency = this.calculateLatency(server, clientRegion);
            const score = latency * server.performanceFactor;
            const bestScore = best.latency * best.performanceFactor;
            return score < bestScore ? { ...server, latency } : best;
        });
    }

    // پیش‌بینی هوشمند با AI
    aiPredictiveSelection(servers, request) {
        const features = this.extractRequestFeatures(request);
        const predictions = servers.map(server => ({
            server,
            loadPrediction: this.predictLoad(server, features),
            performancePrediction: this.predictPerformance(server, features)
        }));

        return predictions.reduce((best, current) => {
            const currentScore = this.calculateAIScore(current);
            const bestScore = this.calculateAIScore(best);
            return currentScore > bestScore ? current.server : best.server;
        });
    }

    calculateAIScore(prediction) {
        return (1 - prediction.loadPrediction) * prediction.performancePrediction;
    }
}

// Health Checker پیشرفته
class AdvancedHealthChecker {
    constructor() {
        this.checks = [
            'tcp_connect',
            'http_response',
            'database_connectivity',
            'disk_space',
            'memory_usage'
        ];
    }

    async performHealthCheck(server) {
        const results = await Promise.allSettled(
            this.checks.map(check => this.performSingleCheck(server, check))
        );

        const score = results.filter(r => r.status === 'fulfilled').length / this.checks.length;
        
        return {
            healthy: score > 0.7,
            score: score,
            details: results.map((r, i) => ({
                check: this.checks[i],
                status: r.status,
                value: r.status === 'fulfilled' ? r.value : r.reason
            }))
        };
    }

    async performSingleCheck(server, checkType) {
        switch (checkType) {
            case 'tcp_connect':
                return await this.tcpConnectCheck(server);
            case 'http_response':
                return await this.httpResponseCheck(server);
            case 'database_connectivity':
                return await this.databaseCheck(server);
            default:
                return true;
        }
    }
}
