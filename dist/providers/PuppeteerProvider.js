"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
const debug_1 = require("../debug");
const ProviderBase_1 = require("./ProviderBase");
class PuppeteerProvider extends ProviderBase_1.ProviderBase {
    // @todo check if this shadowing info really works
    constructor(puppeteer, info) {
        super(info);
        this.puppeteer = puppeteer;
        debug_1.debugMsg(`Detected provider info: `, this.info);
    }
    static async create(puppeteer) {
        const scrollbarWidth = 0;
        const pixelDensity = 3;
        const windowSizes = await getWindowSizes(puppeteer);
        return new PuppeteerProvider(puppeteer, {
            scrollbarWidth,
            windowSizes,
            pixelDensity,
        });
    }
    async execute(func, ...args) {
        return this.puppeteer.evaluate(func, ...args);
    }
    async resizeWidth(width) {
        await this.puppeteer.setViewport({
            deviceScaleFactor: 3,
            width: width + this.info.scrollbarWidth,
            height: this.info.windowSizes.outer.height,
        });
        await bluebird_1.delay(100);
    }
    async screenshot(path) {
        await this.puppeteer.screenshot({ path });
    }
    async getRealHeight() {
        return this.execute(() => document.body.scrollHeight);
    }
    async scrollTo(height) {
        const realScrollPosition = await this.puppeteer.evaluate(((h) => {
            window.scrollTo(0, h);
            return window.scrollY;
        }), height);
        return realScrollPosition;
    }
}
exports.PuppeteerProvider = PuppeteerProvider;
async function getWindowSizes(puppeteer) {
    return puppeteer.evaluate(() => ({
        outer: {
            width: window.outerWidth,
            height: window.outerHeight,
        },
        inner: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
    }));
}
//# sourceMappingURL=PuppeteerProvider.js.map
