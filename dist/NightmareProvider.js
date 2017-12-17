"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("./debug");
const ProviderBase_1 = require("./providers/ProviderBase");
class NightmareProvider extends ProviderBase_1.ProviderBase {
    constructor(nightmare, info) {
        super(info);
        this.nightmare = nightmare;
        this.info = info;
        debug_1.debugMsg(`Detected provider info: `, this.info);
    }
    static async create(nightmare) {
        const scrollbarWidth = await getScrollbarWidth(nightmare);
        const windowSizes = await getWindowSizes(nightmare);
        const pixelDensity = await getPixelDensity(nightmare);
        const userAgent = await getUserAgent(nightmare);
        return new NightmareProvider(nightmare, {
            scrollbarWidth,
            windowSizes,
            pixelDensity,
            userAgent,
        });
    }
    async execute(func) {
        return this.nightmare.evaluate(func);
    }
    async resizeWidth(width) {
        await this.nightmare.viewport(width + this.info.scrollbarWidth, this.info.windowSizes.outer.height);
        await this.nightmare.wait(100);
    }
    async screenshot(path) {
        await this.nightmare.screenshot(path);
    }
    async getRealHeight() {
        return this.execute(() => document.body.scrollHeight);
    }
    async scrollTo(height) {
        const realScrollPosition = await this.nightmare.evaluate(((h) => {
            window.scrollTo(0, h);
            return window.scrollY;
        }), height);
        // wait for scrollbar to disappear only on mac os x
        if (this.info.scrollbarWidth === 0 && this.info.userAgent.toLowerCase().includes('mac')) {
            await this.nightmare.wait(800);
        }
        return realScrollPosition;
    }
}
exports.NightmareProvider = NightmareProvider;
async function getScrollbarWidth(nightmare) {
    const width = await nightmare.evaluate(() => {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
        const widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = 'scroll';
        const inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        const widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return widthNoScroll - widthWithScroll;
    });
    return width;
}
async function getWindowSizes(nightmare) {
    return nightmare.evaluate(() => ({
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
async function getPixelDensity(nightmare) {
    return nightmare.evaluate(() => window.devicePixelRatio);
}
async function getUserAgent(nightmare) {
    return nightmare.evaluate(() => window.navigator.userAgent);
}
//# sourceMappingURL=NightmareProvider.js.map