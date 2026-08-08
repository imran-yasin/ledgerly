-- Database-level CHECK constraints as a second line of defense.
-- Application-layer validation (Zod + service logic) prevents these from
-- ever being hit, but constraints protect against direct database access
-- and operator errors.

ALTER TABLE "Order" ADD CONSTRAINT order_total_positive CHECK ("totalCents" > 0);
ALTER TABLE "OrderItem" ADD CONSTRAINT orderitem_quantity_positive CHECK (quantity >= 1);
ALTER TABLE "OrderItem" ADD CONSTRAINT orderitem_unit_price_non_negative CHECK ("unitPriceCents" >= 0);
ALTER TABLE "Payment" ADD CONSTRAINT payment_amount_positive CHECK ("amountCents" > 0);
