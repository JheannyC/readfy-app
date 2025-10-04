export interface DashboardResponse {
  totalLivrosRegistrados: number;
  livrosNaoIniciados: number;
  livrosAbertos: number;
  livrosFinalizados: number;
  totalPaginasLidas: number;
  livrosPorGenero?: Array<{
    genero: string;
    quantidade: number;
  }>;
  livrosPorAno?: Array<{
    ano: number;
    quantidade: number;
  }>;
  livrosRecentes?: Array<{
    id: string;
    titulo: string;
    autor: string;
    status: string;
    createdAt: string;
  }>;
}

export interface DashboardDetailsResponse {
  estatisticasLeitura?: {
    tempoMedioLeitura: number;
    livrosLidosUltimoMes: number;
    paginasLidasUltimaSemana: number;
    generoMaisLido: string;
  };
  metas?: {
    livrosMetaAnual: number;
    livrosLidosAno: number;
    progressoMeta: number;
  };
  insights?: {
    autorMaisLido: string;
    livroMelhorAvaliado: string;
    livroAtual: string;
  };
}

// Versão alternativa mais simples se preferir
export interface SimpleDashboardResponse {
  totalLivros: number;
  livrosNaoLidos: number;
  livrosLendo: number;
  livrosLidos: number;
  totalPaginas: number;
}

export interface SimpleDashboardDetails {
  progressoLeitura: number;
  avaliacaoMedia: number;
  livroAtual?: string;
}