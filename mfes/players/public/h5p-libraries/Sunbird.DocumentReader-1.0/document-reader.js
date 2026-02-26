window.Sunbird = window.Sunbird || {};

/**
 * Sunbird Document Reader module
 *
 * @param {Object} options
 * @param {number} id
 * @returns {Object}
 */
window.Sunbird.DocumentReader = function (options, id) {
    H5P.EventDispatcher.call(this);
    var self = this;

    // Extend defaults with provided options
    this.options = H5P.jQuery.extend(true, {}, {
        title: 'Document',
        documentFile: null
    }, options);

    this.contentId = id;

    /**
     * Attach function called by H5P framework to insert H5P content into page
     *
     * @param {jQuery} $container
     */
    this.attach = function ($container) {
        self.$container = $container;

        // Create base wrapper
        self.$wrapper = H5P.jQuery('<div class="sunbird-document-reader-wrapper"></div>');

        if (!self.options.documentFile) {
            self.$wrapper.html('<div class="error">No document file provided.</div>');
            $container.append(self.$wrapper);
            return;
        }

        // Determine path and mimetype
        var documentPath = H5P.getPath(self.options.documentFile.path, self.contentId);
        var mimeType = self.options.documentFile.mime;

        // Title is rendered by the outer player wrapper toolbar
        self.$viewerContainer = H5P.jQuery('<div id="viewer" class="document-viewer-container"></div>');
        self.$wrapper.append(self.$viewerContainer);

        $container.append(self.$wrapper);

        // Mark the .h5p-content ancestor so CSS height-chain rules activate
        // (h5p.css .sunbird-doc-reader-active overrides height: auto → 100%)
        var h5pContent = $container.closest('.h5p-content');
        if (h5pContent.length) {
            h5pContent.addClass('sunbird-doc-reader-active');
        }

        // Initial Telemetry Event
        self.triggerXAPI('initialized');

        if (mimeType === 'application/epub+zip' || documentPath.endsWith('.epub')) {
            self.initEpub(documentPath);
        } else if (mimeType === 'application/pdf' || documentPath.endsWith('.pdf')) {
            self.initPdf(documentPath);
        } else {
            self.$viewerContainer.html('<div class="error">Unsupported document type: ' + mimeType + '</div>');
        }
    };

    /**
     * Initialize EPUB.js renderer
     * @param {string} url 
     */
    this.initEpub = function (url) {
        if (typeof ePub === 'undefined') {
            self.$viewerContainer.html('<div class="error">epub.js failed to load.</div>');
            return;
        }

        // Construct absolute URL so parent fetch hits the ServiceWorker correctly
        var isAbsolute = new RegExp('^(?:[a-z+]+:)?//', 'i').test(url);
        var absoluteUrl = isAbsolute ? url : new URL(url, window.parent.location.href).href;

        // CRITICAL FIX: Cross-realm ArrayBuffer transfer
        // 1. Use parent's fetch (goes through Service Worker which serves cached files)
        // 2. Copy the bytes into a NEW ArrayBuffer created in THIS iframe's realm
        //    so that JSZip's `instanceof ArrayBuffer` check passes
        var fetchEngine = (window.parent && window.parent.fetch) ? window.parent.fetch.bind(window.parent) : fetch;

        fetchEngine(absoluteUrl).then(function (response) {
            if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
            return response.arrayBuffer();
        }).then(function (parentBuffer) {
            // Transfer bytes from parent realm ArrayBuffer to iframe realm ArrayBuffer
            var parentView = new Uint8Array(parentBuffer);
            var localBuffer = new ArrayBuffer(parentView.length);
            var localView = new Uint8Array(localBuffer);
            localView.set(parentView);

            console.log('[Sunbird.DocumentReader] EPUB fetched, size:', localBuffer.byteLength, 'bytes. Initializing...');

            self.book = ePub(localBuffer);
            self.rendition = self.book.renderTo(self.$viewerContainer[0], {
                width: "100%",
                height: "100%",
                spread: "none"
            });

            self.rendition.display().then(function () {
                self.setupEpubControls();
                console.log('[Sunbird.DocumentReader] EPUB Loaded successfully.');
            }).catch(function (err) {
                console.error('Failed to render EPUB:', err);
                if (self.$viewerContainer) {
                    self.$viewerContainer.html('<div class="error">Failed to render EPUB file.</div>');
                }
            });

            // Wire up telemetry
            self.rendition.on("relocated", function (location) {
                self.handlePageTurn(location.start.displayed.page);
            });
        }).catch(function (err) {
            console.error('Failed to fetch EPUB:', err);
            if (self.$viewerContainer) {
                self.$viewerContainer.html('<div class="error">Failed to fetch EPUB file.</div>');
            }
        });
    };

    /**
     * Initialize custom PDF viewer using PDF.js
     * @param {string} url 
     */
    this.initPdf = function (url) {
        if (typeof pdfjsLib === 'undefined') {
            self.$viewerContainer.html('<div class="error">pdf.js failed to load.</div>');
            return;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc = H5P.getLibraryPath('Sunbird.DocumentReader-1.0') + '/pdf.worker.min.js';

        var controlsHTML = '<div class="doc-controls">' +
            '<button id="pdf-zoom-out" title="Zoom Out">−</button>' +
            '<span class="zoom-info" id="pdf-zoom-percent">Fit Page</span>' +
            '<button id="pdf-zoom-in" title="Zoom In">+</button>' +
            '<button id="pdf-fit-page" title="Fit to Page">📄</button>' +
            '<button id="pdf-fit-width" title="Fit to Width">↔</button>' +
            '</div>';

        self.$viewerContainer.html(controlsHTML + '<div id="pdf-scroll-container" class="pdf-scroll-container"></div>');
        self.$scrollContainer = document.getElementById('pdf-scroll-container');

        self.scaleMode = 'page-fit';
        self.scaleValue = 1.0;
        self.pdfDoc = null;
        self.renderedPages = new Set();
        self.highestPageSeen = 1;
        self.observer = null;

        var fetchEngine = (window.parent && window.parent.fetch) ? window.parent.fetch.bind(window.parent) : fetch;

        fetchEngine(url).then(function (response) {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.arrayBuffer();
        }).then(function (buffer) {
            var uint8Array = new Uint8Array(buffer);
            return pdfjsLib.getDocument({ data: uint8Array }).promise;
        }).then(function (pdfDoc_) {
            self.pdfDoc = pdfDoc_;
            self.notifyParentPageUpdate(1, self.pdfDoc.numPages, '');

            self.setupPdfLayout();
            self.setupPdfControls();
        }).catch(function (err) {
            console.error('Failed to load PDF:', err);
            if (self.$viewerContainer) {
                self.$viewerContainer.html('<div class="error">Failed to load PDF file.</div>');
            }
        });
    };

    /**
     * Initializes observer and creates empty page wrappers to support jumping and native scrolling
     */
    this.setupPdfLayout = function () {
        self.renderedPages.clear();
        self.$scrollContainer.innerHTML = '';

        for (let i = 1; i <= self.pdfDoc.numPages; i++) {
            let wrapper = document.createElement('div');
            wrapper.className = 'pdf-page-wrapper';
            wrapper.id = 'page-wrapper-' + i;
            wrapper.setAttribute('data-page-num', i);

            let canvas = document.createElement('canvas');
            canvas.className = 'pdf-canvas';

            wrapper.appendChild(canvas);
            self.$scrollContainer.appendChild(wrapper);
        }

        if (self.observer) self.observer.disconnect();

        if ('IntersectionObserver' in window) {
            self.observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var pageNum = parseInt(entry.target.getAttribute('data-page-num'));
                        if (!self.renderedPages.has(pageNum)) {
                            self.renderedPages.add(pageNum);
                            self.renderPdfPageIntoCanvas(pageNum, entry.target.querySelector('canvas'), entry.target);
                        }
                        if (entry.intersectionRatio > 0.1 || entry.isIntersecting) {
                            self.notifyParentPageUpdate(pageNum, self.pdfDoc.numPages, '');
                            if (pageNum > self.highestPageSeen) {
                                self.highestPageSeen = pageNum;
                                self.handlePageTurn(pageNum);
                            }
                        }
                    }
                });
            }, { root: self.$scrollContainer, rootMargin: '800px 0px' });

            var wrappers = self.$scrollContainer.querySelectorAll('.pdf-page-wrapper');
            wrappers.forEach(function (w) { self.observer.observe(w); });
        } else {
            // Fallback for very old browsers: just render page 1
            self.renderPdfPageIntoCanvas(1, self.$scrollContainer.querySelector('canvas'), self.$scrollContainer.querySelector('.pdf-page-wrapper'));
        }
    };

    /**
     * Dynamically sizes the Canvas scaling viewport based on the mode (Fit or Custom)
     */
    this.renderPdfPageIntoCanvas = function (num, canvas, wrapper) {
        self.pdfDoc.getPage(num).then(function (page) {
            var unscaledViewport = page.getViewport({ scale: 1.0 });
            var scale = 1.0;

            if (self.scaleMode === 'page-fit') {
                var containerHeight = self.$scrollContainer.clientHeight - 40;
                var containerWidth = self.$scrollContainer.clientWidth - 40;
                scale = Math.min(containerWidth / unscaledViewport.width, containerHeight / unscaledViewport.height);
            } else if (self.scaleMode === 'page-width') {
                var containerWidth = self.$scrollContainer.clientWidth - 40;
                scale = containerWidth / unscaledViewport.width;
            } else {
                scale = self.scaleValue;
            }

            var viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            wrapper.style.minHeight = viewport.height + 'px';
            wrapper.style.width = viewport.width + 'px'; // Center properly

            var renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            };
            page.render(renderContext);
        });
    };

    /**
     * Listeners for the Zoom and Page jump buttons
     */
    this.setupPdfControls = function () {
        document.getElementById('pdf-zoom-in').addEventListener('click', function () {
            self.scaleMode = 'custom';
            self.scaleValue += 0.2;
            document.getElementById('pdf-zoom-percent').textContent = Math.round(self.scaleValue * 100) + '%';
            self.setupPdfLayout();
        });
        document.getElementById('pdf-zoom-out').addEventListener('click', function () {
            self.scaleMode = 'custom';
            if (self.scaleValue > 0.4) self.scaleValue -= 0.2;
            document.getElementById('pdf-zoom-percent').textContent = Math.round(self.scaleValue * 100) + '%';
            self.setupPdfLayout();
        });
        document.getElementById('pdf-fit-page').addEventListener('click', function () {
            self.scaleMode = 'page-fit';
            self.scaleValue = 1.0;
            document.getElementById('pdf-zoom-percent').textContent = 'Fit Page';
            self.setupPdfLayout();
        });
        document.getElementById('pdf-fit-width').addEventListener('click', function () {
            self.scaleMode = 'page-width';
            self.scaleValue = 1.0;
            document.getElementById('pdf-zoom-percent').textContent = 'Fit Width';
            self.setupPdfLayout();
        });

        // Listen for navigation commands from the outer player wrapper
        window.addEventListener('message', function (event) {
            if (event.data && event.data.type === 'sunbird-player-nav') {
                self.handleExternalNav(event.data.action);
            }
        });
    };

    /**
     * Handle navigation commands from the outer wrapper (prev/next)
     */
    this.handleExternalNav = function (action) {
        if (self.pdfDoc) {
            // PDF navigation: smooth page-snap to the target page
            var current = self._currentPdfPage || 1;
            var targetPage = current;
            if (action === 'prev' && current > 1) {
                targetPage = current - 1;
            } else if (action === 'next' && current < self.pdfDoc.numPages) {
                targetPage = current + 1;
            }
            if (targetPage !== current) {
                var targetWrapper = document.getElementById('page-wrapper-' + targetPage);
                if (targetWrapper && self.$scrollContainer) {
                    // Snap to the top of the target page within the scroll container
                    self.$scrollContainer.scrollTo({
                        top: targetWrapper.offsetTop - self.$scrollContainer.offsetTop,
                        behavior: 'smooth'
                    });
                    // Immediately update page number for responsive UI
                    self.notifyParentPageUpdate(targetPage, self.pdfDoc.numPages, '');
                }
            }
        } else if (self.rendition) {
            // EPUB navigation
            if (action === 'prev') {
                self.rendition.prev();
            } else if (action === 'next') {
                self.rendition.next();
            }
        }
    };

    /**
     * Helper to set up basic left/right controls for EPUB
     */
    this.setupEpubControls = function () {
        self.epubFontSize = 100;

        var controlsHTML = '<div class="doc-controls">' +
            '<button id="epub-font-down" title="Decrease Font Size">A−</button>' +
            '<span class="zoom-info" id="epub-font-size">100%</span>' +
            '<button id="epub-font-up" title="Increase Font Size">A+</button>' +
            '</div>';

        // Insert controls BEFORE the viewer container
        self.$viewerContainer.before(controlsHTML);

        document.getElementById('epub-font-up').addEventListener('click', function () {
            self.epubFontSize = Math.min(200, self.epubFontSize + 10);
            self.rendition.themes.fontSize(self.epubFontSize + '%');
            document.getElementById('epub-font-size').textContent = self.epubFontSize + '%';
        });
        document.getElementById('epub-font-down').addEventListener('click', function () {
            self.epubFontSize = Math.max(60, self.epubFontSize - 10);
            self.rendition.themes.fontSize(self.epubFontSize + '%');
            document.getElementById('epub-font-size').textContent = self.epubFontSize + '%';
        });

        // Update location display on page change AND notify parent
        self.rendition.on('relocated', function (location) {
            var displayed = location.start.displayed;
            self.notifyParentPageUpdate(displayed.page, displayed.total, '');
        });

        // Emit initial page count for the wrapper's bottom bar
        // Use a short delay to let the rendition settle
        setTimeout(function () {
            try {
                var loc = self.rendition.currentLocation();
                if (loc && loc.start && loc.start.displayed) {
                    var d = loc.start.displayed;
                    self.notifyParentPageUpdate(d.page, d.total, '');
                } else {
                    // Fallback: emit page 1 / 1 initially
                    self.notifyParentPageUpdate(1, 1, '');
                }
            } catch (e) {
                self.notifyParentPageUpdate(1, 1, '');
            }
        }, 500);

        // Listen for navigation commands from the outer player wrapper
        window.addEventListener('message', function (event) {
            if (event.data && event.data.type === 'sunbird-player-nav') {
                self.handleExternalNav(event.data.action);
            }
        });
    };

    /**
     * Send page state to the parent wrapper's bottom bar via postMessage
     */
    this.notifyParentPageUpdate = function (currentPage, totalPages, label) {
        self._currentPdfPage = currentPage; // track for external nav
        try {
            // Use window.top to reliably reach the outermost page,
            // since h5p-standalone nests this in an intermediate iframe.
            var target = window.top || window.parent;
            target.postMessage({
                type: 'sunbird-page-update',
                currentPage: currentPage,
                totalPages: totalPages,
                label: label
            }, '*');
        } catch (e) {
            // Ignore if cross-origin
        }
    };

    /**
     * Telemetry mapping helper
     */
    this.handlePageTurn = function (pageNumber) {
        var xapiEvent = self.createXAPIEventTemplate('experienced');
        xapiEvent.data.statement.object.definition.description = {
            'en-US': 'User scrolled or navigated to page ' + pageNumber
        };
        xapiEvent.data.statement.result = {
            extensions: {
                'http://sunbird.org/xapi/extensions/page': pageNumber
            }
        };
        self.trigger(xapiEvent);
    };
};

window.Sunbird.DocumentReader.prototype = Object.create(H5P.EventDispatcher.prototype);
window.Sunbird.DocumentReader.prototype.constructor = window.Sunbird.DocumentReader;
