# Workflow: Technician Payout & Dispute Resolution
**Document ID:** WORK-PAY-03

## 1. Pre-Work Authorization
* Upon user approval, the system creates a `PaymentIntent` (Stripe) for the estimated amount.
* **Capture Method:** `manual` (Funds are reserved, not taken).

## 2. Job Completion Trigger
When the Technician app sends `POST /work-orders/{id}/complete`:
1.  **Verification Agent** scans the uploaded photo.
2.  **If Verified:** Notification sent to Payer (Tenant or Manager): "Job Complete. See photos here: [Link]."
3.  **Action Required:** Payer has button "Release Payment" or "Report Issue."

## 3. The Payout (Stripe Connect)
* **Scenario A (User Clicks Release):**
    * System captures the `PaymentIntent`.
    * Funds perform a "Destination Charge" -> Technician's Stripe Account.
* **Scenario B (24 Hours Pass):**
    * System auto-releases funds if no dispute is filed.
* **Scenario C (Dispute Filed):**
    * Payment is frozen.
    * Ticket escalated to Human Property Manager for review.
