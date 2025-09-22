"use client";

import { useState, useEffect } from "react";
import { User, Campaign } from "@/types";
import {
  Users,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, campaignResponse] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/campaign"),
      ]);

      const usersData = await usersResponse.json();
      const campaignData = await campaignResponse.json();

      setUsers(usersData);
      setCampaign(campaignData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  const getStatusIcon = (status: User["status"]) => {
    switch (status) {
      case "rewarded":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "verified":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: User["status"]) => {
    switch (status) {
      case "rewarded":
        return "Recompensado";
      case "verified":
        return "Verificado";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazado";
      default:
        return "Desconocido";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Administración
          </h1>
          <p className="text-gray-600">
            Gestión de la campaña de recompensas BNB
          </p>
        </div>

        {/* Campaign Stats */}
        {campaign && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Participantes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.currentUsers}/{campaign.maxUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">₿</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Recompensa
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.rewardAmount} BNB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Distribuido
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(
                      parseFloat(campaign.rewardAmount) * campaign.currentUsers
                    ).toFixed(3)}{" "}
                    BNB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    campaign.isActive ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {campaign.isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.isActive ? "Activa" : "Inactiva"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Historial de Usuarios ({users.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    X Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tweet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TX Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{user.id.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 font-mono">
                          {user.walletAddress.slice(0, 6)}...
                          {user.walletAddress.slice(-4)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(user.walletAddress)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.tweetUsername ? (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">
                            @{user.tweetUsername}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(`@${user.tweetUsername}`)
                            }
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={user.tweetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <span className="text-sm">Ver Tweet</span>
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(user.status)}
                        <span className="ml-2 text-sm text-gray-900">
                          {getStatusText(user.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.txHash ? (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 font-mono">
                            {user.txHash.slice(0, 6)}...{user.txHash.slice(-4)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(user.txHash!)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay usuarios registrados aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
