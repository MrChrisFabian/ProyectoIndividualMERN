const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: [3, "Por Favor minimo 3 caracteres en el Nombre "],
        maxlength: [50, "Máximo 50 caracteres en el Nombre "],
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        minlength: [3, "Por Favor minimo 3 caracteres en el Apellido"],
        maxlength: [50, "Máximo 50 caracteres en el Apellido"],

        required: [true, "Last name is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        uniqueValidator: true
    }
    ,
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be 8 characters or longer"]
    },
    role: {
        type: String,
        default: "user",
        required: [true, "Role is required"]
    }
}, { timestamps: true });

UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

// Midleware que antes de usar ningun validate confirmamos que las contraseñas sean iguales
UserSchema.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});
// Middleware que antes de guardar hashea la contraseña
UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

module.exports.UserModel = mongoose.model('User', UserSchema)