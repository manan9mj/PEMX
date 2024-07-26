import mongoose, { Schema, Types } from 'mongoose';

const ProductEventSchema = new Schema(
  {
    eventId: {
      type: Types.UUID,
      unique: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
);

ProductEventSchema.index({ productId: 1 }); // Action: Indexing product id even after multiple occurrences within the collection 

export const ProductEvent = mongoose.model(
  'ProductEvent',
  ProductEventSchema,
);
