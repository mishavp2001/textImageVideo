// @ts-nocheck
import React, { useState } from 'react';
import { apiClient } from "@/lib/amplify-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

const categories = ["AI/ML", "Data", "Finance", "Social", "Weather", "Maps", "Utilities", "Other"];
const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface PublishAPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PublishAPIDialog({ open, onOpenChange }: PublishAPIDialogProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoint_url: "",
    method: "GET",
    category: "Other",
    free_requests_limit: 100,
    price_per_request: 0.01,
    example_request: "",
    example_response: ""
  });

  const createAPIMutation = useMutation({
    mutationFn: (data: any) => apiClient.apis.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] });
      toast.success("API published successfully!");
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        endpoint_url: "",
        method: "GET",
        category: "Other",
        free_requests_limit: 100,
        price_per_request: 0.01,
        example_request: "",
        example_response: ""
      });
    },
    onError: (error: any) => {
      console.error("Error publishing API:", error);
      toast.error(error?.message || "Failed to publish API. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse JSON strings for example_request and example_response
      const dataToSubmit = {
        ...formData,
        owner_id: user?.userId || user?.username, // Set the owner
        example_request: formData.example_request && formData.example_request.trim() ?
          JSON.parse(formData.example_request) : null,
        example_response: formData.example_response && formData.example_response.trim() ?
          JSON.parse(formData.example_response) : null,
      };

      createAPIMutation.mutate(dataToSubmit);
    } catch (error) {
      toast.error("Invalid JSON in example request or response. Please check your input.");
      console.error("JSON parse error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Publish Your API
          </DialogTitle>
          <DialogDescription>
            Share your API with the community and start earning from usage
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">API Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Weather Forecast API"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what your API does and its key features..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method *</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger id="method" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint_url">Endpoint URL *</Label>
            <Input
              id="endpoint_url"
              value={formData.endpoint_url}
              onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
              placeholder="https://api.example.com/v1/weather"
              required
              className="h-11 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="free_limit">Free Requests/Month *</Label>
              <Input
                id="free_limit"
                type="number"
                value={formData.free_requests_limit}
                onChange={(e) => setFormData({ ...formData, free_requests_limit: parseInt(e.target.value) })}
                min="0"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Request (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                value={formData.price_per_request}
                onChange={(e) => setFormData({ ...formData, price_per_request: parseFloat(e.target.value) })}
                min="0"
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="example_request">Example Request (optional)</Label>
            <Textarea
              id="example_request"
              value={formData.example_request}
              onChange={(e) => setFormData({ ...formData, example_request: e.target.value })}
              placeholder='{"city": "London", "units": "metric"}'
              rows={2}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="example_response">Example Response (optional)</Label>
            <Textarea
              id="example_response"
              value={formData.example_response}
              onChange={(e) => setFormData({ ...formData, example_response: e.target.value })}
              placeholder='{"temperature": 18, "condition": "cloudy"}'
              rows={2}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAPIMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {createAPIMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish API"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}