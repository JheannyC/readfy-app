export interface DashboardResponse {
  totalLivrosRegistrados: number;
  livrosAbertos: number;
  livrosNaoIniciados: number;
  livrosFinalizados: number;
  totalPaginasLidas?: number;
  details?: string;
}
