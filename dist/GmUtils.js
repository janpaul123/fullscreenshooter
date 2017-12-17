"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
const gm = require("gm");
async function getSize(path) {
    return bluebird_1.promisify(cb => gm(path).size(cb))();
}
exports.getSize = getSize;
async function resize(path, size) {
    return bluebird_1.promisify(cb => gm(path)
        .resize(size.width, size.height)
        .write(path, cb))();
}
exports.resize = resize;
async function crop(path, area) {
    return bluebird_1.promisify(cb => gm(path)
        .crop(area.width, area.height, area.x || 0, area.y || 0)
        .write(path, cb))();
}
exports.crop = crop;
//# sourceMappingURL=GmUtils.js.map