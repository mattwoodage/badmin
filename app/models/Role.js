import mongoose from 'mongoose'

var roleSchema = mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  active: Boolean,
  roles: String,
  _old: String,
  key: String
})

var Role = mongoose.model('Role', roleSchema)

export default Role
