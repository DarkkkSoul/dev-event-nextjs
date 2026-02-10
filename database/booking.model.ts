import mongoose, { Schema, Document } from 'mongoose';
import { Event } from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema with validation
const bookingSchema = new Schema<IBooking>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Please provide a valid email address'
    }
  }
}, {
  timestamps: true
});

// Pre-save hook to validate event reference
bookingSchema.pre('save', async function(next) {
  const booking = this;
  
  // Check if eventId is modified or this is a new document
  if (booking.isNew || booking.isModified('eventId')) {
    try {
      // Verify that the referenced event exists
      const eventExists = await Event.findById(booking.eventId);
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(new Error('Error validating event reference'));
    }
  }
  
  next();
});

// Add index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Create and export Booking model
export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
