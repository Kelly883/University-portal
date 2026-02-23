"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  details: any;
  performer: { name: string; email: string };
  targetUser?: { name: string; email: string };
  createdAt: string;
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/superadmin/audit");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <Loader2 className="animate-spin h-8 w-8 mx-auto" />;

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Performer</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="font-medium">{log.action}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{log.performer.name}</span>
                  <span className="text-xs text-muted-foreground">{log.performer.email}</span>
                </div>
              </TableCell>
              <TableCell>{log.entity}</TableCell>
              <TableCell className="max-w-xs truncate text-xs font-mono bg-slate-50 p-1 rounded">
                {JSON.stringify(log.details)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
