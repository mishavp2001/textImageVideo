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
import { Loader2, CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

interface VerifyEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified?: () => void;
}

export default function VerifyEmailDialog({ 
  open, 
  onOpenChange, 
  email,
  onVerified 
}: VerifyEmailDialogProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });

      toast.success("Email verified successfully! You can now sign in to access your profile.");
      onOpenChange(false);
      
      if (onVerified) {
        onVerified();
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      
      let errorMessage = "Failed to verify code. Please try again.";
      
      if (error.name === "CodeMismatchException") {
        errorMessage = "Invalid verification code.";
      } else if (error.name === "ExpiredCodeException") {
        errorMessage = "Verification code has expired. Please request a new one.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      await resendSignUpCode({
        username: email,
      });
      
      toast.success("Verification code resent! Check your email.");
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter the verification code sent to your email to activate your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-5 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Check your email</p>
              <p>We sent a verification code to <strong>{email}</strong></p>
              <p className="mt-2 text-xs">
                Once verified, you can sign in to access your profile, view your API keys, and manage your account.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verificationCode" className="text-sm font-semibold text-slate-700">
              Verification Code
            </Label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="h-11 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Didn't receive the code?</span>
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !verificationCode}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Verify Email
                </>
              )}
            </Button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-xs text-slate-600">
              💡 <strong>Tip:</strong> You can skip verification for now and continue using your API key. 
              However, you'll need to verify your email to access your profile and manage your account.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

