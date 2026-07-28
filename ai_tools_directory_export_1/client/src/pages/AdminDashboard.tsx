import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: submissions, isLoading, refetch } = trpc.admin.submissions.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const approveSubmission = trpc.admin.approveSubmission.useMutation({
    onSuccess: () => {
      toast.success("Submission approved!");
      refetch();
      setSelectedSubmission(null);
    },
  });

  const rejectSubmission = trpc.admin.rejectSubmission.useMutation({
    onSuccess: () => {
      toast.success("Submission rejected!");
      refetch();
      setSelectedSubmission(null);
      setRejectReason("");
    },
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : submissions && submissions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-600">No pending submissions</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {submissions?.map(submission => (
                  <Card
                    key={submission.id}
                    className={`p-6 cursor-pointer transition-all ${selectedSubmission?.id === submission.id ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{submission.name}</h3>
                        <p className="text-sm text-slate-600">{submission.submitterEmail}</p>
                      </div>
                      <Badge variant={submission.isFeatured ? "default" : "secondary"}>
                        {submission.isFeatured ? "Featured" : "Standard"}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{submission.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">{submission.pricingType}</Badge>
                      <Badge variant="outline">{submission.paymentStatus}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Details Panel */}
            {selectedSubmission && (
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Review Submission</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Tool Name</p>
                      <p className="font-medium text-slate-900">{selectedSubmission.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Submitter</p>
                      <p className="font-medium text-slate-900">{selectedSubmission.submitterName || selectedSubmission.submitterEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Website</p>
                      <a href={selectedSubmission.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                        {selectedSubmission.websiteUrl}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Pricing</p>
                      <Badge variant="outline" className="capitalize">{selectedSubmission.pricingType}</Badge>
                    </div>
                  </div>

                  {selectedSubmission.status === "pending" && (
                    <div className="space-y-3">
                      <Button
                        onClick={() => approveSubmission.mutate(selectedSubmission.id)}
                        disabled={approveSubmission.isPending}
                        className="w-full gap-2"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </Button>

                      <div className="space-y-2">
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Rejection reason (optional)"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                          rows={3}
                        />
                        <Button
                          onClick={() => rejectSubmission.mutate({ id: selectedSubmission.id, reason: rejectReason })}
                          disabled={rejectSubmission.isPending}
                          variant="destructive"
                          className="w-full gap-2"
                        >
                          <X className="w-4 h-4" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedSubmission.status !== "pending" && (
                    <div className="text-center">
                      <Badge variant={selectedSubmission.status === "approved" ? "default" : "destructive"}>
                        {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                      </Badge>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
