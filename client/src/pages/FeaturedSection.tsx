import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function FeaturedSection() {
  const [, setLocation] = useLocation();
  const { data: featuredTools, isLoading } = trpc.tools.featured.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!featuredTools || featuredTools.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <h2 className="text-2xl font-bold text-slate-900">Featured Tools</h2>
          <Badge className="bg-amber-500 hover:bg-amber-600">Sponsored</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool: any) => (
            <Card
              key={tool.id}
              onClick={() => setLocation(`/tool/${tool.slug}`)}
              className="p-6 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col border-2 border-amber-200 bg-white hover:border-amber-400"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{tool.name}</h3>
                  {tool.isFeatured === "sponsored" && (
                    <Badge className="mt-1 bg-amber-500 hover:bg-amber-600">
                      Premium Sponsor
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4 flex-1">{tool.description}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {tool.tags?.split(",").slice(0, 3).map((tag: any) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                <Badge variant="outline" className="text-xs capitalize">
                  {tool.pricingType}
                </Badge>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
