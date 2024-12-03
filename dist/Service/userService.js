"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const User_1 = require("../Entity/User");
let UserService = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserService = _classThis = class {
        registerUser(body) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validate input
                    if (!body) {
                        return "Error: User data is required";
                    }
                    // Check if the email already exists
                    const existingData = yield User_1.UserData.findOne({ email: body.email });
                    if (existingData) {
                        return " User with this email already exists";
                    }
                    // Create User instance and initialize it
                    const user = new User_1.User({
                        userName: body.name,
                        email: body.email,
                        mobileNumer: body.mobileNumer,
                        userPassword: body.password,
                    }, true, "system", "System");
                    // Create a new UserData instance from the User object
                    const newUser = new User_1.UserData(user);
                    // Save user to the database
                    const result = yield newUser.save();
                    return `User registered successfully with ID: ${result._id}`;
                }
                catch (error) {
                    console.error("Error registering user:", error);
                    return "Error: An unexpected error occurred while registering the user";
                }
            });
        }
        loginUser(body) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validate input
                    if (!body || !body.email || !body.password) {
                        return "Error: Email and password are required";
                    }
                    // Check if the user exists in the database
                    const user = yield User_1.UserData.findOne({ email: body.email });
                    if (!user) {
                        return "Error: User does not exist";
                    }
                    // Verify the password
                    if (user.userPassword !== body.password) {
                        return "Error: Incorrect password";
                    }
                    let userResponse = {
                        name: "",
                        email: "",
                    };
                    if (user) {
                        userResponse = {
                            name: user.userName,
                            email: user.email,
                        };
                    }
                    // Return success message
                    return userResponse;
                }
                catch (error) {
                    console.error("Error logging in user:", error);
                    return "Error logging in user";
                }
            });
        }
    };
    __setFunctionName(_classThis, "UserService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
})();
exports.default = UserService;
