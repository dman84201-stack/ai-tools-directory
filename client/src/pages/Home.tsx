import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowRight, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FeaturedSection from "./FeaturedSection";
import AISearchModal from "@/components/AISearchModal";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [aiSearchOpen, setAISearchOpen] = useState(false);

  const { data: tools, isLoading: toolsLoading } = trpc.tools.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    let filtered: any[] = tools;
    if (selectedCategory) {
      filtered = filtered.filter((t: any) => t.categoryId === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t: any) => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query));
    }
    return filtered;
  }, [tools, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Discover AI Tools</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">Curated directory of the best AI software for every niche. Find the perfect tool to power your workflow.</p>
          
          {/* Search Bar */}
          <div className="flex gap-2 max-w-2xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button onClick={() => setAISearchOpen(true)} variant="outline" className="h-12 px-4 gap-2">
              <Sparkles className="w-4 h-4" />
              AI Search
            </Button>
            <Button onClick={() => setLocation("/submit")} className="h-12 px-6">Submit Tool</Button>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <FeaturedSection />

      {/* Category Filter */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              All Tools
            </Button>
            {categories?.map((cat: any) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner - slim, dismissible, clearly labeled */}
      <AdBanner />

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {toolsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No tools found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool: any) => (
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
                  <Badge variant="outline" className="text-xs">{tool.pricingType}</Badge>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* AI Search Modal */}
      <AISearchModal open={aiSearchOpen} onOpenChange={setAISearchOpen} />

      <Footer />
    </div>
  );
}
