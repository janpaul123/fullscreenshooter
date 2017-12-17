"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const gm = require("gm");
const debug_1 = require("./debug");
const GmUtils_1 = require("./GmUtils");
async function preprocess(path, desiredDimensions, pixelDensity, scrollbarWidth, navbarOffset) {
    debug_1.debugMsg(`Preprocessing ${path}`);
    if (scrollbarWidth !== 0) {
        debug_1.debugMsg('Detected scrollbarWidth != 0. Cutting it off');
        const size = await GmUtils_1.getSize(path);
        const outputDimensions = {
            width: size.width - scrollbarWidth * pixelDensity,
            height: size.height,
        };
        await GmUtils_1.crop(path, { width: outputDimensions.width, height: outputDimensions.height });
    }
    if (navbarOffset) {
        debug_1.debugMsg('Detected navbarOffset != 0. Cutting it off');
        const size = await GmUtils_1.getSize(path);
        const outputDimensions = {
            width: size.width,
            height: size.height - navbarOffset,
        };
        await GmUtils_1.crop(path, {
            width: outputDimensions.width,
            height: outputDimensions.height,
            y: navbarOffset,
        });
    }
    const finalSize = await GmUtils_1.getSize(path);
    debug_1.debugMsg('Final size: ', finalSize);
    // assert.equal(desiredDimensions.width, finalSize.width, 'Width doesnt match!');
    // assert.equal(desiredDimensions.height - (navbarOffset || 0), finalSize.height, 'Height doesnt match!');
}
exports.preprocess = preprocess;
function getImageHeight(index, allImagesLength, baseHeight, lastOffset, navbarHeight) {
    const isFirst = index === 0;
    const isLast = index === allImagesLength - 1;
    if (isFirst) {
        return baseHeight;
    }
    if (isLast) {
        return baseHeight - lastOffset - navbarHeight;
    }
    return baseHeight - navbarHeight;
}
async function stitchImages(images, height, lastOffset, navbarHeight, outputName) {
    debug_1.debugMsg('Stitching images: ', images.length);
    return new Promise((resolve, reject) => {
        let acc = gm();
        let currentHeight = 0;
        for (let i = 0; i < images.length; i++) {
            const isLast = i === images.length - 1;
            acc = acc
                .in('-page', `+0+${isLast ? currentHeight - lastOffset : currentHeight}`)
                .in(images[i]);
            const imageHeight = getImageHeight(i, images.length, height, lastOffset, navbarHeight);
            debug_1.debugMsg('Detected image height: ', imageHeight, ' of ', i);
            currentHeight += imageHeight;
        }
        acc.mosaic().write(outputName, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
async function finalize(subImages, desiredDimensions, pixelDensity, scrollbarWidth, lastImgOffset, navbarOffset, outputPath) {
    for (const [index, subImage] of subImages.entries()) {
        const isFirst = index === 0;
        if (isFirst) {
            await preprocess(subImage, desiredDimensions, pixelDensity, scrollbarWidth);
        }
        else {
            await preprocess(subImage, desiredDimensions, pixelDensity, scrollbarWidth, navbarOffset);
        }
    }
    await stitchImages(subImages, desiredDimensions.height * 3, lastImgOffset * 3, navbarOffset, outputPath);
}
exports.finalize = finalize;
//# sourceMappingURL=Postprocessing.js.map
