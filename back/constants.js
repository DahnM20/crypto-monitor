function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("EMIT_MAJ_NEWS", "MajNews");
define("EMIT_MAJ_WALLET", "MajWallet");
define("EMIT_MAJ_WALLET_VALUES", "MajValue");