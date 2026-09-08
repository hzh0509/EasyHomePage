(() => {
  'use strict';

  const originalGetAttribute = HTMLImageElement.prototype.getAttribute;
  const patchedGetAttribute = function (name) {
    const value = originalGetAttribute.call(this, name);
    if (name === 'src' && typeof value === 'string') {
      // Prevent the PlayPal key "pp-" from also matching Syracuse Poster Project's "spp-" image.
      return value.replace(/(^|\/)spp-/i, '$1sppx-');
    }
    return value;
  };

  HTMLImageElement.prototype.getAttribute = patchedGetAttribute;

  // The localization pass finishes within a few seconds. Restore native behavior afterwards.
  window.setTimeout(() => {
    if (HTMLImageElement.prototype.getAttribute === patchedGetAttribute) {
      HTMLImageElement.prototype.getAttribute = originalGetAttribute;
    }
  }, 12000);
})();
