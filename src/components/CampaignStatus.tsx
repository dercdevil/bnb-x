"use client";

import { Users, Gift, Clock, CheckCircle } from "lucide-react";

interface CampaignStatusProps {
  currentUsers: number;
  maxUsers: number;
  rewardAmount: string;
  isActive: boolean;
}

export default function CampaignStatus({
  currentUsers,
  maxUsers,
  rewardAmount,
  isActive,
}: CampaignStatusProps) {
  const progress = (currentUsers / maxUsers) * 100;
  const remainingSpots = Math.max(0, maxUsers - currentUsers);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-6 text-white max-w-md w-full">
      <div className="text-center mb-6">
        <div className="bg-green-500/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-green-400/30">
          <Gift className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">
          Estado de la Campaña
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-medium">Participantes</span>
          </div>
          <span className="text-xl font-bold">
            {currentUsers}/{maxUsers}
          </span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-400 to-green-500 rounded-full h-3 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            <span className="font-medium">Recompensa</span>
          </div>
          <span className="text-xl font-bold">{rewardAmount} USDT</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive ? (
              <Clock className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span className="font-medium">Estado</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              isActive
                ? "bg-green-500/20 text-green-300 border-green-400/30"
                : "bg-red-500/20 text-red-300 border-red-400/30"
            }`}
          >
            {isActive ? "Activa" : "Finalizada"}
          </span>
        </div>

        {isActive && remainingSpots > 0 && (
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 text-center border border-green-400/30">
            <p className="text-lg font-semibold text-green-300">
              ¡Quedan {remainingSpots} lugares!
            </p>
            <p className="text-sm text-green-200">Apúrate y participa ahora</p>
          </div>
        )}

        {!isActive && (
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 text-center border border-red-400/30">
            <p className="text-lg font-semibold text-red-300">
              Campaña Finalizada
            </p>
            <p className="text-sm text-red-200">
              Se alcanzó el límite máximo de participantes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
