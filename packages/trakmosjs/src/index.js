"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.WalletHandler = exports.PortfolioHandler = exports.AccountHandler = void 0;
var encoding_1 = require("@cosmjs/encoding");
var math_1 = require("@cosmjs/math");
var cosmos_directory_1 = require("@stakefrites/cosmos-directory");
var utils_1 = require("./utils");
var directory = new cosmos_directory_1.CosmosDirectory();
var reduce = function (input, decimals) {
    return input.reduce(function (acc, data) {
        return acc.plus(math_1.Decimal.fromAtomics(data.balance.amount, decimals));
    }, math_1.Decimal.zero(decimals));
};
// @TODO: Create a prefix hash that removes request
// @TODO: Add an abstraction to cover EVMOS addresses
var getAddress = function (address, network) { return __awaiter(void 0, void 0, void 0, function () {
    var bech32, chainData, prefix;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bech32 = (0, encoding_1.fromBech32)(address);
                return [4 /*yield*/, directory.getChainData(network)];
            case 1:
                chainData = _a.sent();
                prefix = chainData.bech32_prefix;
                return [2 /*return*/, (0, encoding_1.toBech32)(prefix, bech32.data)];
        }
    });
}); };
var AccountHandler = /** @class */ (function () {
    function AccountHandler(accounts, portfolios, userId, currency) {
        this.accounts = accounts;
        this.portfolios = portfolios;
        this.currency = currency;
        this.tokens = {
            total: [],
            balance: [],
            rewards: [],
            delegations: [],
            unbounding: []
        };
        this.userId = userId;
    }
    AccountHandler.Create = function (accounts, networksName, userId, currency) {
        return __awaiter(this, void 0, void 0, function () {
            var portfolios, account;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.mapAsync)(accounts, function (account) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, PortfolioHandler.Create(account, networksName)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1:
                        portfolios = _a.sent();
                        account = new AccountHandler(accounts, portfolios, userId, currency);
                        account.getAll();
                        return [2 /*return*/, account];
                }
            });
        });
    };
    AccountHandler.Load = function (a, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var portfolios, account;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.mapAsync)(a.portfolios, function (p) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, PortfolioHandler.Load(p.account, p.wallets)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1:
                        portfolios = _a.sent();
                        account = new AccountHandler(a.accounts, portfolios, userId, a.currency);
                        account.tokens = a.tokens;
                        return [2 /*return*/, account];
                }
            });
        });
    };
    AccountHandler.prototype.serialize = function () {
        var serializedPortfolios = this.portfolios.map(function (portfolio) {
            return portfolio.serialize();
        });
        return {
            userId: this.userId,
            accounts: this.accounts,
            portfolios: serializedPortfolios,
            tokens: this.tokens,
            currency: this.currency
        };
    };
    AccountHandler.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.mapAsync)(this.portfolios, function (portfolio) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, portfolio.refresh()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountHandler.prototype.getAll = function () {
        this.getTotal();
        this.getBalance();
        this.getRewards();
        this.getDelegations();
        this.getUnbounding();
    };
    AccountHandler.prototype.getTotal = function () {
        var total = {};
        this.portfolios.forEach(function (portfolio) {
            if (!portfolio) {
                return;
            }
            portfolio.wallets.forEach(function (wallet) {
                if (!wallet) {
                    return;
                }
                wallet.tokens.total.forEach(function (tot) {
                    var amount = tot.amount;
                    var denom = tot.denom;
                    if (!total[denom]) {
                        total[wallet.denom] = { amount: amount, denom: denom };
                    }
                    else {
                        total[wallet.denom].amount += amount;
                    }
                });
            });
        });
        this.tokens.total = Object.values(total).map(function (bal) { return ({
            amount: bal.amount,
            denom: bal.denom
        }); });
    };
    AccountHandler.prototype.getBalance = function () {
        var balance = {};
        this.portfolios.forEach(function (portfolio) {
            portfolio.wallets.forEach(function (wallet) {
                if (!wallet) {
                    return;
                }
                wallet.tokens.balance.forEach(function (bal) {
                    var amount = bal.amount;
                    var denom = bal.denom;
                    if (!balance[denom]) {
                        balance[wallet.denom] = { amount: amount, denom: denom };
                    }
                    else {
                        balance[wallet.denom].amount += amount;
                    }
                });
            });
        });
        this.tokens.balance = Object.values(balance).map(function (bal) { return ({
            amount: bal.amount,
            denom: bal.denom
        }); });
    };
    AccountHandler.prototype.getRewards = function () {
        var rewards = {};
        this.portfolios.forEach(function (portfolio) {
            portfolio.wallets.forEach(function (wallet) {
                if (!wallet) {
                    return;
                }
                wallet.tokens.rewards.forEach(function (reward) {
                    var amount = reward.amount;
                    var denom = reward.denom;
                    if (!rewards[denom]) {
                        rewards[wallet.denom] = { amount: amount, denom: denom };
                    }
                    else {
                        rewards[wallet.denom].amount += amount;
                    }
                });
            });
        });
        this.tokens.rewards = Object.values(rewards).map(function (reward) { return ({
            amount: reward.amount,
            denom: reward.denom
        }); });
    };
    AccountHandler.prototype.getDelegations = function () {
        var delegations = {};
        this.portfolios.forEach(function (portfolio) {
            portfolio.wallets.forEach(function (wallet) {
                if (!wallet) {
                    return;
                }
                wallet.tokens.delegations.forEach(function (delegation) {
                    var amount = delegation.amount;
                    var denom = delegation.denom;
                    if (!delegations[denom]) {
                        delegations[wallet.denom] = { amount: amount, denom: denom };
                    }
                    else {
                        delegations[wallet.denom].amount += amount;
                    }
                });
            });
        });
        this.tokens.delegations = Object.values(delegations).map(function (delegation) { return ({
            amount: delegation.amount,
            denom: delegation.denom
        }); });
    };
    AccountHandler.prototype.getUnbounding = function () {
        var unbounding = {};
        this.portfolios.forEach(function (portfolio) {
            portfolio.wallets.forEach(function (wallet) {
                if (!wallet) {
                    return;
                }
                wallet.tokens.unbounding.forEach(function (un) {
                    var amount = un.amount;
                    var denom = un.denom;
                    if (!unbounding[denom]) {
                        unbounding[wallet.denom] = { amount: amount, denom: denom };
                    }
                    else {
                        unbounding[wallet.denom].amount += amount;
                    }
                });
            });
        });
        this.tokens.unbounding = Object.values(unbounding).map(function (bal) { return ({
            amount: bal.amount,
            denom: bal.denom
        }); });
    };
    return AccountHandler;
}());
exports.AccountHandler = AccountHandler;
var PortfolioHandler = /** @class */ (function () {
    function PortfolioHandler(account, wallets) {
        this.account = account;
        this.wallets = wallets;
    }
    PortfolioHandler.Create = function (account, networksName) {
        return __awaiter(this, void 0, void 0, function () {
            var wallets, portfolio;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.mapAsync)(networksName, function (network) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        if (!(network === 'evmos' && account.evmosAddress)) return [3 /*break*/, 3];
                                        _b = (_a = WalletHandler).Create;
                                        return [4 /*yield*/, getAddress(account.evmosAddress, network)];
                                    case 1: return [4 /*yield*/, _b.apply(_a, [_e.sent(), network])];
                                    case 2: return [2 /*return*/, _e.sent()];
                                    case 3:
                                        _d = (_c = WalletHandler).Create;
                                        return [4 /*yield*/, getAddress(account.bech32Address, network)];
                                    case 4: return [4 /*yield*/, _d.apply(_c, [_e.sent(), network])];
                                    case 5: return [2 /*return*/, _e.sent()];
                                }
                            });
                        }); })];
                    case 1:
                        wallets = _a.sent();
                        portfolio = new PortfolioHandler(account, wallets);
                        return [2 /*return*/, portfolio];
                }
            });
        });
    };
    PortfolioHandler.Load = function (account, wallets) {
        return __awaiter(this, void 0, void 0, function () {
            var walletHandlers, portfolio;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.mapAsync)(wallets, function (wallet) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, WalletHandler.Load(wallet)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1:
                        walletHandlers = _a.sent();
                        portfolio = new PortfolioHandler(account, walletHandlers);
                        return [2 /*return*/, portfolio];
                }
            });
        });
    };
    PortfolioHandler.prototype.serialize = function () {
        var serializedWallets = this.wallets.map(function (wallet) {
            return wallet.serialize();
        });
        return {
            account: this.account,
            wallets: serializedWallets
        };
    };
    PortfolioHandler.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.mapAsync)(this.wallets, function (wallet) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, wallet.fetchAll()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PortfolioHandler;
}());
exports.PortfolioHandler = PortfolioHandler;
var WalletHandler = /** @class */ (function () {
    function WalletHandler(address, network, client, denom, decimals) {
        var _this = this;
        this.fetchDelegations = function () { return __awaiter(_this, void 0, void 0, function () {
            var delegations, amount, denom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.staking.delegatorDelegations(this.address)];
                    case 1:
                        delegations = _a.sent();
                        amount = reduce(delegations.delegationResponses, this.decimals);
                        denom = this.denom;
                        return [2 /*return*/, { amount: amount.toFloatApproximation(), denom: denom }];
                }
            });
        }); };
        this.fetchUnboundingDelegations = function () { return __awaiter(_this, void 0, void 0, function () {
            var unbounding, amount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.staking.delegatorUnbondingDelegations(this.address)];
                    case 1:
                        unbounding = _a.sent();
                        if (unbounding.unbondingResponses.length === 0) {
                            return [2 /*return*/, {
                                    denom: this.denom,
                                    amount: 0
                                }];
                        }
                        else {
                            amount = unbounding.unbondingResponses.reduce(function (acc, data) {
                                return acc.plus(data.entries.reduce(function (newAcc, data) {
                                    return newAcc.plus(math_1.Decimal.fromAtomics(data.balance, _this.decimals));
                                }, math_1.Decimal.zero(_this.decimals)));
                            }, math_1.Decimal.zero(this.decimals));
                            return [2 /*return*/, { amount: amount.toFloatApproximation(), denom: this.denom }];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.fetchRewards = function () { return __awaiter(_this, void 0, void 0, function () {
            var rewards, denom, amount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.distribution.delegationTotalRewards(this.address)];
                    case 1:
                        rewards = _a.sent();
                        denom = this.denom;
                        amount = rewards.total.reduce(function (acc, data) {
                            return acc.plus(math_1.Decimal.fromAtomics(data.amount, _this.decimals + 18));
                        }, math_1.Decimal.zero(this.decimals + 18));
                        return [2 /*return*/, { amount: amount.toFloatApproximation(), denom: denom }];
                }
            });
        }); };
        this.fetchBalance = function () { return __awaiter(_this, void 0, void 0, function () {
            var balance, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.bank.balance(this.address, this.denom)];
                    case 1:
                        balance = _a.sent();
                        amount = math_1.Decimal.fromAtomics(balance.amount, this.decimals);
                        return [2 /*return*/, { amount: amount.toFloatApproximation(), denom: this.denom }];
                }
            });
        }); };
        // @TODO: abstract the fetching functions to make use of DECIMALS at this level
        this.fetchAll = function () { return __awaiter(_this, void 0, void 0, function () {
            var delegations, rewards, balance, unbounding, total;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchDelegations()];
                    case 1:
                        delegations = _a.sent();
                        return [4 /*yield*/, this.fetchRewards()];
                    case 2:
                        rewards = _a.sent();
                        return [4 /*yield*/, this.fetchBalance()];
                    case 3:
                        balance = _a.sent();
                        return [4 /*yield*/, this.fetchUnboundingDelegations()];
                    case 4:
                        unbounding = _a.sent();
                        total = delegations.amount + rewards.amount + balance.amount;
                        this.tokens.delegations.push(delegations);
                        this.tokens.rewards.push(rewards);
                        this.tokens.balance.push(balance);
                        this.tokens.unbounding.push(unbounding);
                        this.tokens.total.push({
                            denom: this.denom,
                            amount: total
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        this.address = address;
        this.network = network;
        this._client = client;
        this.denom = denom;
        this.decimals = decimals;
        this.tokens = {
            delegations: [],
            balance: [],
            rewards: [],
            unbounding: [],
            redelegations: [],
            total: []
        };
    }
    WalletHandler.Create = function (address, network) {
        return __awaiter(this, void 0, void 0, function () {
            var client, chain, handler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.makeClient)(directory.rpcUrl(network))];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, directory.getChain(network)];
                    case 2:
                        chain = _a.sent();
                        handler = new WalletHandler(address, network, client, chain.chain.denom, chain.chain.decimals);
                        return [4 /*yield*/, handler.fetchAll()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, handler];
                }
            });
        });
    };
    WalletHandler.Load = function (w) {
        return __awaiter(this, void 0, void 0, function () {
            var client, handler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.makeClient)(directory.rpcUrl(w.network))];
                    case 1:
                        client = _a.sent();
                        handler = new WalletHandler(w.address, w.network, client, w.denom, w.decimals);
                        handler.tokens = w.tokens;
                        return [2 /*return*/, handler];
                }
            });
        });
    };
    WalletHandler.prototype.serialize = function () {
        return {
            address: this.address,
            network: this.network,
            denom: this.denom,
            decimals: this.decimals,
            tokens: this.tokens
        };
    };
    return WalletHandler;
}());
exports.WalletHandler = WalletHandler;
