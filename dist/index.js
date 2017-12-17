"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mkdirp = require("mkdirp-promise");
const path_1 = require("path");
const rimraf = require("rimraf-then");
const bluebird_1 = require("bluebird");
const debug_1 = require("./debug");
const Postprocessing_1 = require("./Postprocessing");
const NightmareProvider_1 = require("./providers/NightmareProvider");
const PuppeteerProvider_1 = require("./providers/PuppeteerProvider");
class FullScreenshot {
    static async create(options) {
        const provider = await createProvider(options);
        return new FullScreenshot(provider, options);
    }
    constructor(provider, options) {
        assert.ok(provider, 'You need to pass provider');
        assert.ok(options.basePath, 'You need to pass basePath');
        assert.ok(options.widths, 'You need to pass widths');
        this.provider = provider;
        this.options = options;
    }
    async save(name) {
        debug_1.debugMsg(`Making screenshots for ${name}`);
        if (this.options.unreveal) {
            await this.unreveal();
        }
        if (this.options.disableAnimations) {
            await this.disableAnimations();
        }
        for (const width of this.options.widths) {
            debug_1.debugMsg(`Making screenshot for size: ${width}`);
            await this.provider.resizeWidth(width);
            const documentHeight = await this.provider.getRealHeight();
            debug_1.debugMsg('Real height: ', documentHeight);
            const baseDir = path_1.join(this.options.basePath, `${name}-${width}`);
            await mkdirp(baseDir);
            const subImages = [];
            let currentHeight = 0;
            let i = 0;
            let realScrollPosition = 0;
            let lastScrollPos = 0;
            while (currentHeight < documentHeight) {
                debug_1.debugMsg(`Screenshot ${i} at ${currentHeight}`);
                realScrollPosition = await this.provider.scrollTo(currentHeight);
                const imagePath = path_1.join(baseDir, `${name}-${width}-${i++}.png`);
                await this.provider.screenshot(imagePath);
                const isFirst = i === 0;
                lastScrollPos = currentHeight;
                currentHeight +=
                    this.provider.info.windowSizes.inner.height -
                        (isFirst ? 0 : this.options.navbarOffset || 0);
                subImages.push(imagePath);
            }
            const lastImgOffset = lastScrollPos - realScrollPosition;
            await Postprocessing_1.finalize(subImages, { height: this.provider.info.windowSizes.inner.height, width }, this.provider.info.pixelDensity, this.provider.info.scrollbarWidth, lastImgOffset, this.options.navbarOffset || 0, path_1.join(this.options.basePath, `${name}-${width}.png`));
            await rimraf(baseDir);
        }
    }
    async unreveal() {
        debug_1.debugMsg('Unrevealing window');
        const realHeight = await this.provider.getRealHeight();
        const step = this.provider.info.windowSizes.inner.height;
        let currentHeight = 0;
        while (currentHeight < realHeight) {
            await this.provider.scrollTo(currentHeight);
            await bluebird_1.delay(100);
            currentHeight += step;
        }
        await this.provider.scrollTo(0);
    }
    async disableAnimations() {
        debug_1.debugMsg('Disabling animations');
        await this.provider.execute((selectors) => [...document.querySelectorAll(selectors)].forEach((e) => (e.style.animation = 'unset')), this.options.disableAnimations.join(','));
    }
}
exports.default = FullScreenshot;
async function createProvider(options) {
    if (options.nightmare) {
        return NightmareProvider_1.NightmareProvider.create(options.nightmare);
    }
    else if (options.puppeteer) {
        return PuppeteerProvider_1.PuppeteerProvider.create(options.puppeteer);
    }
    throw new Error('Unrecognized provider!');
}
//# sourceMappingURL=index.js.map
