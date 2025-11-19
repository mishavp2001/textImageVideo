// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Loader2, Edit } from "lucide-react";
import { toast } from "sonner";

const categories = ["AI/ML", "Data", "Finance", "Social", "Weather", "Maps", "Utilities", "Other"];
const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface EditAPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  api: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function EditAPIDialog({
  open,
  onOpenChange,
  api,
  onSubmit,
  isLoading,
}: EditAPIDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoint_url: "",
    method: "GET",
    category: "Other",
    status: "active",
    free_requests_limit: 100,
    price_per_request: 0.01,
    example_request: "",
    example_response: "",
  });

  // Initialize form data when API changes
  useEffect(() => {
    if (api) {
      setFormData({
        name: api.name || "",
        description: api.description || "",
        endpoint_url: api.endpoint_url || "",
        method: api.method || "GET",
        category: api.category || "Other",
        status: api.status || "active",
        free_requests_limit: api.free_requests_limit || 100,
        price_per_request: api.price_per_request || 0.01,
        example_request: api.example_request ? JSON.stringify(api.example_request, null, 2) : "",
        example_response: api.example_response ? JSON.stringify(api.example_response, null, 2) : "",
      });
    }
  }, [api]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse JSON strings for example_request and example_response
      const dataToSubmit = {
        ...formData,
        example_request: formData.example_request && formData.example_request.trim() ?
          JSON.parse(formData.example_request) : null,
        example_response: formData.example_response && formData.example_response.trim() ?
          JSON.parse(formData.example_response) : null,
      };

      await onSubmit(dataToSubmit);
      onOpenChange(false);
    } catch (error) {
      if (error.message && error.message.includes("JSON")) {
        toast.error("Invalid JSON in example request or response. Please check your input.");
      }
      console.error("Error updating API:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Edit className="w-6 h-6 text-blue-600" />
            Edit API Details
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Update your API information and configuration
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

          <div className="space-y-2">
            <Label htmlFor="endpoint_url">Endpoint URL *</Label>
            <Input
              id="endpoint_url"
              value={formData.endpoint_url}
              onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
              placeholder="https://api.example.com/v1/endpoint"
              required
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method *</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="free_requests_limit">Free Requests Limit</Label>
              <Input
                id="free_requests_limit"
                type="number"
                value={formData.free_requests_limit}
                onChange={(e) =>
                  setFormData({ ...formData, free_requests_limit: parseInt(e.target.value) || 0 })
                }
                min="0"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_per_request">Price per Request ($)</Label>
            <Input
              id="price_per_request"
              type="number"
              step="0.001"
              value={formData.price_per_request}
              onChange={(e) =>
                setFormData({ ...formData, price_per_request: parseFloat(e.target.value) || 0 })
              }
              min="0"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="example_request">Example Request (JSON)</Label>
            <Textarea
              id="example_request"
              value={formData.example_request}
              onChange={(e) => setFormData({ ...formData, example_request: e.target.value })}
              placeholder='{"param1": "value1", "param2": "value2"}'
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="example_response">Example Response (JSON)</Label>
            <Textarea
              id="example_response"
              value={formData.example_response}
              onChange={(e) => setFormData({ ...formData, example_response: e.target.value })}
              placeholder='{"status": "success", "data": {...}}'
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update API"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

