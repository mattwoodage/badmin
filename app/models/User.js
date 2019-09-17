import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

var userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    roles: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    },
    superadmin: {
        type: Boolean,
        default: false
    },
    lastLoggedIn: {
        type: Date
    }
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

export default mongoose.model('User', userSchema);