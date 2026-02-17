import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema with validation
const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [1, 'Description cannot be empty']
  },
  overview: {
    type: String,
    required: [true, 'Overview is required'],
    trim: true,
    minlength: [1, 'Overview cannot be empty']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
    minlength: [1, 'Image URL cannot be empty']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    minlength: [1, 'Venue cannot be empty']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [1, 'Location cannot be empty']
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true,
    minlength: [1, 'Date cannot be empty']
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
    minlength: [1, 'Time cannot be empty']
  },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    trim: true,
    minlength: [1, 'Mode cannot be empty']
  },
  audience: {
    type: String,
    required: [true, 'Audience is required'],
    trim: true,
    minlength: [1, 'Audience cannot be empty']
  },
  agenda: {
    type: [String],
    required: [true, 'Agenda is required'],
    validate: {
      validator: function (agenda: string[]) {
        return agenda.length > 0 && agenda.every(item => item.trim().length > 0);
      },
      message: 'Agenda must contain at least one non-empty item'
    }
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true,
    minlength: [1, 'Organizer cannot be empty']
  },
  tags: {
    type: [String],
    required: [true, 'Tags are required'],
    validate: {
      validator: function (tags: string[]) {
        return tags.length > 0 && tags.every(tag => tag.trim().length > 0);
      },
      message: 'Tags must contain at least one non-empty item'
    }
  }
}, {
  timestamps: true
});

// Pre-save hook for slug generation and date/time normalization
eventSchema.pre('save', async function (next) {
  const event = this;

  // Generate slug from title if title is modified or slug is not set
  if (!event.slug || (event.isModified('title') && event.title)) {
    // Generate URL-friendly slug
    event.slug = event.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  // Normalize date to ISO format if date is modified
  if (event.isModified('date') && event.date) {
    try {
      const dateObj = new Date(event.date);
      if (!isNaN(dateObj.getTime())) {
        event.date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
    } catch (error) {
      return next(new Error('Invalid date format'));
    }
  }

  // Normalize time format if time is modified
  if (event.isModified('time') && event.time) {
    // Ensure time is in HH:MM format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(event.time)) {
      return next(new Error('Time must be in HH:MM format'));
    }
  }

  next();
});

// Add unique index to slug
eventSchema.index({ slug: 1 }, { unique: true });

// Create and export Event model
export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
