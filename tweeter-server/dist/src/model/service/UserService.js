"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const ServiceFactory_1 = require("./ServiceFactory");
const crypto = __importStar(require("crypto"));
class UserService extends ServiceFactory_1.ServiceFactory {
    login(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.username == null) {
                throw new Error("[Bad Request] Missing a username");
            }
            else if (event.password == null) {
                throw new Error("[Bad Request] Missing a password");
            }
            let user = null;
            let authToken = tweeter_shared_1.AuthToken.Generate();
            try {
                let passwordFromDB = yield this.createUserProvider().getUserPassword(event.username);
                let hashedPassword = UserService.hashPassword(event.password);
                if (passwordFromDB == hashedPassword) {
                    user = yield this.createUserProvider().getUser(event.username);
                }
                else {
                    throw new Error("No userAlias or password does not match");
                }
            }
            catch (err) {
                throw new Error("[Bad Request] " + err.message);
            }
            if (user) {
                yield this.createAuthTokenProvider().putAuthToken(authToken);
                return new tweeter_shared_1.AuthenticateResponse(true, user, authToken);
            }
            else {
                throw new Error("First user not found in Database");
            }
        });
    }
    ;
    register(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.firstName == null) {
                throw new Error("[Bad Request] Missing a firstName");
            }
            if (event.lastName == null) {
                throw new Error("[Bad Request] Missing a lastName");
            }
            if (event.alias == null) {
                throw new Error("[Bad Request] Missing a alias");
            }
            if (event.password == null) {
                throw new Error("[Bad Request] Missing a password");
            }
            if (event.userImageBytes == null) {
                throw new Error("[Bad Request] Missing a ImageFile");
            }
            if ((yield this.createUserProvider().getUser(event.alias)) != undefined) {
                throw new Error("[Bad Request] user existed");
            }
            let fileName = event.alias + "_image";
            let newFileName = yield this.createS3Provider().putImage(fileName, event.userImageBytes);
            let user = new tweeter_shared_1.User(event.firstName, event.lastName, event.alias, newFileName);
            let authToken = tweeter_shared_1.AuthToken.Generate();
            let hashedPassword = UserService.hashPassword(event.password);
            console.log(hashedPassword);
            try {
                yield this.createUserProvider().putUser(user, hashedPassword);
            }
            catch (err) {
                throw new Error("[Bad Request] " + err.message);
            }
            if (user) {
                yield this.createAuthTokenProvider().putAuthToken(authToken);
                return new tweeter_shared_1.AuthenticateResponse(true, user, authToken);
            }
            else
                throw new Error("First user not found in Fake Data.");
        });
    }
    getUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.alias == null) {
                throw new Error("[Bad Request] Missing a alias");
            }
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            if (yield this.createAuthTokenProvider().isvalidateAuth(event.authToken)) {
                let user = yield this.createUserProvider().getUser(event.alias);
                console.log(user);
                if (user != undefined) {
                    yield this.createAuthTokenProvider().putAuthToken(event.authToken);
                    return new tweeter_shared_1.GetUserResponse(true, null, user);
                }
                else {
                    throw new Error("[Not Found] User not found");
                }
            }
            else {
                throw new Error("[Bad Request] Login time expired");
            }
        });
    }
    logout(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.authToken == null) {
                throw new Error("[Bad Request] Missing a authToken");
            }
            else {
                yield this.createAuthTokenProvider().deleteAuthToken(event.authToken);
                yield new Promise((res) => setTimeout(res, 1000));
                return new tweeter_shared_1.LogoutResponse(true);
            }
        });
    }
    ;
    static hashPassword(passwordToHash) {
        try {
            const md5Hash = crypto.createHash('md5');
            md5Hash.update(passwordToHash);
            const hashedPassword = md5Hash.digest('hex');
            return hashedPassword;
        }
        catch (error) {
            console.error('Error hashing password:', error);
            return 'FAILED TO HASH';
        }
    }
}
exports.UserService = UserService;
