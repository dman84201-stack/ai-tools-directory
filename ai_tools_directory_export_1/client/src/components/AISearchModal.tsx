import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface AISearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AISearchModal({ open, onOpenChange }: AISearchModalProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: results = [], isLoading, refetch } = trpc.tools.aiSearch.useQuery(query, {
    enabled: false,
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setError(null);
    setHasSearched(true);
    try {
      await refetch();
    } catch (err) {
      setError("Failed to search. Please try again.");
      console.error("Search error:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  const handleClose = () => {
    setQuery("");
    setHasSearched(false);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI-Powered Tool Search
          </DialogTitle>
          <DialogDescription>
            Describe your task or problem, and AI will find the perfect tools for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., 'I need to generate product images' or 'Create social media videos quickly'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          {hasSearched && results.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <p className="text-sm font-semibold text-slate-700">
                Found {results.length} matching tool{results.length !== 1 ? "s" : ""}:
              </p>
              {results.map((tool: any) => (
                <div
                  key={tool.id}
                  onClick={() => {
                    setLocation(`/tool/${tool.slug}`);
                    handleClose();
                  }}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{tool.name}</h3>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{tool.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {tool.tags?.split(",").slice(0, 3).map((tag: any) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs capitalize">
                      {tool.pricingType}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {hasSearched && !isLoading && results.length === 0 && !error && (
            <div className="text-center py-8 text-slate-500">
              <p>No tools found matching your description.</p>
              <p className="text-sm mt-2">Try a different search query.</p>
            </div>
          )}

          {/* Empty State */}
          {!hasSearched && (
            <div className="text-center py-8 text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Describe what you're looking for...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
