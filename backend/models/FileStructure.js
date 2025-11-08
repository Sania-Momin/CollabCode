import mongoose from 'mongoose';

const fileItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['file', 'folder'] },
  parentId: { type: String, default: null },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'user' }
});

const fileStructureSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  files: [fileItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
fileStructureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('FileStructure', fileStructureSchema);