import React from "react";
import { Button } from "../../components/ui/button";

export type ApplicationUser = {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type Application = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: ApplicationUser;
};

type AppDetailsDrawerProps = {
  open: boolean;
  application: Application | null;
  onClose: () => void;
  onApprove?: (id: string) => void | Promise<void>;
  onReject?: (id: string) => void | Promise<void>;
};

const AppDetailsDrawer: React.FC<AppDetailsDrawerProps> = ({ open, application, onClose, onApprove, onReject }) => {
  if (!open || !application) return null;
  const a = application;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl p-5 overflow-auto">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">Application Details</h3>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-muted-foreground">Applicant</div>
            <div>{a.user?.firstName} {a.user?.lastName} ({a.user?.username})</div>
            <div className="text-muted-foreground">{a.user?.email}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div>{a.status}</div>
          </div>
          {a.notes && (
            <div>
              <div className="text-muted-foreground">Notes</div>
              <div className="whitespace-pre-wrap">{a.notes}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground">Created</div>
              <div>{new Date(a.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Updated</div>
              <div>{new Date(a.updatedAt).toLocaleString()}</div>
            </div>
          </div>
          {a.status === "PENDING" && (
            <div className="flex gap-2 pt-2">
              {onApprove && (
                <Button variant="outline" onClick={() => onApprove(a.id)}>Approve</Button>
              )}
              {onReject && (
                <Button variant="destructive" onClick={() => onReject(a.id)}>Reject</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDetailsDrawer;
