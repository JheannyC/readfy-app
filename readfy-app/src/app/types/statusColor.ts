import { StatusEnum } from "@prisma/client";

export const getStatusColor = (status: string) => {
  switch (status) {
    case StatusEnum.Finalizado:
      return "bg-green-100 text-green-800";
    case StatusEnum.Aberto:
      return "bg-blue-100 text-blue-800";
    case StatusEnum.Fechado:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
