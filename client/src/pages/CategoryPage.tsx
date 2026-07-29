import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CategoryPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const slug = params?.slug as string;

  const { data: category, isLoading: categoryLoading } = trpc.categories.getBySlug.useQuery(slug, {
    enabled: !!slug,
  });

  const { data: tools, isLoading: toolsLoading } = trpc.tools.byCategory.useQuery(category?.id || 0, {
    enabled: !!category?.id,
  });

  if (categoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Category not found</h1>
          <Button onClick={() => setLocation("/")}>Back to Directory</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Button variant="ghost" className="mb-4" onClick={() => setLocation("/")}>← Back</Button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{category.name}</h1>
          <p className="text-slate-600 text-lg">{category.description}</p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {toolsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : !tools || tools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No tools in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool: any) => (
              <Card
                key={tool.id}
                onClick={() => setLocation(`/tool/${tool.slug}`)}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 flex-1">{tool.name}</h3>
                  {tool.isFeatured !== "none" && (
                    <Badge className="ml-2" variant={tool.isFeatured === "sponsored" ? "destructive" : "default"}>
                      {tool.isFeatured}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 text-sm mb-4 flex-1">{tool.description}</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {tool.tags?.split(",").slice(0, 2).map((tag: any) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag.trim()}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <Badge variant="outline" className="text-xs capitalize">{tool.pricingType}</Badge>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
