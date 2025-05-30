import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, User, Building2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RiskManagement({
  risks,
  detailed = false,
}: {
  risks: any[];
  detailed?: boolean;
}) {
  const riskLevels = {
    high: risks.filter((r) => r.severity === "High").length,
    medium: risks.filter((r) => r.severity === "Medium").length,
    low: risks.filter((r) => r.severity === "Low").length,
  };

  return (
    <div className="space-y-2">
      {!detailed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Risk Overview
            </CardTitle>
            <CardDescription>
              Current risk distribution and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {riskLevels.high}
                  </p>
                  <p className="text-xs text-muted-foreground">High Risk</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {riskLevels.medium}
                  </p>
                  <p className="text-xs text-muted-foreground">Medium Risk</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {riskLevels.low}
                  </p>
                  <p className="text-xs text-muted-foreground">Low Risk</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="flex flex-col items-center align-center pt-4">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {detailed ? "Risk Register" : "Active Risks"}
          </CardTitle>
          <CardDescription>
            {detailed
              ? "Comprehensive risk management and tracking"
              : "Current risks requiring attention"}
          </CardDescription>
        </div>
        <CardContent>
          <ScrollArea className="space-y-2 h-[400px]">
            {risks?.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 mt-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">
                      {risk?.title || "Unknown Risk"}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        risk?.severity === "High"
                          ? "destructive"
                          : risk?.severity === "Medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {risk?.severity || "Unknown"}
                    </Badge>
                    <Badge variant="outline">{risk?.status || "Unknown"}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {risk?.description || "No description available"}
                </p>
                {detailed && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="font-medium ml-2">
                        {risk?.impact || 0}/10
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Probability:
                      </span>
                      <span className="font-medium ml-2">
                        {((risk?.probability || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="text-sm">
                        {risk?.owner || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span className="text-sm truncate">
                        {risk?.project || "N/A"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Risk Score</span>
                    <span>
                      {(
                        (risk?.impact || 0) *
                        (risk?.probability || 0) *
                        10
                      ).toFixed(1)}
                      /100
                    </span>
                  </div>
                  <Progress
                    value={(risk?.impact || 0) * (risk?.probability || 0) * 10}
                    className="h-2"
                  />
                </div>

                {detailed && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Identified:{" "}
                      {risk?.identifiedDate
                        ? new Date(risk.identifiedDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span>
                      Target Resolution:{" "}
                      {risk?.targetResolution
                        ? new Date(risk.targetResolution).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                )}
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-8">
                No risks found
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
