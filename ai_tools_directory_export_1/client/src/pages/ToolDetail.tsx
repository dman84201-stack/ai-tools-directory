import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink, Tag } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ToolDetail() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: tool, isLoading } = trpc.tools.getBySlug.useQuery(slug, {
    enabled: !!slug,
  });

  const { data: category } = trpc.categories.getById.useQuery(tool?.categoryId as number, {
    enabled: !!tool?.categoryId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tool not found</h1>
          <p className="text-slate-600">The tool you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{tool.name}</h1>
              <p className="text-slate-600 text-lg">{tool.description}</p>
            </div>
            {tool.isFeatured !== "none" && (
              <Badge variant={tool.isFeatured === "sponsored" ? "destructive" : "default"} className="ml-4">
                {tool.isFeatured}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <p className="text-sm text-slate-500 mb-1">Pricing</p>
              <Badge variant="outline" className="capitalize">{tool.pricingType}</Badge>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Category</p>
              <p className="font-medium text-slate-900">{category?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Added</p>
              <p className="font-medium text-slate-900">{new Date(tool.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Status</p>
              <Badge variant="secondary">Verified</Badge>
            </div>
          </div>

          {/* Tags */}
          {tool.tags && (
            <div className="mb-8">
              <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {tool.tags.split(",").map(tag => (
                  <Badge key={tag} variant="secondary">{tag.trim()}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <ExternalLink className="w-4 h-4" /> Visit Website
              </Button>
            </a>
            {tool.affiliateUrl && (
              <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" /> Affiliate Link
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Long Description */}
        {tool.longDescription && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{tool.longDescription}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
