/**
 * Interface para os resultados da verificação de saúde
 */
export interface HealthCheckResult {
    /**
     * Status geral da aplicação
     * - 'ok': Todos os sistemas estão operacionais
     * - 'degraded': Alguns sistemas estão enfrentando problemas
     * - 'error': Sistemas críticos estão fora do ar
     */
    status: 'ok' | 'degraded' | 'error'

    /**
     * Timestamp de quando a verificação de saúde foi realizada
     */
    timestamp: string

    /**
     * Tempo de atividade da aplicação em formato legível
     */
    uptime: string

    /**
     * Versão da aplicação do package.json
     */
    version: string

    /**
     * Ambiente atual (development, production, alpha, etc.)
     */
    environment: string

    /**
     * Nome do servidor
     */
    hostname: string

    /**
     * Status dos serviços individuais
     * Incluído apenas em verificações de saúde detalhadas
     * - 'ok': Serviço está funcionando normalmente
     * - 'error': Serviço está com problemas
     * - 'unknown': Status do serviço não pôde ser determinado
     */
    services?: {
        [key: string]: 'ok' | 'error' | 'unknown'
    }
}
