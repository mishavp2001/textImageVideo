// @ts-nocheck
import React, { useState } from "react";
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
import { Loader2, CreditCard, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

interface GenerateKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { email: string; creditCard: string; cvv: string; expiry: string }) => Promise<void>;
  isLoading: boolean;
}

export default function GenerateKeyDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: GenerateKeyDialogProps) {
  const [formData, setFormData] = useState({
    email: "",
    creditCard: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    creditCard: "",
    expiry: "",
    cvv: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCreditCard = (cardNumber: string) => {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, "");
    // Check if it's 13-19 digits (standard card length)
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpiry = (expiry: string) => {
    // Format: MM/YY
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) return false;

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      email: "",
      creditCard: "",
      expiry: "",
      cvv: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.creditCard) {
      newErrors.creditCard = "Credit card number is required";
    } else if (!validateCreditCard(formData.creditCard)) {
      newErrors.creditCard = "Invalid credit card number";
    }

    if (!formData.expiry) {
      newErrors.expiry = "Expiry date is required";
    } else if (!validateExpiry(formData.expiry)) {
      newErrors.expiry = "Invalid or expired date (MM/YY)";
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!validateCVV(formData.cvv)) {
      newErrors.cvv = "Invalid CVV (3-4 digits)";
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        email: "",
        creditCard: "",
        expiry: "",
        cvv: "",
      });
      setErrors({
        email: "",
        creditCard: "",
        expiry: "",
        cvv: "",
      });
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const formatCreditCard = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Generate API Key
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter your email and payment information to generate an API key. You'll be charged based on usage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className={`pl-10 h-11 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Credit Card Number */}
          <div className="space-y-2">
            <Label htmlFor="creditCard" className="text-sm font-semibold text-slate-700">
              Credit Card Number *
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="creditCard"
                type="text"
                value={formData.creditCard}
                onChange={(e) =>
                  setFormData({ ...formData, creditCard: formatCreditCard(e.target.value) })
                }
                placeholder="1234 5678 9012 3456"
                className={`pl-10 h-11 ${errors.creditCard ? "border-red-500" : ""}`}
                maxLength={19}
              />
            </div>
            {errors.creditCard && (
              <p className="text-sm text-red-600">{errors.creditCard}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-sm font-semibold text-slate-700">
                Expiry Date *
              </Label>
              <Input
                id="expiry"
                type="text"
                value={formData.expiry}
                onChange={(e) =>
                  setFormData({ ...formData, expiry: formatExpiry(e.target.value) })
                }
                placeholder="MM/YY"
                className={`h-11 ${errors.expiry ? "border-red-500" : ""}`}
                maxLength={5}
              />
              {errors.expiry && (
                <p className="text-sm text-red-600">{errors.expiry}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-sm font-semibold text-slate-700">
                CVV *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="cvv"
                  type="text"
                  value={formData.cvv}
                  onChange={(e) =>
                    setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder="123"
                  className={`pl-9 h-11 ${errors.cvv ? "border-red-500" : ""}`}
                  maxLength={4}
                />
              </div>
              {errors.cvv && (
                <p className="text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              🔒 Your payment information is securely encrypted and processed through Stripe. We never store your full credit card details.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
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
                  Generating...
                </>
              ) : (
                "Generate API Key"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

