// IMPORT REQUIRED MODULES
const mongoose = require("mongoose");

// DEFINE SCHEMA OBJECT
const Schema = mongoose.Schema;

// DEFINE ITEM SCHEMA (CHILD)
const ItemSchema = new Schema({
  content: String
});

// DEFINE LIST SCHEMA (PARENT)
const ListSchema = new Schema({
  dateCreated: {
    type: Date,
    default: Date.now
  },
  permanent: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: [true, "No name defined. Please define a name when creating a list."]
  },
  color: {
    type: String,
    default: 'blue-gray'
  },
  icon: String,
  items: [ItemSchema],
  itemsCount: {
    type: Number,
    default: 0
  }
});

ListSchema.pre('validate', function(next) {
  this.itemsCount = this.items.length;
  next();
});
ListSchema.methods.getItemCount = function getItemCount() {
  return this.itemsCount = this.items.length;
}

// REGISTER & EXPORT ITEM MODEL
module.exports = mongoose.model('List', ListSchema);