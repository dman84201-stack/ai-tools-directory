import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Check, AlertCircle, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function SubmitTool() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    tags: "",
    pricingType: "freemium" as const,
    websiteUrl: "",
    affiliateUrl: "",
    submitterEmail: "",
    submitterName: "",
    isFeatured: false,
  });

  const { data: categories } = trpc.categories.list.useQuery();
  const submitMutation = trpc.submissions.create.useMutation();
  const createOrderMutation = trpc.paypalCheckout.createOrder.useMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Tool name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.websiteUrl.trim()) newErrors.websiteUrl = "Website URL is required";
    if (!formData.submitterEmail.trim()) newErrors.submitterEmail = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
      newErrors.submitterEmail = "Valid email is required";
    }

    try {
      new URL(formData.websiteUrl);
    } catch {
      newErrors.websiteUrl = "Valid URL is required";
    }

    if (formData.affiliateUrl && formData.affiliateUrl.trim()) {
      try {
        new URL(formData.affiliateUrl);
      } catch {
        newErrors.affiliateUrl = "Valid URL is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the submission first
      const submission = await submitMutation.mutateAsync({
        ...formData,
        categoryId: parseInt(formData.categoryId),
      });

      // If featured placement is requested, create PayPal order
      if (formData.isFeatured && submission && (submission as any).id) {
        const order = await createOrderMutation.mutateAsync({
          submissionId: submission.id,
          toolName: formData.name,
          submitterEmail: formData.submitterEmail,
          submitterName: formData.submitterName || formData.name,
        });

        if (order.approvalLink) {
          toast.success("Redirecting to PayPal...");
          // Open PayPal approval link in new tab
          window.open(order.approvalLink, "_blank");
          setIsSuccess(true);
          setTimeout(() => {
            setLocation("/");
          }, 2000);
        }
      } else {
        setIsSuccess(true);
        toast.success("Tool submitted successfully!");
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to submit tool. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Submitted!</h1>
          <p className="text-slate-600 mb-6">
            {formData.isFeatured 
              ? "Your tool has been submitted and payment processed. We'll review it shortly."
              : "Your tool has been submitted for review. We'll notify you soon."}
          </p>
          <Button onClick={() => setLocation("/")} className="w-full">Back to Directory</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Button variant="ghost" className="mb-4" onClick={() => setLocation("/")}>← Back</Button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Submit Your AI Tool</h1>
          <p className="text-slate-600 text-lg">Get your AI tool discovered by thousands of users</p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              {/* Tool Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Tool Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., ChatGPT, Midjourney"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description *
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe what your tool does and its key features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-500" : "border-slate-300"
                  }`}
                  rows={4}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-slate-700">
                  Category *
                </Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags" className="text-sm font-medium text-slate-700">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  placeholder="e.g., AI, Writing, Chat, Productivity"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              {/* Pricing Type */}
              <div>
                <Label htmlFor="pricing" className="text-sm font-medium text-slate-700">
                  Pricing Type *
                </Label>
                <Select value={formData.pricingType} onValueChange={(value: any) => setFormData({ ...formData, pricingType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* URLs */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Links</h2>
            <div className="space-y-4">
              {/* Website URL */}
              <div>
                <Label htmlFor="websiteUrl" className="text-sm font-medium text-slate-700">
                  Website URL *
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className={errors.websiteUrl ? "border-red-500" : ""}
                />
                {errors.websiteUrl && <p className="text-red-600 text-sm mt-1">{errors.websiteUrl}</p>}
              </div>

              {/* Affiliate URL */}
              <div>
                <Label htmlFor="affiliateUrl" className="text-sm font-medium text-slate-700">
                  Affiliate URL (optional)
                </Label>
                <Input
                  id="affiliateUrl"
                  type="url"
                  placeholder="https://affiliate.example.com"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  className={errors.affiliateUrl ? "border-red-500" : ""}
                />
                {errors.affiliateUrl && <p className="text-red-600 text-sm mt-1">{errors.affiliateUrl}</p>}
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              {/* Submitter Name */}
              <div>
                <Label htmlFor="submitterName" className="text-sm font-medium text-slate-700">
                  Your Name
                </Label>
                <Input
                  id="submitterName"
                  placeholder="John Doe"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                />
              </div>

              {/* Submitter Email */}
              <div>
                <Label htmlFor="submitterEmail" className="text-sm font-medium text-slate-700">
                  Email *
                </Label>
                <Input
                  id="submitterEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  className={errors.submitterEmail ? "border-red-500" : ""}
                />
                {errors.submitterEmail && <p className="text-red-600 text-sm mt-1">{errors.submitterEmail}</p>}
              </div>
            </div>
          </Card>

          {/* Featured Placement */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex items-center h-6">
                <Checkbox
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked: any) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="featured" className="text-base font-semibold text-slate-900 cursor-pointer flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
                  Request Featured Placement - $99
                </Label>
                <p className="text-slate-600 text-sm mt-2">
                  Get premium visibility on our homepage. Your tool will be featured in the "Featured Tools" section with a sponsored badge.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-700">Benefits:</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>✓ Premium placement on homepage</li>
                    <li>✓ "Sponsored" badge for credibility</li>
                    <li>✓ 30-day featured listing</li>
                    <li>✓ Increased visibility and traffic</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                `Submit Tool${formData.isFeatured ? " & Pay $99" : ""}`
              )}
            </Button>
          </div>

          {/* Info Note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">All submissions are reviewed</p>
              <p>Our team reviews each submission to ensure quality. You'll receive an email confirmation once your tool is approved.</p>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
