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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const User_1 = require("../Entity/User");
const carriermodel_1 = __importDefault(require("../Entity/carriermodel"));
const axios_1 = __importDefault(require("axios"));
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
                    const user = yield User_1.UserData.findOne({ email: body.email });
                    if (!user) {
                        return "Error: User does not exist";
                    }
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
                    return userResponse;
                }
                catch (error) {
                    console.error("Error logging in user:", error);
                    return "Error logging in user";
                }
            });
        }
        modelResponse(modelRequest) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const apiUrl = "https://carrier-model-api.onrender.com/chat";
                    const response = yield axios_1.default.post(apiUrl, modelRequest);
                    let dataString = response.data.data;
                    let modelData;
                    try {
                        if (typeof dataString === 'string') {
                            // Log the raw string for debugging
                            console.log('Raw data string:', dataString);
                            // Try to find the proper JSON structure
                            const jsonMatch = dataString.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                dataString = jsonMatch[0];
                            }
                            // Clean the string of any trailing or leading content
                            dataString = dataString.trim();
                            // Remove any extra characters after the last closing brace
                            const lastBraceIndex = dataString.lastIndexOf('}');
                            if (lastBraceIndex !== -1) {
                                dataString = dataString.substring(0, lastBraceIndex + 1);
                            }
                            // Log the cleaned string
                            console.log('Cleaned data string:', dataString);
                            try {
                                modelData = JSON.parse(dataString);
                            }
                            catch (parseError) {
                                console.error('First parse attempt failed:', parseError);
                                // Try one more time with stricter cleaning
                                dataString = dataString.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Remove control characters
                                dataString = dataString.replace(/\\n/g, ''); // Remove newline characters
                                dataString = dataString.replace(/\s+/g, ' '); // Normalize whitespace
                                console.log('Further cleaned string:', dataString);
                                modelData = JSON.parse(dataString);
                            }
                        }
                        else {
                            modelData = dataString;
                        }
                        // Validate the structure
                        if (!modelData.careerFields || !Array.isArray(modelData.careerFields)) {
                            throw new Error('Invalid data structure: missing or invalid careerFields');
                        }
                        const careerData = new carriermodel_1.default({
                            careerFields: modelData.careerFields,
                            improvementSuggestions: modelData.improvementSuggestions || ''
                        });
                        yield careerData.save();
                        console.log('Data saved successfully:', careerData);
                        return modelData;
                    }
                    catch (parseError) {
                        console.error('Error parsing or validating data:', parseError);
                        console.error('Problematic data string:', dataString);
                        // If we can see the structure of the error response, log it
                        if (response.data) {
                            console.log('Full response data:', JSON.stringify(response.data, null, 2));
                        }
                        return {
                            careerFields: [],
                            improvementSuggestions: "Error parsing model response"
                        };
                    }
                }
                catch (error) {
                    console.error("Error in modelResponse:", error);
                    return {
                        careerFields: [],
                        improvementSuggestions: "Error connecting to the model API or processing response",
                    };
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
