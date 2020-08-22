define("common/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isCuck = navigator.userAgent.toLowerCase().includes("firefox");
    var fileTypes;
    (function (fileTypes) {
        fileTypes[fileTypes["jpg"] = 0] = "jpg";
        fileTypes[fileTypes["png"] = 1] = "png";
        fileTypes[fileTypes["gif"] = 2] = "gif";
        fileTypes[fileTypes["webm"] = 3] = "webm";
        fileTypes[fileTypes["pdf"] = 4] = "pdf";
        fileTypes[fileTypes["svg"] = 5] = "svg";
        fileTypes[fileTypes["mp4"] = 6] = "mp4";
        fileTypes[fileTypes["mp3"] = 7] = "mp3";
        fileTypes[fileTypes["ogg"] = 8] = "ogg";
        fileTypes[fileTypes["zip"] = 9] = "zip";
        fileTypes[fileTypes["7z"] = 10] = "7z";
        fileTypes[fileTypes["tar.gz"] = 11] = "tar.gz";
        fileTypes[fileTypes["tar.xz"] = 12] = "tar.xz";
        fileTypes[fileTypes["flac"] = 13] = "flac";
        fileTypes[fileTypes["noFile"] = 14] = "noFile";
        fileTypes[fileTypes["txt"] = 15] = "txt";
        fileTypes[fileTypes["webp"] = 16] = "webp";
        fileTypes[fileTypes["rar"] = 17] = "rar";
        fileTypes[fileTypes["cbz"] = 18] = "cbz";
        fileTypes[fileTypes["cbr"] = 19] = "cbr";
    })(fileTypes = exports.fileTypes || (exports.fileTypes = {}));
    function isExpandable(t) {
        switch (t) {
            case fileTypes.pdf:
            case fileTypes.mp3:
            case fileTypes.flac:
            case fileTypes.zip:
            case fileTypes["7z"]:
            case fileTypes["tar.gz"]:
            case fileTypes["tar.xz"]:
            case fileTypes.txt:
            case fileTypes.rar:
            case fileTypes.cbr:
            case fileTypes.cbz:
                return false;
            default:
                return true;
        }
    }
    exports.isExpandable = isExpandable;
});
define("util/fsm", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FSM {
        constructor(start) {
            this.stateHandlers = new SetMap();
            this.onceHandlers = new SetMap();
            this.changeHandlers = [];
            this.transitions = {};
            this.wilds = {};
            this.feeding = false;
            this.buffered = [];
            this.state = start;
        }
        on(state, handler) {
            this.stateHandlers.add(state.toString(), handler);
        }
        once(state, handler) {
            this.onceHandlers.add(state.toString(), handler);
        }
        onChange(fn) {
            this.changeHandlers.push(fn);
        }
        act(start, event, handler) {
            this.transitions[this.transitionString(start, event)] = handler;
        }
        wildAct(event, handler) {
            this.wilds[event.toString()] = handler;
        }
        transitionString(start, event) {
            return `${start}+${event}`;
        }
        feed(event) {
            if (this.feeding) {
                this.buffered.push(event);
                return;
            }
            this.feeding = true;
            let result;
            const e = event.toString();
            if (e in this.wilds) {
                result = this.wilds[e]();
            }
            else {
                const transition = this.transitionString(this.state, event), handler = this.transitions[transition];
                if (!handler) {
                    return this.feedBuffered();
                }
                result = handler();
            }
            if (this.state === result) {
                return this.feedBuffered();
            }
            const r = result.toString();
            this.onceHandlers.forEach(r, fn => fn());
            this.onceHandlers.removeAll(r);
            this.state = result;
            this.stateHandlers.forEach(r, fn => fn());
            for (let fn of this.changeHandlers) {
                fn();
            }
            this.feedBuffered();
        }
        feedBuffered() {
            this.feeding = false;
            if (this.buffered.length) {
                this.feed(this.buffered.shift());
            }
        }
        feeder(event) {
            return () => this.feed(event);
        }
    }
    exports.default = FSM;
    class SetMap {
        constructor() {
            this.map = {};
        }
        add(key, item) {
            if (!(key in this.map)) {
                this.map[key] = new Set();
            }
            this.map[key].add(item);
        }
        remove(key, item) {
            const set = this.map[key];
            if (!set) {
                return;
            }
            set.delete(item);
            if (set.size === 0) {
                delete this.map[key];
            }
        }
        removeAll(key) {
            delete this.map[key];
        }
        forEach(key, fn) {
            const set = this.map[key];
            if (!set) {
                return;
            }
            set.forEach(fn);
        }
    }
});
define("util/fetch", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    async function fetchJSON(url) {
        const res = await fetch(url);
        if (res.status !== 200) {
            return [null, await res.text()];
        }
        return [await res.json(), ""];
    }
    exports.fetchJSON = fetchJSON;
    async function postJSON(url, body) {
        return await fetch(url, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(body),
        });
    }
    exports.postJSON = postJSON;
    async function fetchBoard(board, page, catalog) {
        return fetch(`/${board}/${catalog ? "catalog" : ""}?minimal=true&page=${page}`);
    }
    exports.fetchBoard = fetchBoard;
});
define("util/hooks", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const hooks = {};
    function hook(name, func) {
        hooks[name] = func;
    }
    exports.hook = hook;
    function trigger(name, ...args) {
        const func = hooks[name];
        if (!func) {
            return undefined;
        }
        return func(...args);
    }
    exports.trigger = trigger;
});
define("base/view", ["require", "exports", "util/index"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Model {
    }
    exports.Model = Model;
    class View {
        constructor({ el, model, tag, class: cls, id }) {
            if (model) {
                this.model = model;
            }
            if (!el) {
                this.el = document.createElement(tag || 'div');
                if (id) {
                    this.el.setAttribute('id', id);
                    this.id = id;
                }
                if (cls) {
                    this.el.setAttribute('class', cls);
                }
            }
            else {
                this.el = el;
                const id = el.getAttribute('id');
                if (id) {
                    this.id = id;
                }
            }
        }
        remove() {
            this.el.remove();
        }
        on(type, fn, opts) {
            util_1.on(this.el, type, fn, opts);
        }
        onClick(events) {
            for (let selector in events) {
                this.on('click', events[selector], { selector, capture: true });
            }
        }
        inputElement(name) {
            return util_1.inputElement(this.el, name);
        }
        extractDuration() {
            let duration = 0;
            for (let el of this.el.querySelectorAll("input[type=number]")) {
                let times = 1;
                switch (el.getAttribute("name")) {
                    case "day":
                        times *= 24;
                    case "hour":
                        times *= 60;
                    case "minute":
                        break;
                    default:
                        continue;
                }
                const val = parseInt(el.value);
                if (val) {
                    duration += val * times;
                }
            }
            return duration;
        }
    }
    exports.default = View;
});
define("base/banner", ["require", "exports", "base/view"], function (require, exports, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const bannerModals = {};
    let visible;
    class BannerModal extends view_1.default {
        constructor(el) {
            super({ el });
            bannerModals[this.id] = this;
            document
                .querySelector('#banner-' + this.id.split('-')[0])
                .addEventListener('click', () => this.toggle(), { capture: true });
        }
        toggle() {
            if (visible) {
                const old = visible;
                visible.hide();
                if (old !== this) {
                    this.show();
                }
            }
            else {
                this.show();
            }
        }
        show() {
            this.el.style.display = 'block';
            visible = this;
        }
        hide() {
            this.el.style.display = 'none';
            visible = null;
        }
    }
    exports.BannerModal = BannerModal;
    class TabbedModal extends BannerModal {
        constructor(el) {
            super(el);
            this.onClick({
                '.tab-link': e => this.switchTab(e),
            });
        }
        switchTab(event) {
            const el = event.target;
            for (let selected of this.el.querySelectorAll('.tab-sel')) {
                selected.classList.remove('tab-sel');
            }
            el.classList.add('tab-sel');
            const id = el.getAttribute('data-id');
            for (let el of this.el.querySelectorAll(`.tab-cont > div`)) {
                if (el.getAttribute("data-id") !== id) {
                    continue;
                }
                el.classList.add("tab-sel");
            }
        }
    }
    exports.TabbedModal = TabbedModal;
});
define("base/index", ["require", "exports", "base/view", "base/banner"], function (require, exports, view_2, banner_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = view_2.default;
    exports.Model = view_2.Model;
    exports.BannerModal = banner_1.BannerModal;
    exports.TabbedModal = banner_1.TabbedModal;
});
define("posts/collection", ["require", "exports", "base/index"], function (require, exports, base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PostCollection extends base_1.Model {
        constructor() {
            super();
            this.models = {};
            PostCollection.all.add(this);
        }
        unregister() {
            PostCollection.all.delete(this);
        }
        static getFromAll(id) {
            for (let col of [...PostCollection.all].reverse()) {
                const m = col.get(id);
                if (m) {
                    return m;
                }
            }
            return null;
        }
        get(id) {
            return this.models[id];
        }
        add(model) {
            this.models[model.id] = model;
            model.collection = this;
        }
        remove(model) {
            delete this.models[model.id];
            delete model.collection;
        }
        clear() {
            for (let id in this.models) {
                delete this.models[id].collection;
            }
            this.models = {};
        }
        has(id) {
            return id in this.models;
        }
        *[Symbol.iterator]() {
            yield* Object
                .keys(this.models)
                .map(key => this.models[key]);
        }
        size() {
            return Object.keys(this.models).length;
        }
    }
    exports.default = PostCollection;
    PostCollection.all = new Set();
});
define("lang", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JSON.parse(document
        .getElementById("lang-data")
        .textContent);
});
define("posts/render/etc", ["require", "exports", "state", "lang", "util/index"], function (require, exports, state_1, lang_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function renderPostLink(link) {
        const cross = link.op !== state_1.page.thread, url = `${cross ? `/${link.board}/${link.op}` : ""}#p${link.id}`;
        let html = `<a class="post-link" data-id="${link.id}" href="${url}">>>${link.id}`;
        if (cross && state_1.page.thread) {
            html += " ➡";
        }
        if (state_1.mine.has(link.id)) {
            html += ' ' + lang_1.default.posts["you"];
        }
        html += `</a><a class="hash-link" href="${url}"> #</a>`;
        return html;
    }
    exports.renderPostLink = renderPostLink;
    function renderTempLink(id) {
        const attrs = {
            class: "post-link temp",
            "data-id": id.toString(),
            href: `#p${id}`,
        };
        let html = `<a ${util_2.makeAttrs(attrs)}>>>${id}`;
        if (state_1.mine.has(id)) {
            html += ' ' + lang_1.default.posts["you"];
        }
        html += "</a>";
        return html;
    }
    exports.renderTempLink = renderTempLink;
    function relativeTime(then) {
        const now = Math.floor(Date.now() / 1000);
        let time = Math.floor((now - then) / 60), isFuture = false;
        if (time < 1) {
            if (time > -5) {
                return lang_1.default.posts["justNow"];
            }
            isFuture = true;
            time = -time;
        }
        const divide = [60, 24, 30, 12], unit = ['minute', 'hour', 'day', 'month'];
        for (let i = 0; i < divide.length; i++) {
            if (time < divide[i]) {
                return ago(time, lang_1.default.plurals[unit[i]], isFuture);
            }
            time = Math.floor(time / divide[i]);
        }
        return ago(time, lang_1.default.plurals["year"], isFuture);
    }
    exports.relativeTime = relativeTime;
    function ago(time, units, isFuture) {
        const count = util_2.pluralize(time, units);
        if (isFuture) {
            return `${lang_1.default.posts["in"]} ${count}`;
        }
        return `${count} ${lang_1.default.posts["ago"]}`;
    }
});
define("posts/embed", ["require", "exports", "util/index"], function (require, exports, util_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const youtubeCache = new Map();
    const bitchuteCache = new Map();
    var provider;
    (function (provider) {
        provider[provider["YouTube"] = 0] = "YouTube";
        provider[provider["SoundCloud"] = 1] = "SoundCloud";
        provider[provider["Vimeo"] = 2] = "Vimeo";
        provider[provider["Coub"] = 3] = "Coub";
        provider[provider["BitChute"] = 4] = "BitChute";
        provider[provider["Invidious"] = 5] = "Invidious";
    })(provider || (provider = {}));
    const patterns = [
        [
            provider.YouTube,
            /https?:\/\/(?:[^\.]+\.)?(?:youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=)[a-zA-Z0-9_-]+/,
        ],
        [
            provider.SoundCloud,
            /https?:\/\/soundcloud.com\/.*/,
        ],
        [
            provider.Vimeo,
            /https?:\/\/(?:www\.)?vimeo\.com\/.+/,
        ],
        [
            provider.Coub,
            /https?:\/\/(?:www\.)?coub\.com\/view\/.+/,
        ],
        [
            provider.BitChute,
            /https?:\/\/(?:[^\.]+\.)?(?:bitchute\.com\/embed\/|bitchute\.com\/video\/)[a-zA-Z0-9_-]+/,
        ],
        [
            provider.Invidious,
            /https?:\/\/(?:www\.)?invidio\.us\/watch(.*&|\?)v=.+/,
        ],
    ];
    const formatters = {};
    const fetchers = {};
    for (let p of [
        "YouTube",
        "SoundCloud",
        "Vimeo",
        "Coub",
        "BitChute",
        "Invidious",
    ]) {
        const id = provider[p];
        formatters[id] = formatProvider(id);
        switch (id) {
            case provider.YouTube:
                fetchers[id] = fetchYouTube;
                break;
            case provider.BitChute:
                fetchers[id] = fetchBitChute;
                break;
            case provider.Invidious:
                fetchers[id] = fetchInvidious;
                break;
            default:
                fetchers[id] = fetchNoEmbed(id);
        }
    }
    function formatProvider(type) {
        return (href) => {
            const attrs = {
                rel: "noreferrer",
                href: util_3.escape(href),
                class: "embed",
                target: "_blank",
                "data-type": type.toString(),
            };
            return `<em><a ${util_3.makeAttrs(attrs)}>[${provider[type]}] ???</a></em>`;
        };
    }
    async function fetchBitChute(el) {
        const ref = el.getAttribute("href"), id = strip(ref.split("embed/").pop().split("video/"));
        if (!bitchuteCache.has(id)) {
            const res = await fetch(`/api/bitchute-title/${id}`), title = await res.text();
            switch (res.status) {
                case 200:
                    if (!title) {
                        el.textContent = format("Error: Title does not exist", provider.BitChute);
                        el.classList.add("errored");
                        return;
                    }
                    bitchuteCache.set(id, title);
                    break;
                case 500:
                    el.textContent = format("Error 500: BitChute is not available", provider.BitChute);
                    el.classList.add("errored");
                    return;
                default:
                    const errmsg = `Error ${res.status}: ${res.statusText}`;
                    el.textContent = format(errmsg, provider.BitChute);
                    el.classList.add("errored");
                    console.error(errmsg);
                    return;
            }
        }
        el.textContent = format(bitchuteCache.get(id), provider.BitChute);
        el.setAttribute("data-html", encodeURIComponent(`<iframe width="480" height="270" src="https://bitchute.com/embed/${id}" `
            + `referrerpolicy="no-referrer" sandbox="allow-scripts" allowfullscreen></iframe>`));
    }
    async function fetchYouTube(el) {
        const href = el.getAttribute("href");
        const cached = youtubeCache.get(href);
        if (cached) {
            setNoembedData(el, provider.YouTube, cached);
            return;
        }
        const data = await fetchNoEmbed(provider.YouTube)(el);
        if (data) {
            youtubeCache.set(href, data);
        }
    }
    function strip(s) {
        return s.pop().split('&').shift().split('#').shift().split('?').shift();
    }
    async function fetchInvidious(el) {
        const url = new URL(el.getAttribute("href")), id = url.searchParams.get("v"), [data, err] = await util_3.fetchJSON(`https://invidio.us/api/v1/videos/${id}?fields=title,formatStreams,videoThumbnails`);
        if (err) {
            el.textContent = format(err, provider.Invidious);
            el.classList.add("erred");
            console.error(err);
            return;
        }
        el.textContent = format(data.title, provider.Invidious);
        const thumb = data.videoThumbnails[0].url, video = data.formatStreams[0].url, title = data.title;
        el.textContent = format(title, provider.Invidious);
        const t = url.searchParams.get("t"), start = url.searchParams.get("start"), tparam = t ? `#t=${t}` : start ? `#t=${start}` : '';
        el.setAttribute("data-html", encodeURIComponent(`<video width="480" height="270" poster="${thumb}" `
            + (url.searchParams.get("loop") === "1" ? "loop " : '') +
            `controls><source src="${video}${tparam}" />`));
    }
    function fetchNoEmbed(type) {
        return async (el) => {
            const url = "https://noembed.com/embed?url=" + el.getAttribute("href"), [data, err] = await util_3.fetchJSON(url);
            if (err) {
                el.textContent = format(err, type);
                el.classList.add("erred");
                console.error(err);
                return;
            }
            if (data.error) {
                el.textContent = format(data.error, type);
                el.classList.add("erred");
                return;
            }
            setNoembedData(el, type, data);
            return data;
        };
    }
    function setNoembedData(el, type, data) {
        el.textContent = format(data.title, type);
        el.setAttribute("data-html", encodeURIComponent(data.html.trim()));
    }
    function format(s, type) {
        return `[${provider[type]}] ${s}`;
    }
    function parseEmbeds(s) {
        for (let [type, patt] of patterns) {
            if (patt.test(s)) {
                return formatters[type](s);
            }
        }
        return "";
    }
    exports.parseEmbeds = parseEmbeds;
    function fetchMeta(e) {
        const el = e.target;
        if (el.hasAttribute("data-title-requested")
            || el.classList.contains("expanded")) {
            return;
        }
        el.setAttribute("data-title-requested", "true");
        execFetcher(el);
    }
    function execFetcher(el) {
        return fetchers[parseInt(el.getAttribute("data-type"))](el);
    }
    async function toggleExpansion(e) {
        const el = e.target;
        if (e.which !== 1 || e.ctrlKey || el.classList.contains("erred")) {
            return;
        }
        e.preventDefault();
        if (el.classList.contains("expanded")) {
            el.classList.remove("expanded");
            const iframe = el.lastChild;
            if (iframe) {
                iframe.remove();
            }
            return;
        }
        if (!el.hasAttribute("data-html")) {
            await execFetcher(el);
        }
        const html = decodeURIComponent(el.getAttribute("data-html")), frag = util_3.makeFrag(html);
        for (let el of frag.querySelectorAll("iframe")) {
            el.setAttribute("referrerpolicy", "no-referrer");
            el.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-modals");
        }
        el.append(frag);
        el.classList.add("expanded");
    }
    util_3.on(document, "mouseover", fetchMeta, {
        passive: true,
        selector: "a.embed",
    });
    util_3.on(document, "click", toggleExpansion, {
        selector: "a.embed",
    });
});
define("posts/render/code", ["require", "exports", "util/index"], function (require, exports, util_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const headers = {
        operator: "<span class=\"ms-operator\">",
        function: "<span class=\"ms-function\">",
        string: "<span class=\"ms-string\">",
        comment: "<span class=\"ms-comment\">",
    };
    const close = "</span>";
    const keywords = {
        "NULL": true,
        "NaN": true,
        "abstract": true,
        "alias": true,
        "and": true,
        "arguments": true,
        "array": true,
        "asm": true,
        "assert": true,
        "async": true,
        "auto": true,
        "await": true,
        "base": true,
        "begin": true,
        "bool": true,
        "boolean": true,
        "break": true,
        "byte": true,
        "case": true,
        "catch": true,
        "char": true,
        "checked": true,
        "class": true,
        "clone": true,
        "compl": true,
        "const": true,
        "constexpr": true,
        "continue": true,
        "debugger": true,
        "decimal": true,
        "declare": true,
        "default": true,
        "defer": true,
        "deinit": true,
        "delegate": true,
        "delete": true,
        "do": true,
        "double": true,
        "echo": true,
        "elif": true,
        "else": true,
        "elseif": true,
        "elsif": true,
        "end": true,
        "ensure": true,
        "enum": true,
        "event": true,
        "except": true,
        "exec": true,
        "explicit": true,
        "export": true,
        "extends": true,
        "extension": true,
        "extern": true,
        "fallthrough": true,
        "false": true,
        "final": true,
        "finally": true,
        "fixed": true,
        "float": true,
        "fn": true,
        "for": true,
        "foreach": true,
        "friend": true,
        "from": true,
        "func": true,
        "function": true,
        "global": true,
        "go": true,
        "goto": true,
        "guard": true,
        "if": true,
        "impl": true,
        "implements": true,
        "implicit": true,
        "import": true,
        "in": true,
        "int": true,
        "include": true,
        "inline": true,
        "inout": true,
        "instanceof": true,
        "interface": true,
        "internal": true,
        "is": true,
        "lambda": true,
        "let": true,
        "lock": true,
        "long": true,
        "module": true,
        "mut": true,
        "mutable": true,
        "namespace": true,
        "native": true,
        "new": true,
        "next": true,
        "nil": true,
        "not": true,
        "null": true,
        "object": true,
        "operator": true,
        "or": true,
        "out": true,
        "override": true,
        "package": true,
        "params": true,
        "private": true,
        "protected": true,
        "protocol": true,
        "pub": true,
        "public": true,
        "raise": true,
        "readonly": true,
        "redo": true,
        "ref": true,
        "register": true,
        "repeat": true,
        "require": true,
        "rescue": true,
        "restrict": true,
        "retry": true,
        "return": true,
        "sbyte": true,
        "sealed": true,
        "short": true,
        "signed": true,
        "sizeof": true,
        "static": true,
        "str": true,
        "string": true,
        "struct": true,
        "subscript": true,
        "super": true,
        "switch": true,
        "synchronized": true,
        "template": true,
        "then": true,
        "throws": true,
        "transient": true,
        "true": true,
        "try": true,
        "type": true,
        "typealias": true,
        "typedef": true,
        "typeid": true,
        "typename": true,
        "typeof": true,
        "uint": true,
        "unchecked": true,
        "undef": true,
        "undefined": true,
        "union": true,
        "unless": true,
        "unsigned": true,
        "until": true,
        "use": true,
        "using": true,
        "var": true,
        "virtual": true,
        "void": true,
        "volatile": true,
        "when": true,
        "where": true,
        "while": true,
        "with": true,
        "xor": true,
        "yield": true,
    };
    const operators = {
        '+': true,
        '-': true,
        '~': true,
        '!': true,
        '@': true,
        '%': true,
        '^': true,
        '&': true,
        '*': true,
        '=': true,
        '|': true,
        ':': true,
        '<': true,
        '>': true,
        '?': true,
        '/': true,
    };
    function highlightSyntax(text) {
        let html = `<code class="code-tag">`;
        let token = "";
        let typ = 0;
        let next = "";
        let prev = "";
        for (let i = 0; i < text.length; i++) {
            const b = text[i];
            next = i != text.length - 1 ? text[i + 1] : "";
            switch (typ) {
                case 0:
                    switch (b) {
                        case "/":
                            if (next === "/") {
                                typ = 4;
                                html += headers.comment + "//";
                                i++;
                            }
                            else {
                                html += wrapOperator(b);
                            }
                            break;
                        case "'":
                            typ = 2;
                            html += headers.string + "&#39;";
                            break;
                        case "\"":
                            typ = 3;
                            html += headers.string + "&#34;";
                            break;
                        default:
                            if (operators[b]) {
                                html += wrapOperator(b);
                            }
                            else if (isWordByte(b)) {
                                typ = 1;
                                token += b;
                            }
                            else {
                                html += util_4.escape(b);
                            }
                    }
                    break;
                case 1:
                    token += b;
                    if (!isWordByte(next)) {
                        if (next === "(") {
                            html += headers.function + util_4.escape(token) + close;
                        }
                        else if (keywords[token]) {
                            html += wrapOperator(token);
                        }
                        else {
                            html += util_4.escape(token);
                        }
                        typ = 0;
                        token = "";
                    }
                    break;
                case 2:
                    html += util_4.escape(b);
                    if (b === "'" && prev != "\\") {
                        html += close;
                        typ = 0;
                    }
                    break;
                case 3:
                    html += util_4.escape(b);
                    if (b === "\"" && prev != "\\") {
                        html += close;
                        typ = 0;
                    }
                    break;
                case 4:
                    html += util_4.escape(b);
                    break;
            }
            prev = b;
        }
        if (typ === 1) {
            html += util_4.escape(token);
        }
        if (typ !== 0) {
            html += close;
        }
        html += "</code>";
        return html;
    }
    exports.default = highlightSyntax;
    function wrapOperator(b) {
        return headers.operator + util_4.escape(b) + close;
    }
    function isWordByte(ch) {
        const b = ch.charCodeAt(0);
        return b == 36 ||
            (b >= 48 && b <= 57) ||
            (b >= 65 && b <= 90) ||
            b == 95 ||
            (b >= 97 && b <= 122);
    }
});
define("posts/render/body", ["require", "exports", "state", "posts/render/etc", "util/index", "posts/embed", "posts/render/code"], function (require, exports, state_2, etc_1, util_5, embed_1, code_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const urlPrefixes = {
        'h': "http",
        'm': "magnet:?",
        'f': "ftp",
        'b': "bitcoin",
    };
    function renderBody(data) {
        const state = data.state = {
            spoiler: false,
            quote: false,
            code: false,
            bold: false,
            italic: false,
            red: false,
            blue: false,
            haveSyncwatch: false,
            successive_newlines: 0,
            iDice: 0,
        };
        let html = "";
        const fn = data.editing ? parseOpenLine : parseTerminatedLine;
        for (let l of data.body.split("\n")) {
            state.quote = false;
            if (html && state.successive_newlines < 2) {
                html += "<br>";
            }
            if (!l.length) {
                state.successive_newlines++;
                continue;
            }
            state.successive_newlines = 0;
            if (l[0] === ">") {
                state.quote = true;
                html += "<em>";
            }
            if (state.spoiler) {
                html += "<del>";
            }
            if (state.bold) {
                html += "<b>";
            }
            if (state.italic) {
                html += "<i>";
            }
            if (state.red) {
                html += "<span class=\"red\">";
            }
            if (state.blue) {
                html += "<span class=\"blue\">";
            }
            html += fn(l, data);
            if (state.blue) {
                html += "</span>";
            }
            if (state.red) {
                html += "</span>";
            }
            if (state.italic) {
                html += "</i>";
            }
            if (state.bold) {
                html += "</b>";
            }
            if (state.spoiler) {
                html += "</del>";
            }
            if (state.quote) {
                html += "</em>";
            }
        }
        return html;
    }
    exports.default = renderBody;
    function wrapTags(level, state) {
        const states = [
            state.spoiler,
            state.bold,
            state.italic,
            state.red,
            state.blue,
        ];
        const opening = [
            "<del>",
            "<b>",
            "<i>",
            "<span class=\"red\">",
            "<span class=\"blue\">",
        ];
        const closing = [
            "</del>",
            "</b>",
            "</i>",
            "</span>",
            "</span>",
        ];
        let html = "";
        for (let i = states.length - 1; i >= level; i--) {
            if (states[i]) {
                html += closing[i];
            }
        }
        if (!states[level]) {
            html += opening[level];
        }
        for (let i = level + 1; i < states.length; i++) {
            if (states[i]) {
                html += opening[i];
            }
        }
        return html;
    }
    function parseTerminatedLine(line, data) {
        return parseCode(line, data.state, frag => parseFragment(frag, data));
    }
    function parseCode(frag, state, fn) {
        let html = "";
        while (true) {
            const i = frag.indexOf("``");
            if (i !== -1) {
                html += formatCode(frag.slice(0, i), state, fn);
                frag = frag.substring(i + 2);
                state.code = !state.code;
            }
            else {
                html += formatCode(frag, state, fn);
                break;
            }
        }
        return html;
    }
    function formatCode(frag, state, fn) {
        let html = "";
        if (state.code) {
            while (frag[0] === '>') {
                html += "&gt;";
                frag = frag.slice(1);
            }
            html += code_1.default(frag);
        }
        else {
            html += parseSpoilers(frag, state, fn);
        }
        return html;
    }
    function parseSpoilers(frag, state, fn) {
        const _fn = (frag) => parseBolds(frag, state, fn);
        let html = "";
        while (true) {
            const i = frag.indexOf("**");
            if (i !== -1) {
                html += _fn(frag.slice(0, i)) + wrapTags(0, state);
                state.spoiler = !state.spoiler;
                frag = frag.substring(i + 2);
            }
            else {
                html += _fn(frag);
                break;
            }
        }
        return html;
    }
    function parseBolds(frag, state, fn) {
        const _fn = (frag) => parseItalics(frag, state, fn);
        let html = "";
        while (true) {
            const i = frag.indexOf("@@");
            if (i !== -1) {
                html += _fn(frag.slice(0, i)) + wrapTags(1, state);
                state.bold = !state.bold;
                frag = frag.substring(i + 2);
            }
            else {
                html += _fn(frag);
                break;
            }
        }
        return html;
    }
    function parseItalics(frag, state, fn) {
        const _fn = (frag) => parseReds(frag, state, fn);
        let html = "";
        while (true) {
            const i = frag.indexOf("~~");
            if (i !== -1) {
                html += _fn(frag.slice(0, i)) + wrapTags(2, state);
                state.italic = !state.italic;
                frag = frag.substring(i + 2);
            }
            else {
                html += _fn(frag);
                break;
            }
        }
        return html;
    }
    function parseReds(frag, state, fn) {
        const _fn = (frag) => parseBlues(frag, state, fn);
        const _rbText = state_2.boardConfig.rbText ? () => {
            const wrapped = wrapTags(3, state);
            state.red = !state.red;
            return wrapped;
        } : () => "";
        let html = "";
        while (true) {
            const i = frag.indexOf("^r");
            if (i !== -1) {
                html += _fn(frag.slice(0, i)) + _rbText();
                frag = frag.substring(i + 2);
            }
            else {
                html += _fn(frag);
                break;
            }
        }
        return html;
    }
    function parseBlues(frag, state, fn) {
        const _rbText = state_2.boardConfig.rbText ? () => {
            const wrapped = wrapTags(4, state);
            state.blue = !state.blue;
            return wrapped;
        } : () => "";
        let html = "";
        while (true) {
            const i = frag.indexOf("^b");
            if (i !== -1) {
                html += fn(frag.slice(0, i)) + _rbText();
                frag = frag.substring(i + 2);
            }
            else {
                html += fn(frag);
                break;
            }
        }
        return html;
    }
    function parseOpenLine(line, { state }) {
        return parseCode(line, state, parseOpenLinks);
    }
    function parseOpenLinks(frag) {
        let html = "";
        const words = frag.split(" ");
        for (let i = 0; i < words.length; i++) {
            if (i !== 0) {
                html += " ";
            }
            const [leadPunct, word, trailPunct] = splitPunctuation(words[i]);
            if (leadPunct) {
                html += leadPunct;
            }
            let matched = false;
            if (word && word[0] === ">") {
                const m = word.match(/^>>(>*)(\d+)$/);
                if (m) {
                    const id = parseInt(m[2]);
                    if (state_2.posts.has(id)) {
                        html += m[1] + etc_1.renderTempLink(id);
                        matched = true;
                    }
                }
            }
            if (!matched) {
                html += util_5.escape(word);
            }
            if (trailPunct) {
                html += trailPunct;
            }
        }
        return html;
    }
    function parseFragment(frag, data) {
        let html = "";
        const words = frag.split(" ");
        for (let i = 0; i < words.length; i++) {
            if (i !== 0) {
                html += " ";
            }
            let [leadPunct, word, trailPunct] = splitPunctuation(words[i]);
            if (leadPunct) {
                html += leadPunct;
            }
            if (!word) {
                if (trailPunct) {
                    html += trailPunct;
                }
                continue;
            }
            if ((word.indexOf("(") >= 0) && (word.indexOf("http") >= 0)) {
                let countOpen = (word.match(/[(]/g)).length;
                let countClosed = (word.match(/[)]/g) || []).length;
                if ((countOpen == countClosed + 1) && (trailPunct == ")")) {
                    word += ")";
                    trailPunct = " ";
                }
            }
            let m, matched = false;
            switch (word[0]) {
                case "#":
                    if (data.state.quote) {
                        break;
                    }
                    m = word.match(/^#(flip|\d*d\d+|8ball|pyu|pcount|sw(?:\d+:)?\d+:\d+(?:[+-]\d+)?|autobahn)$/);
                    if (m) {
                        html += parseCommand(m[1], data);
                        matched = true;
                        break;
                    }
                    break;
                case ">":
                    m = word.match(/^>>(>*)(\d+)$/);
                    if (m) {
                        html += parsePostLink(m, data.links);
                        matched = true;
                        break;
                    }
                    m = word.match(/^>>>(>*)\/(\w+)\/$/);
                    if (m) {
                        html += parseReference(m);
                        matched = true;
                        break;
                    }
                default:
                    let leadingGT = 0;
                    let stripped = word;
                    while (stripped.length && stripped[0] === ">") {
                        stripped = stripped.slice(1);
                        leadingGT++;
                    }
                    if (stripped.length) {
                        const pre = urlPrefixes[stripped[0]];
                        if (pre && stripped.startsWith(pre)) {
                            for (let i = 0; i < leadingGT; i++) {
                                html += ">";
                            }
                            html += parseURL(stripped);
                            matched = true;
                            break;
                        }
                    }
            }
            if (!matched) {
                html += util_5.escape(word);
            }
            if (trailPunct) {
                html += trailPunct;
            }
        }
        return html;
    }
    function parsePostLink(m, links) {
        if (!links) {
            return m[0];
        }
        const id = parseInt(m[2]);
        let data;
        for (let l of links) {
            if (l.id === id) {
                data = l;
                break;
            }
        }
        if (!data) {
            return m[0];
        }
        return m[1] + etc_1.renderPostLink(data);
    }
    function parseReference(m) {
        let href;
        if (state_2.boards.includes(m[2])) {
            href = `/${m[2]}/`;
        }
        else if (m[2] in state_2.config.links) {
            href = state_2.config.links[m[2]];
        }
        else {
            return m[0];
        }
        return m[1] + newTabLink(href, `>>>/${m[2]}/`);
    }
    function newTabLink(href, text) {
        const attrs = {
            rel: "noreferrer",
            href: util_5.escape(href),
            target: "_blank",
        };
        return `<a ${util_5.makeAttrs(attrs)}>${util_5.escape(text)}</a>`;
    }
    function parseURL(bit) {
        const embed = embed_1.parseEmbeds(bit);
        if (embed) {
            return embed;
        }
        try {
            new URL(bit);
            if (bit[0] == "m") {
                bit = util_5.escape(bit);
                return bit.link(bit);
            }
            return newTabLink(bit, bit);
        }
        catch (e) {
            return util_5.escape(bit);
        }
    }
    function parseCommand(bit, { commands, state }) {
        if (!commands || !commands[state.iDice]) {
            return "#" + bit;
        }
        if (!state_2.boardConfig.pyu) {
            switch (commands[state.iDice].type) {
                case 4:
                case 5:
                    state.iDice++;
                    return "#" + bit;
            }
        }
        let formatting = "<strong>";
        let inner;
        let literalMatching = true;
        switch (bit) {
            case "flip":
                inner = commands[state.iDice++].val ? "flap" : "flop";
                break;
            case "8ball":
                inner = util_5.escape(commands[state.iDice++].val.toString());
                break;
            case "autobahn":
                return `<strong class=\"dead\">#${bit}</strong>`;
            case "pyu":
            case "pcount":
                if (!state_2.boardConfig.pyu) {
                    break;
                }
                switch (commands[state.iDice].type) {
                    case 4:
                    case 5:
                        inner = commands[state.iDice++].val.toString();
                }
                break;
            default:
                literalMatching = false;
                if (bit.startsWith("sw")) {
                    if (commands[state.iDice].type !== 3) {
                        return "#" + bit;
                    }
                    return formatSyncwatch(bit, commands[state.iDice++].val, state);
                }
                if (commands[state.iDice].type !== 0) {
                    return "#" + bit;
                }
                const m = bit.match(/^(\d*)d(\d+)$/);
                if (parseInt(m[1]) > 10 || parseInt(m[2]) > 10000) {
                    return "#" + bit;
                }
                const sides = parseInt(m[2]);
                const rolls = commands[state.iDice++].val;
                inner = "";
                let sum = 0;
                for (let i = 0; i < rolls.length; i++) {
                    if (i) {
                        inner += " + ";
                    }
                    sum += rolls[i];
                    inner += rolls[i];
                }
                if (rolls.length > 1) {
                    inner += " = " + sum;
                }
                formatting = getRollFormatting(rolls.length, sides, sum);
        }
        const commandMatchers = {
            flip: 1,
            "8ball": 2,
            pyu: 4,
            pcount: 5
        };
        if (literalMatching
            && commandMatchers[bit] !== commands[state.iDice - 1].type) {
            return "#" + bit;
        }
        return `${formatting}#${bit} (${inner})</strong>`;
    }
    function getRollFormatting(numberOfDice, facesPerDie, sum) {
        const maxRoll = numberOfDice * facesPerDie;
        if (maxRoll < 10 || facesPerDie == 1) {
            return "<strong>";
        }
        if (maxRoll == sum) {
            return "<strong class=\"super_roll\">";
        }
        else if (sum == numberOfDice) {
            return "<strong class=\"kuso_roll\">";
        }
        else if (sum == 69 || sum == 6969) {
            return "<strong class=\"lewd_roll\">";
        }
        else if (checkEm(sum)) {
            if (sum < 100) {
                return "<strong class=\"dubs_roll\">";
            }
            else if (sum < 1000) {
                return "<strong class=\"trips_roll\">";
            }
            else if (sum < 10000) {
                return "<strong class=\"quads_roll\">";
            }
            else {
                return "<strong class=\"rainbow_roll\">";
            }
        }
        return "<strong>";
    }
    function checkEm(num) {
        if (num < 10) {
            return false;
        }
        const digit = num % 10;
        while (true) {
            num = Math.floor(num / 10);
            if (num == 0) {
                return true;
            }
            if (num % 10 != digit) {
                return false;
            }
        }
    }
    function formatSyncwatch(bit, val, state) {
        state.haveSyncwatch = true;
        const attrs = {
            class: "embed syncwatch",
            "data-hour": val[0].toString(),
            "data-min": val[1].toString(),
            "data-sec": val[2].toString(),
            "data-start": val[3].toString(),
            "data-end": val[4].toString()
        };
        return `<em><strong ${util_5.makeAttrs(attrs)}>syncwatch</strong></em>`;
    }
    function splitPunctuation(word) {
        const re = ["", word, ""];
        re[1] = word;
        if (re[1].length < 2) {
            return re;
        }
        if (isPunctuation(re[1][0])) {
            re[0] = re[1][0];
            re[1] = re[1].slice(1);
        }
        const l = re[1].length;
        if (l < 2) {
            return re;
        }
        if (isPunctuation(re[1][l - 1])) {
            re[2] = re[1][l - 1];
            re[1] = re[1].slice(0, -1);
        }
        return re;
    }
    function isPunctuation(b) {
        switch (b) {
            case '!':
            case '"':
            case '\'':
            case '(':
            case ')':
            case ',':
            case '-':
            case '.':
            case ':':
            case ';':
            case '?':
            case '[':
            case ']':
                return true;
            default:
                return false;
        }
    }
});
define("posts/render/index", ["require", "exports", "posts/render/body", "posts/render/etc"], function (require, exports, body_1, etc_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseBody = body_1.default;
    __export(etc_2);
});
define("options/stackBlur", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mul_table = [
        512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
        454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
        482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
        437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
        497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
        320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
        446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
        329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
        505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
        399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
        324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
        268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
        451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
        385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
        332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
        289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
    ];
    const shg_table = [
        9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
    ];
    function blurCanvas(canvas, top_x, top_y, width, height, radius) {
        if (isNaN(radius) || radius < 1) {
            return;
        }
        radius |= 0;
        const context = canvas.getContext("2d"), imageData = context.getImageData(top_x, top_y, width, height), pixels = imageData.data;
        let x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
        const div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
        const stackStart = newStack();
        let stack = stackStart, stackEnd;
        for (i = 1; i < div; i++) {
            stack = stack.next = newStack();
            if (i == radiusPlus1) {
                stackEnd = stack;
            }
        }
        stack.next = stackStart;
        let stackIn, stackOut;
        yw = yi = 0;
        const mul_sum = mul_table[radius], shg_sum = shg_table[radius];
        for (y = 0; y < height; y++) {
            r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum
                = a_sum = 0;
            r_out_sum = radiusPlus1 * (pr = pixels[yi]);
            g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;
            stack = stackStart;
            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            for (i = 1; i < radiusPlus1; i++) {
                p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
                b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;
                a_sum += (stack.a = (pa = pixels[p + 3])) * rbs;
                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;
                stack = stack.next;
            }
            stackIn = stackStart;
            stackOut = stackEnd;
            for (x = 0; x < width; x++) {
                pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
                if (pa != 0) {
                    pa = 255 / pa;
                    pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
                }
                else {
                    pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
                }
                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;
                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;
                p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1))
                    << 2;
                r_in_sum += (stackIn.r = pixels[p]);
                g_in_sum += (stackIn.g = pixels[p + 1]);
                b_in_sum += (stackIn.b = pixels[p + 2]);
                a_in_sum += (stackIn.a = pixels[p + 3]);
                r_sum += r_in_sum;
                g_sum += g_in_sum;
                b_sum += b_in_sum;
                a_sum += a_in_sum;
                stackIn = stackIn.next;
                r_out_sum += (pr = stackOut.r);
                g_out_sum += (pg = stackOut.g);
                b_out_sum += (pb = stackOut.b);
                a_out_sum += (pa = stackOut.a);
                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;
                stackOut = stackOut.next;
                yi += 4;
            }
            yw += width;
        }
        for (x = 0; x < width; x++) {
            g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum
                = r_sum = 0;
            yi = x << 2;
            r_out_sum = radiusPlus1 * (pr = pixels[yi]);
            g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;
            stack = stackStart;
            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            yp = width;
            for (i = 1; i <= radius; i++) {
                yi = (yp + x) << 2;
                r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
                b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;
                a_sum += (stack.a = (pa = pixels[yi + 3])) * rbs;
                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;
                stack = stack.next;
                if (i < heightMinus1) {
                    yp += width;
                }
            }
            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;
            for (y = 0; y < height; y++) {
                p = yi << 2;
                pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
                if (pa > 0) {
                    pa = 255 / pa;
                    pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                    pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                    pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
                }
                else {
                    pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
                }
                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;
                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;
                p = (x + (((p = y + radiusPlus1) < heightMinus1 ?
                    p : heightMinus1) * width)) << 2;
                r_sum += (r_in_sum += (stackIn.r = pixels[p]));
                g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
                b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));
                a_sum += (a_in_sum += (stackIn.a = pixels[p + 3]));
                stackIn = stackIn.next;
                r_out_sum += (pr = stackOut.r);
                g_out_sum += (pg = stackOut.g);
                b_out_sum += (pb = stackOut.b);
                a_out_sum += (pa = stackOut.a);
                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;
                stackOut = stackOut.next;
                yi += width;
            }
        }
        context.putImageData(imageData, top_x, top_y);
    }
    exports.default = blurCanvas;
    function newStack() {
        const stack = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        };
        stack.next = stack;
        return stack;
    }
});
define("db", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const dbVersion = 12;
    let db;
    let hasErred = false;
    const postStores = [
        "mine",
        "hidden",
        "seen",
        "seenPost",
    ];
    const threadStores = [
        "watchedThreads",
        "openThreads",
    ];
    function open() {
        return new Promise((resolve, reject) => {
            const r = indexedDB.open('meguca', dbVersion);
            r.onerror = () => reject(r.error);
            r.onupgradeneeded = upgradeDB;
            r.onsuccess = () => {
                db = r.result;
                db.onerror = throwErr;
                resolve();
                db.onversionchange = () => {
                    db.close();
                    if (location.reload) {
                        location.reload(true);
                    }
                    else if (self && self.close) {
                        self.close();
                    }
                };
                setTimeout(() => {
                    for (let name of postStores.concat(threadStores)) {
                        deleteExpired(name);
                    }
                }, 10000);
            };
        })
            .catch(err => {
            hasErred = true;
            console.error("Error loading IndexedDB. All further DB access will be ignored");
            console.error(err);
        });
    }
    exports.open = open;
    function upgradeDB(event) {
        db = event.target.result;
        switch (event.oldVersion) {
            case 0:
            case 1:
            case 2:
            case 3:
                for (let name of Array.from(db.objectStoreNames)) {
                    db.deleteObjectStore(name);
                }
                for (let name of postStores) {
                    createOPStore(db, name);
                }
                db.createObjectStore('main', { keyPath: 'id' });
            case 4:
            case 5:
            case 6:
                for (let name of postStores) {
                    if (db.objectStoreNames.contains(name)) {
                        db.deleteObjectStore(name);
                    }
                    createOPStore(db, name);
                }
            case 7:
                createExpiringStore(db, "watchedThreads");
            case 8:
                event.currentTarget
                    .transaction
                    .objectStore("mine")
                    .createIndex("id", "id");
            case 9:
                for (let name of postStores) {
                    db.deleteObjectStore(name);
                    createOPStore(db, name);
                }
            case 10:
                if (!db.objectStoreNames.contains("watchedThreads")) {
                    createExpiringStore(db, "watchedThreads");
                }
            case 11:
                db.deleteObjectStore("watchedThreads");
                createExpiringStore(db, "watchedThreads", true);
                createExpiringStore(db, "openThreads", true);
        }
    }
    function createExpiringStore(db, name, primaryKeyed = false) {
        const args = {};
        if (primaryKeyed) {
            args["keyPath"] = "id";
        }
        const s = db.createObjectStore(name, args);
        s.createIndex("expires", "expires");
        return s;
    }
    function createOPStore(db, name) {
        createExpiringStore(db, name).createIndex("op", "op");
    }
    function throwErr(err) {
        throw err;
    }
    function deleteExpired(name) {
        const req = newTransaction(name, true)
            .index("expires")
            .openCursor(IDBKeyRange.upperBound(Date.now()));
        req.onerror = throwErr;
        req.onsuccess = event => {
            const cursor = event.target.result;
            if (!cursor) {
                return;
            }
            cursor.delete();
            cursor.continue();
        };
    }
    function newTransaction(store, write) {
        const t = db.transaction(store, write ? "readwrite" : "readonly");
        t.onerror = throwErr;
        return t.objectStore(store);
    }
    function readIDs(store, ops) {
        if (hasErred || !ops.length) {
            return Promise.resolve([]);
        }
        return Promise.all(ops.map(id => readThreadIDs(store, id)))
            .then(ids => [].concat(...ids));
    }
    exports.readIDs = readIDs;
    function readThreadIDs(store, op) {
        return readIDRange(store, s => s.index("op").openCursor(op));
    }
    async function readIDRange(store, criteria) {
        if (hasErred) {
            return Promise.resolve([]);
        }
        return new Promise((resolve, reject) => {
            const s = newTransaction(store, false);
            const req = criteria ? criteria(s) : s.openCursor();
            req.onerror = err => reject(err);
            const ids = [];
            req.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    ids.push(cursor.value.id);
                    cursor.continue();
                }
                else {
                    resolve(ids);
                }
            };
        });
    }
    exports.readIDRange = readIDRange;
    async function forEach(store, fn) {
        return new Promise((resolve, reject) => {
            const req = newTransaction(store, false).openCursor();
            req.onerror = err => reject(err);
            req.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    fn(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve();
                }
            };
        });
    }
    exports.forEach = forEach;
    function storeID(store, expiry, ...items) {
        if (hasErred) {
            return;
        }
        const expires = Date.now() + expiry;
        putAll(store, items.map(item => {
            const obj = Object.assign({}, item);
            obj.expires = expires;
            return { obj: item, key: item.id };
        }));
    }
    exports.storeID = storeID;
    function clearStore(store) {
        if (hasErred) {
            return;
        }
        const trans = newTransaction(store, true), req = trans.clear();
        req.onerror = throwErr;
    }
    exports.clearStore = clearStore;
    function getObj(store, id) {
        if (hasErred) {
            throw new Error("IndexedDB not accessible");
        }
        return new Promise((resolve, reject) => {
            const t = newTransaction(store, false), r = t.get(id);
            r.onerror = () => reject(r.error);
            r.onsuccess = () => resolve(r.result);
        });
    }
    exports.getObj = getObj;
    function putObj(store, obj, key = undefined) {
        if (hasErred) {
            return Promise.resolve(undefined);
        }
        return new Promise((resolve, reject) => {
            const t = newTransaction(store, true), r = t.put(obj, key);
            r.onerror = () => reject(r.error);
            r.onsuccess = () => resolve();
        });
    }
    exports.putObj = putObj;
    function putAll(store, toAdd) {
        if (hasErred) {
            return Promise.resolve(undefined);
        }
        return new Promise((resolve, reject) => {
            const objStore = newTransaction(store, true), transaction = objStore.transaction;
            for (const { obj, key } of toAdd) {
                objStore.put(obj, key);
            }
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
    exports.putAll = putAll;
    function deleteObj(store, id) {
        if (hasErred) {
            return Promise.resolve(undefined);
        }
        return new Promise((resolve, reject) => {
            const t = newTransaction(store, true);
            const r = t.delete(id);
            r.onerror = () => reject(r.error);
            r.onsuccess = () => resolve();
        });
    }
    exports.deleteObj = deleteObj;
});
define("options/background", ["require", "exports", "options/stackBlur", "options/index", "state", "util/index", "db"], function (require, exports, stackBlur_1, _1, state_3, util_6, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const container = document.getElementById("user-background"), style = document.getElementById("user-background-style");
    const colourMap = {
        glass: {
            normal: 'rgba(40, 42, 46, 0.5)',
            editing: 'rgba(105, 105, 105, 0.5)',
            highlight: 'rgba(64, 67, 73, .5)',
        },
        ocean: {
            normal: 'rgba(28, 29, 34, 0.78)',
            editing: 'rgba(44, 57, 71, 0.88)',
            highlight: 'rgba(44, 44, 51, 0.88)',
        }
    };
    exports.default = () => {
        for (let param of ['theme', 'workModeToggle']) {
            _1.default.onChange(param, render);
        }
    };
    function render(bg) {
        container.innerHTML = '';
        style.innerHTML = '';
        let showOPBG = false;
        if (_1.default.bgVideo !== 'none') {
            renderBgVideo();
            showOPBG = true;
        }
        else if (_1.default.userBG && !_1.default.workModeToggle) {
            renderBackground(bg);
            showOPBG = true;
        }
        toggleOPBackground(showOPBG);
    }
    exports.render = render;
    function renderBgVideo() {
        if (_1.default.workModeToggle) {
            container.innerHTML = "";
        }
        else {
            container.innerHTML = util_6.HTML `<video autoplay loop${_1.default.bgMute ? ' muted' : ''}>
				<source src="/assets/videos/${_1.default.bgVideo}" type="${_1.default.bgVideo.split('.').pop() === "webm" ? "video/webm" : "video/mp4"}">
			</video>`;
        }
    }
    function toggleOPBackground(on) {
        const tc = document.getElementById("threads");
        if (tc) {
            tc.classList.toggle("custom-BG", on);
        }
    }
    async function renderBackground(bg) {
        if (!bg || !bg.normal || !bg.blurred) {
            bg = await db_1.getObj("main", "background");
            if (!bg.normal || !bg.blurred) {
                return;
            }
        }
        const normal = URL.createObjectURL(bg.normal);
        let html = util_6.HTML `#user-background {
			background: url(${normal}) no-repeat fixed center;
			background-size: cover;
		}`;
        const { theme } = _1.default;
        if (theme === 'glass' || theme === 'ocean') {
            html += ' ' + renderGlass(theme, bg.blurred);
        }
        style.innerHTML = html;
    }
    function renderGlass(theme, blob) {
        const { normal, editing, highlight } = colourMap[theme], blurred = URL.createObjectURL(blob);
        return util_6.HTML `.glass {
			background:
				linear-gradient(${normal}, ${normal}),
				url(${blurred}) center fixed no-repeat;
			background-size: cover;
		}
		article.editing {
			background:
				linear-gradient(${editing}, ${editing}),
				url(${blurred}) center fixed no-repeat;
			background-size: cover;
		}
		article.highlight:not(.editing), article:target {
			background:
				linear-gradient(${highlight}, ${highlight}),
				url(${blurred}) center fixed no-repeat;
			background-size: cover;
		}`;
    }
    async function store(file) {
        state_3.displayLoading(true);
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await util_6.load(img);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas
            .getContext('2d')
            .drawImage(img, 0, 0, img.width, img.height);
        const normal = await canvasToBlob(canvas);
        stackBlur_1.default(canvas, 0, 0, img.width, img.height, 10);
        const blurred = await canvasToBlob(canvas);
        const bg = {
            id: 'background',
            normal,
            blurred
        };
        await db_1.putObj("main", bg);
        if (_1.default.userBG) {
            render(bg);
        }
        state_3.displayLoading(false);
    }
    exports.store = store;
    function canvasToBlob(canvas) {
        return new Promise(resolve => canvas.toBlob(resolve));
    }
});
define("options/mascot", ["require", "exports", "db", "options/index"], function (require, exports, db_2, _2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = () => _2.default.onChange("workModeToggle", render);
    async function store(file) {
        const store = {
            id: "mascot",
            val: file,
        };
        await db_2.putObj("main", store);
        if (_2.default.mascot) {
            render(store);
        }
    }
    exports.store = store;
    async function render(mascot) {
        const old = document.getElementById("mascot-image");
        if (old) {
            old.remove();
        }
        if (!_2.default.mascot || _2.default.workModeToggle) {
            return;
        }
        if (!mascot || !mascot.val) {
            mascot = await db_2.getObj("main", "mascot");
            if (!mascot || !mascot.val) {
                return;
            }
        }
        const img = document.createElement("img");
        img.id = "mascot-image";
        img.src = URL.createObjectURL(mascot.val);
        document.body.append(img);
    }
    exports.render = render;
});
define("options/nowPlaying", ["require", "exports", "util/index", "options/index", "lang"], function (require, exports, util_7, _3, lang_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let el = document.getElementById('banner-center'), data = {}, started = false, dataEden = {};
    exports.posterName = () => _posterName;
    let _posterName = "";
    const songMap = new Map([
        [/Girls,? Be Ambitious/i, 'Joe'],
        [/Super Special/i, 'Super Special'],
    ]);
    function radioData(res) {
        const { main: { np, listeners, dj: { djname: dj, }, }, } = res;
        return { np, listeners, dj };
    }
    function edenData(res) {
        const { dj: dj, current: np, listeners: listeners } = res;
        return { np, listeners, dj };
    }
    async function fetchData() {
        let newData = {};
        switch (_3.default.nowPlaying) {
            case "r/a/dio":
                {
                    const [res, err] = await util_7.fetchJSON('https://r-a-d.io/api');
                    if (err) {
                        return console.warn(err);
                    }
                    newData = radioData(res);
                }
                break;
            case "eden":
                {
                    const [res, err] = await util_7.fetchJSON('https://edenofthewest.com/ajax/status.php');
                    if (err) {
                        return console.warn(err);
                    }
                    newData = edenData(res);
                }
                break;
            case "both":
                {
                    let newDataEden = {};
                    const [res, err] = await util_7.fetchJSON('https://r-a-d.io/api');
                    const [resEden, errEden] = await util_7.fetchJSON('https://edenofthewest.com/ajax/status.php');
                    if (err) {
                        return console.warn(err);
                    }
                    if (errEden) {
                        return console.warn(errEden);
                    }
                    newData = radioData(res);
                    newDataEden = edenData(resEden);
                    data = newData;
                    dataEden = newDataEden;
                    render();
                }
                break;
        }
        if (!isMatch(newData, data) && (_3.default.nowPlaying != "both")) {
            data = newData;
            render();
        }
    }
    function isMatch(a, b) {
        for (let key in a) {
            if (a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    }
    function genAttrs(data) {
        return util_7.makeAttrs({
            title: lang_2.default.ui["googleSong"],
            href: `https://google.com/search?q=`
                + encodeURIComponent(data.np.replace(/\-/g, ' ')),
            target: "_blank",
        });
    }
    function render() {
        if (_3.default.nowPlaying === "none") {
            el.innerHTML = _posterName = "";
            return;
        }
        let matched = false;
        for (let [patt, rep] of songMap) {
            if (patt.test(data.np)) {
                matched = true;
                _posterName = rep;
                break;
            }
        }
        if (!matched) {
            _posterName = "";
        }
        if (_3.default.nowPlaying === "both") {
            el.innerHTML = util_7.HTML `<a href="https://r-a-d.io/" target="_blank">
				[${util_7.escape(data.listeners.toString())}] ${util_7.escape(data.dj)}
			</a>
			<a ${genAttrs(data)}>
				<b>
					${util_7.escape(data.np)}
				</b>
			</a>
			 |
			<a href="https://edenofthewest.com/" target="_blank">
				[${util_7.escape(dataEden.listeners.toString())}] ${util_7.escape(dataEden.dj)}
			</a>
			<a ${genAttrs(dataEden)}>
				<b>
					${util_7.escape(dataEden.np)}
				</b>
			</a>`;
        }
        else {
            const site = _3.default.nowPlaying === "eden"
                ? "edenofthewest.com"
                : "r-a-d.io";
            el.innerHTML = util_7.HTML `<a href="https://${site}/" target="_blank">
			[${util_7.escape(data.listeners.toString())}] ${util_7.escape(data.dj)}
		</a>
		<a ${genAttrs(data)}>
			<b>
				${util_7.escape(data.np)}
			</b>
		</a>`;
        }
    }
    function default_1() {
        if (started) {
            return;
        }
        started = true;
        fetchData();
        let timer = setInterval(fetchData, 10000);
        _3.default.onChange("nowPlaying", selection => {
            if (selection === "none") {
                clearInterval(timer);
                render();
            }
            else {
                timer = setInterval(fetchData, 10000);
                fetchData();
            }
        });
    }
    exports.default = default_1;
});
define("options/meguTV", ["require", "exports", "options/index", "util/index", "state", "posts/index", "connection/index"], function (require, exports, _4, util_8, state_4, posts_1, connection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let playlist;
    let lastStart = 0;
    function render() {
        if (!playlist) {
            return;
        }
        let cont = document.getElementById("megu-tv");
        if (!cont) {
            cont = document.createElement("div");
            util_8.setAttrs(cont, {
                id: "megu-tv",
                class: "modal glass",
                style: "display: block;",
            });
            document.getElementById("modal-overlay").prepend(cont);
        }
        if (_4.default.workModeToggle) {
            cont.removeAttribute("style");
            return;
        }
        const existing = {};
        for (let ch of [...cont.children]) {
            ch.pause();
            ch.remove();
            existing[ch.getAttribute("data-sha1")] = ch;
        }
        for (let i = 0; i < playlist.length; i++) {
            let el = existing[playlist[i].sha1];
            if (!el) {
                el = document.createElement("video");
                el.setAttribute("data-sha1", playlist[i].sha1);
                el.setAttribute("style", "max-width:30vw");
                el.onmouseenter = () => el.controls = true;
                el.onmouseleave = () => el.controls = false;
                el.src = posts_1.sourcePath(playlist[i].sha1, playlist[i].file_type);
                el.volume = _4.default.audioVolume / 100;
            }
            if (!i) {
                el.currentTime = posts_1.serverNow() - lastStart;
                el.classList.remove("hidden");
                el.muted = false;
            }
            else {
                el.muted = true;
                el.classList.add("hidden");
            }
            cont.append(el);
            el.play();
        }
    }
    function persistMessages() {
        connection_1.handlers[40] = (data) => {
            lastStart = posts_1.serverNow() - data.elapsed;
            playlist = data.playlist;
            if (_4.default.meguTV) {
                render();
            }
        };
        connection_1.connSM.on(3, subscribe);
    }
    exports.persistMessages = persistMessages;
    function subscribe() {
        if (_4.default.meguTV) {
            connection_1.send(40, null);
        }
    }
    function default_2() {
        const el = document.getElementById("megu-tv");
        if (el || state_4.page.board === "all" || !state_4.page.thread) {
            return;
        }
        if (connection_1.connSM.state === 3) {
            subscribe();
        }
        render();
        _4.default.onChange("meguTV", on => {
            if (on && state_4.page.board !== "all") {
                if (!document.getElementById("megu-tv")) {
                    render();
                }
            }
            else {
                const el = document.getElementById("megu-tv");
                if (el) {
                    el.remove();
                }
            }
        });
        _4.default.onChange("workModeToggle", on => {
            const el = document.getElementById("megu-tv");
            if (el) {
                if (on) {
                    for (let ch of [...el.children]) {
                        ch.muted = true;
                    }
                    render();
                }
                else {
                    render();
                    el.setAttribute("style", "display: block");
                    let ch = el.firstChild;
                    ch.muted = false;
                }
            }
        });
    }
    exports.default = default_2;
});
define("options/specs", ["require", "exports", "state", "util/index", "options/background", "options/mascot", "options/nowPlaying", "options/meguTV", "options/index"], function (require, exports, state_5, util_9, background_1, mascot_1, nowPlaying_1, meguTV_1, _5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function renderBackground(_) {
        background_1.render();
    }
    exports.specs = {
        inlineFit: {
            type: 4,
            default: "width",
        },
        hideThumbs: {},
        workModeToggle: {
            type: 0,
            default: false,
            exec: toggleHeadStyle("work-mode", ".image-banner{display: none;}"),
        },
        imageHover: {
            default: true,
        },
        webmHover: {},
        audioVolume: {
            type: 7,
            default: 100,
        },
        autogif: {},
        spoilers: {
            default: true,
        },
        notification: {
            default: true,
            exec(enabled) {
                const req = enabled
                    && typeof Notification === "function"
                    && Notification.permission !== "granted";
                if (req) {
                    Notification.requestPermission();
                }
            },
        },
        watchThreadsOnReply: {
            default: true,
        },
        anonymise: {},
        hideBinned: {},
        hideRecursively: {},
        postInlineExpand: {
            default: true,
            exec: toggleHeadStyle("postInlineExpand", ".hash-link{ display: inline; }"),
        },
        relativeTime: {},
        nowPlaying: {
            type: 4,
            default: "none",
            noExecOnStart: true,
            exec: nowPlaying_1.default,
        },
        bgVideo: {
            type: 4,
            default: "none",
            noExecOnStart: true,
            exec: renderBackground,
        },
        bgMute: {
            noExecOnStart: true,
            exec: renderBackground,
        },
        meguTV: {
            noExecOnStart: true,
            exec: meguTV_1.default,
        },
        horizontalPosting: {
            exec: toggleHeadStyle('horizontal', util_9.HTML `#thread-container {
				display:flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-items: center;
			}`)
        },
        replyRight: {
            exec: toggleHeadStyle('reply-at-right', 'aside.posting{margin: -26px 0 2px auto;}')
        },
        theme: {
            type: 4,
            get default() {
                return state_5.config.defaultCSS;
            },
            noExecOnStart: true,
            exec(theme) {
                if (!theme) {
                    return;
                }
                document
                    .getElementById('theme-css')
                    .setAttribute('href', `/assets/css/${theme}.css`);
                util_9.setCookie("theme", theme, 365 * 10);
            },
        },
        userBG: {
            noExecOnStart: true,
            exec: renderBackground,
        },
        userBGImage: {
            type: 2,
        },
        mascot: {
            noExecOnStart: true,
            exec: mascot_1.render,
        },
        mascotImage: {
            type: 2,
        },
        customCSSToggle: {
            noExecOnStart: true,
            exec(on) {
                let el = document
                    .getElementById("custom-CSS-style");
                if (!el) {
                    el = document.createElement("style");
                    el.id = "custom-CSS-style";
                    document.head.append(el);
                    el = document
                        .getElementById("custom-CSS-style");
                }
                el.innerHTML = _5.default.customCSS;
                el.disabled = !on;
            },
        },
        customCSS: {
            type: 5,
        },
        alwaysLock: {},
        google: {
            default: true,
            exec: toggleImageSearch("google"),
        },
        yandex: {
            exec: toggleImageSearch("yandex"),
        },
        iqdb: {
            exec: toggleImageSearch("iqdb"),
        },
        saucenao: {
            default: true,
            exec: toggleImageSearch("saucenao"),
        },
        whatAnime: {
            exec: toggleImageSearch("whatAnime"),
        },
        desustorage: {
            exec: toggleImageSearch("desustorage"),
        },
        exhentai: {
            exec: toggleImageSearch("exhentai"),
        },
        newPost: {
            default: 78,
            type: 3,
        },
        done: {
            default: 83,
            type: 3,
        },
        toggleSpoiler: {
            default: 73,
            type: 3,
        },
        expandAll: {
            default: 69,
            type: 3,
        },
        workMode: {
            default: 66,
            type: 3,
        },
        meguTVShortcut: {
            default: 84,
            type: 3,
        },
        galleryModeToggle: {
            type: 6,
            exec: toggleHeadStyle("gallery", `#threads article:not(.media),
			.fileinfo,
			blockquote,
			.backlinks,
			header {
				display: none;
			}
			#thread-container, article:not(.reply-form) {
				display: inline-table;
			}
			.post-container {
				display: flex;
				min-width: initial;
			}
			figure {
				margin: 0;
				margin-left: auto;
				margin-right: auto;
			}
			figcaption {
				text-align: center;
			}
			article {
				padding: 0.5em;
				width: fit-content;
			}
			a[download] {
				font-size: 0;
			}
			a[download]::before {
				content: " 🡇";
				font-size: 15px;
			}`)
        },
        galleryMode: {
            default: 71,
            type: 3,
        },
    };
    function toggleImageSearch(engine) {
        return toggleHeadStyle(engine, `.${engine}{display:initial;}`);
    }
    function toggleHeadStyle(name, css) {
        return toggle => {
            const id = name + "-toggle";
            if (!document.getElementById(id)) {
                const html = `<style id="${id}">${css}</style>`;
                document.head.append(util_9.makeEl(html));
            }
            document.getElementById(id).disabled = !toggle;
        };
    }
});
define("options/loop", ["require", "exports", "state", "options/index", "posts/index", "common/index", "util/index"], function (require, exports, state_6, _6, posts_2, common_1, util_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = () => {
        const handlers = {
            workModeToggle: renderImages,
            hideThumbs: renderImages,
            spoilers: toggleSpoilers,
            autogif: toggleAutoGIF,
            anonymise: toggleAnonymisation,
            hideBinned: toggleHideBinned,
            relativeTime: renderTime,
        };
        for (let key in handlers) {
            _6.default.onChange(key, handlers[key]);
        }
    };
    setInterval(() => {
        if (_6.default.relativeTime && !state_6.page.catalog) {
            renderTime();
        }
    }, 60000);
    function loopPosts(test, fn) {
        if (state_6.page.catalog) {
            return;
        }
        for (let post of state_6.posts) {
            if (test(post)) {
                fn(post);
            }
        }
    }
    function renderImages() {
        if (state_6.page.catalog) {
            let display = "";
            if (_6.default.hideThumbs || _6.default.workModeToggle) {
                display = "none";
            }
            for (let el of document.querySelectorAll("img.catalog")) {
                el.style.display = display;
            }
        }
        else {
            loopPosts(({ image }) => !!image, ({ view }) => view.renderImage(false));
        }
    }
    function toggleSpoilers() {
        loopPosts(({ image }) => !!image && image.spoiler, ({ view }) => view.renderImage(false));
    }
    function toggleAutoGIF() {
        loopPosts(({ image }) => {
            if (!image) {
                return false;
            }
            switch (image.file_type) {
                case common_1.fileTypes.gif:
                    return true;
                default:
                    return false;
            }
        }, ({ view }) => view.renderImage(false));
    }
    function toggleAnonymisation() {
        loopPosts(({ name, trip, auth }) => !!name || !!trip || !!auth, ({ view }) => view.renderName());
    }
    function toggleHideBinned() {
        if (!_6.default.hideBinned) {
            return;
        }
        loopPosts((post) => {
            return post.isDeleted();
        }, (post) => {
            posts_2.hideRecursively(post);
        });
        util_10.trigger("renderHiddenCount", state_6.hidden.size);
    }
    function renderTime() {
        for (let { view } of state_6.posts) {
            view.renderTime();
        }
    }
});
define("options/index", ["require", "exports", "options/specs", "options/background", "options/loop", "options/mascot", "util/index", "state", "options/background", "options/mascot", "options/specs", "options/nowPlaying", "options/meguTV"], function (require, exports, specs_1, background_2, loop_1, mascot_2, util_11, state_7, background_3, mascot_3, specs_2, nowPlaying_2, meguTV_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.storeBackground = background_3.store;
    exports.storeMascot = mascot_3.store;
    __export(specs_2);
    exports.posterName = nowPlaying_2.posterName;
    exports.persistMessages = meguTV_2.persistMessages;
    localStorage.removeItem("options");
    let options = {};
    for (let k in specs_1.specs) {
        options[k] = undefined;
    }
    exports.default = options = util_11.emitChanges({});
    util_11.hook("getOptions", () => options);
    exports.models = {};
    class OptionModel {
        constructor(id, spec) {
            this.spec = spec;
            this.id = id;
            if (!spec.type) {
                spec.type = 0;
            }
            const val = options[this.id] = this.get();
            options.onChange(this.id, val => this.onChange(val));
            if (!spec.noExecOnStart) {
                this.execute(val);
            }
            exports.models[this.id] = this;
        }
        read() {
            return localStorage.getItem(this.id) || "";
        }
        get() {
            const stored = this.read();
            if (!stored) {
                return this.spec.default;
            }
            else {
                if (stored === 'false') {
                    return false;
                }
                if (stored === "true") {
                    return true;
                }
                const num = parseInt(stored, 10);
                if (num || num === 0) {
                    return num;
                }
                return stored;
            }
        }
        onChange(val) {
            this.execute(val);
            this.set(val);
        }
        execute(val) {
            if (this.spec.exec) {
                this.spec.exec(val);
            }
        }
        set(val) {
            if (this.id === "meguTV") {
                return;
            }
            if (val !== this.spec.default || this.read()) {
                localStorage.setItem(this.id, val.toString());
            }
            util_11.trigger("renderOptionValue", this.id, this.spec.type, val);
        }
    }
    function initOptions() {
        for (let id in specs_1.specs) {
            new OptionModel(id, specs_1.specs[id]);
        }
        const bgElement = document.getElementById("bgVideo");
        bgElement.innerHTML = "";
        for (let val of state_7.bgVideos) {
            const opt = document.createElement("option");
            opt.value = val;
            opt.innerText = val;
            bgElement.append(opt);
        }
        for (let opt of [
            "userBG", "nowPlaying", "bgVideo", "mascot", "customCSSToggle",
            "meguTV",
        ]) {
            if (options[opt]) {
                exports.models[opt].execute(true);
            }
        }
        options.onChange("customCSS", () => {
            if (options.customCSSToggle) {
                exports.models["customCSSToggle"].execute(true);
            }
        });
        background_2.default();
        mascot_2.default();
        loop_1.default();
    }
    exports.initOptions = initOptions;
    function canNotify() {
        return options.notification
            && typeof Notification === "function"
            && Notification.permission === "granted";
    }
    exports.canNotify = canNotify;
    function canShowImages() {
        return !options.hideThumbs && !options.workModeToggle;
    }
    exports.canShowImages = canShowImages;
    function notificationOpts() {
        const re = {};
        if (canShowImages()) {
            re.icon = re.badge = "/assets/notification-icon.png";
        }
        return {
            vibrate: 500,
        };
    }
    exports.notificationOpts = notificationOpts;
});
define("posts/images", ["require", "exports", "common/index", "base/index", "util/index", "options/index", "state", "lang"], function (require, exports, common_2, base_2, util_12, options_1, state_8, lang_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expandAll = false;
    class ImageHandler extends base_2.View {
        renderImage(reveal) {
            this.el.classList.add("media");
            let el = this.getFigure();
            if (!el) {
                el = util_12.importTemplate("figure").firstChild;
                this.el.querySelector(".post-container").prepend(el);
            }
            const showThumb = (!options_1.default.hideThumbs && !options_1.default.workModeToggle)
                || reveal;
            el.hidden = !showThumb;
            if (showThumb) {
                el.firstElementChild.hidden = false;
                this.renderThumbnail();
            }
            this.renderFigcaption(reveal);
        }
        getFigure() {
            return util_12.firstChild(this.el.querySelector(".post-container"), ch => ch.tagName === "FIGURE");
        }
        getFigcaption() {
            return util_12.firstChild(this.el, ch => ch.tagName === "FIGCAPTION");
        }
        removeImage() {
            this.el.classList.remove("media");
            let el = this.getFigure();
            if (el) {
                el.remove();
            }
            el = this.getFigcaption();
            if (el) {
                el.remove();
            }
            this.uncheckModerationBox();
        }
        uncheckModerationBox() {
            const el = this.el.querySelector(".mod-checkbox");
            if (el) {
                el.checked = false;
            }
        }
        renderThumbnail() {
            const el = this.el.querySelector("figure a"), { sha1, file_type: file_type, thumb_type: thumbType, dims, spoiler } = this
                .model
                .image, src = sourcePath(sha1, file_type);
            let thumb, [, , thumbWidth, thumbHeight] = dims;
            if (thumbType === common_2.fileTypes.noFile) {
                let file;
                switch (file_type) {
                    case common_2.fileTypes.webm:
                    case common_2.fileTypes.mp4:
                    case common_2.fileTypes.mp3:
                    case common_2.fileTypes.ogg:
                    case common_2.fileTypes.flac:
                        file = "audio";
                        break;
                    default:
                        file = "file";
                }
                thumb = `/assets/${file}.png`;
                thumbHeight = thumbWidth = 150;
            }
            else if (spoiler && options_1.default.spoilers) {
                thumb = '/assets/spoil/default.jpg';
                thumbHeight = thumbWidth = 150;
            }
            else if (options_1.default.autogif && file_type === common_2.fileTypes.gif) {
                thumb = src;
            }
            else {
                thumb = thumbPath(sha1, thumbType);
            }
            el.setAttribute("href", src);
            util_12.setAttrs(el.firstElementChild, {
                src: thumb,
                width: thumbWidth.toString(),
                height: thumbHeight.toString(),
                class: "",
            });
        }
        renderFigcaption(reveal) {
            let el = this.getFigcaption();
            if (!el) {
                el = util_12.importTemplate("figcaption").firstChild;
                this.el.querySelector("header").after(el);
            }
            const [hToggle, , info, link] = Array.from(el.children);
            if (!options_1.default.hideThumbs && !options_1.default.workModeToggle) {
                hToggle.hidden = true;
            }
            else {
                hToggle.hidden = false;
                hToggle.textContent = lang_3.default.posts[reveal ? 'hide' : 'show'];
            }
            const data = this.model.image;
            const arr = [];
            if (data.audio) {
                arr.push("♫");
            }
            if (data.length) {
                let s;
                if (data.length < 60) {
                    s = `0:${util_12.pad(data.length)}`;
                }
                else {
                    const min = Math.floor(data.length / 60);
                    s = `${util_12.pad(min)}:${util_12.pad(data.length - min * 60)}`;
                }
                arr.push(s);
            }
            const { size } = data;
            let s;
            if (size < (1 << 10)) {
                s = size + ' B';
            }
            else if (size < (1 << 20)) {
                s = Math.round(size / (1 << 10)) + ' KB';
            }
            else {
                const text = Math.round(size / (1 << 20) * 10).toString();
                s = `${text.slice(0, -1)}.${text.slice(-1)} MB`;
            }
            arr.push(s);
            const [w, h] = data.dims;
            if (w || h) {
                arr.push(`${w}x${h}`);
            }
            if (data.artist) {
                arr.push(data.artist);
            }
            if (data.title) {
                arr.push(data.title);
            }
            let html = "";
            for (let s of arr) {
                html += `<span>${util_12.escape(s)}</span>`;
            }
            info.innerHTML = html;
            for (let el of Array.from(info.children)) {
                switch (el.className) {
                    case "media-title":
                        el.textContent = data.title;
                        break;
                    case "media-artist":
                        el.textContent = data.artist;
                        break;
                    case "has-audio":
                        el.style.display = data.audio ? "" : "none";
                        break;
                    case "media-length":
                        const len = data.length;
                        if (len) {
                            let s;
                            if (len < 60) {
                                s = `0:${util_12.pad(len)}`;
                            }
                            else {
                                const min = Math.floor(len / 60), sec = len - min * 60;
                                s = `${util_12.pad(min)}:${util_12.pad(sec)}`;
                            }
                            el.textContent = s;
                        }
                        break;
                    case "filesize":
                        const { size } = data;
                        let s;
                        if (size < (1 << 10)) {
                            s = size + ' B';
                        }
                        else if (size < (1 << 20)) {
                            s = Math.round(size / (1 << 10)) + ' KB';
                        }
                        else {
                            const text = Math.round(size / (1 << 20) * 10)
                                .toString();
                            s = `${text.slice(0, -1)}.${text.slice(-1)} MB`;
                        }
                        el.textContent = s;
                        break;
                    case "dims":
                        const [w, h] = data.dims;
                        if (!w && !h) {
                            el.style.display = "none";
                        }
                        else {
                            el.style.display = "";
                            el.textContent = `${w}x${h}`;
                        }
                        break;
                }
            }
            const ext = common_2.fileTypes[data.file_type], name = `${util_12.escape(data.name)}.${ext}`;
            util_12.setAttrs(el.lastElementChild, {
                href: `/assets/images/src/${data.sha1}.${ext}`,
                download: name,
            });
            link.innerHTML = name;
            this.renderImageSearch(el);
            el.hidden = false;
        }
        renderImageSearch(figcaption) {
            const { file_type: fileType, thumb_type: thumbType, sha1, md5, size } = this.model.image, el = figcaption.querySelector(".image-search-container");
            if (thumbType === common_2.fileTypes.noFile || fileType === common_2.fileTypes.pdf) {
                el.hidden = true;
                return;
            }
            let url, root, type;
            switch (fileType) {
                case common_2.fileTypes.jpg:
                case common_2.fileTypes.gif:
                case common_2.fileTypes.png:
                    if (size < 8 << 20) {
                        root = "src";
                        type = fileType;
                    }
                    break;
            }
            if (!root) {
                root = "thumb";
                type = thumbType;
            }
            url = `/assets/images/${root}/${sha1}.${common_2.fileTypes[type]}`;
            url = encodeURI(location.origin + url);
            const [google, yandex, iqdb, saucenao, whatanime, desuarchive, exhentai] = Array.from(el.children);
            google.setAttribute("href", "https://www.google.com/searchbyimage?image_url=" + url);
            yandex.setAttribute("href", "https://yandex.com/images/search?source=collections&rpt=imageview&url=" + url);
            iqdb.setAttribute("href", "http://iqdb.org/?url=" + url);
            saucenao.setAttribute("href", "http://saucenao.com/search.php?db=999&url=" + url);
            whatanime.setAttribute("href", "https://trace.moe/?url=" + url);
            if (desuarchive) {
                switch (fileType) {
                    case common_2.fileTypes.jpg:
                    case common_2.fileTypes.png:
                    case common_2.fileTypes.gif:
                    case common_2.fileTypes.webm:
                        desuarchive.setAttribute("href", "https://desuarchive.org/_/search/image/" + md5);
                        break;
                    default:
                        desuarchive.remove();
                }
            }
            if (exhentai) {
                switch (fileType) {
                    case common_2.fileTypes.jpg:
                    case common_2.fileTypes.png:
                        exhentai.setAttribute("href", "http://exhentai.org/?fs_similar=1&fs_exp=1&f_shash="
                            + sha1);
                        break;
                    default:
                        exhentai.remove();
                }
            }
        }
        toggleImageExpansion(event) {
            const img = this.model.image;
            if (img.expanded) {
                return this.contractImage(event, true);
            }
            if (common_2.isExpandable(img.file_type)) {
                this.el.querySelector(".fileinfo").after(util_12.makeEl(util_12.HTML `<span class="act contract-button">
						<a>Contract</a>
					</span>`));
            }
            switch (img.file_type) {
                case common_2.fileTypes.mp3:
                case common_2.fileTypes.flac:
                    event.preventDefault();
                    return this.renderAudio();
                case common_2.fileTypes.webm:
                case common_2.fileTypes.mp4:
                case common_2.fileTypes.ogg:
                    if (!this.model.image.video) {
                        event.preventDefault();
                        return this.renderAudio();
                    }
                    else {
                        return this.expandImage(event, false);
                    }
                default:
                    if (!common_2.isExpandable(img.file_type)) {
                        event.preventDefault();
                        return this.el
                            .querySelector("figcaption a[download]")
                            .click();
                    }
                    return this.expandImage(event, false);
            }
        }
        autoExpandImage() {
            if (exports.expandAll && shouldAutoExpand(this.model)) {
                this.expandImage(null, true);
            }
        }
        contractImage(e, scroll) {
            const img = this.model.image;
            const figcaption = this.getFigcaption();
            if (figcaption) {
                const el = figcaption.querySelector(".contract-button");
                if (el) {
                    el.remove();
                }
            }
            switch (img.file_type) {
                case common_2.fileTypes.ogg:
                case common_2.fileTypes.mp3:
                case common_2.fileTypes.flac:
                case common_2.fileTypes.mp4:
                case common_2.fileTypes.webm:
                    const v = this.el.querySelector("figure video");
                    if (v) {
                        v.remove();
                    }
                    const a = this.el.querySelector("audio");
                    if (a) {
                        a.remove();
                    }
                    this.el.querySelector("figure img").hidden = false;
                    break;
            }
            if (e) {
                e.preventDefault();
            }
            this.renderImage(false);
            if (img.tallerThanViewport && scroll && !options_1.default.galleryModeToggle) {
                this.el.scrollIntoView();
            }
            img.expanded = img.tallerThanViewport = img.revealed = false;
        }
        expandImage(event, noScroll) {
            const mode = options_1.default.inlineFit, img = this.model.image;
            let cls = "expanded ";
            switch (mode) {
                case "none":
                    return;
                case "width":
                    cls += "fit-to-width";
                    img.tallerThanViewport = img.dims[1] > window.innerHeight;
                    if (img.tallerThanViewport
                        && !noScroll
                        && !options_1.default.galleryModeToggle) {
                        this.el.scrollIntoView();
                    }
                    break;
                case "screen":
                    cls += "fit-to-screen";
                    break;
            }
            this.model.image.expanded = true;
            if (event) {
                event.preventDefault();
            }
            util_12.trigger("imageExpanded");
            const figure = this.el.querySelector("figure"), imgEl = figure.querySelector("img"), src = sourcePath(img.sha1, img.file_type);
            switch (img.file_type) {
                case common_2.fileTypes.ogg:
                case common_2.fileTypes.mp4:
                case common_2.fileTypes.webm:
                    const video = document.createElement("video");
                    util_12.setAttrs(video, {
                        src,
                        class: cls,
                        autoplay: "",
                        controls: "",
                        loop: "",
                    });
                    imgEl.hidden = true;
                    video.volume = options_1.default.audioVolume / 100;
                    figure.append(video);
                    break;
                default:
                    const el = document.createElement("img");
                    util_12.setAttrs(el, {
                        src,
                        class: cls,
                    });
                    imgEl.replaceWith(el);
            }
        }
        renderAudio() {
            const el = document.createElement("audio"), img = this.model.image;
            util_12.setAttrs(el, {
                autoplay: "",
                loop: "",
                controls: "",
                src: sourcePath(img.sha1, img.file_type),
            });
            el.volume = options_1.default.audioVolume / 100;
            this.model.image.expanded = true;
            this.el.querySelector("figure").after(el);
        }
    }
    exports.default = ImageHandler;
    function imageRoot() {
        return state_8.config.imageRootOverride || "/assets/images";
    }
    function thumbPath(sha1, thumbType) {
        return `${imageRoot()}/thumb/${sha1}.${common_2.fileTypes[thumbType]}`;
    }
    exports.thumbPath = thumbPath;
    function sourcePath(sha1, fileType) {
        return `${imageRoot()}/src/${sha1}.${common_2.fileTypes[fileType]}`;
    }
    exports.sourcePath = sourcePath;
    function handleImageClick(event) {
        const el = event.target;
        if (options_1.default.inlineFit === "none"
            || event.which !== 1
            || el.classList.contains("catalog")) {
            return;
        }
        const model = state_8.getModel(el);
        if (!model) {
            return;
        }
        model.view.toggleImageExpansion(event);
    }
    function contractImage(e) {
        const el = event.target;
        const model = state_8.getModel(el);
        if (!model) {
            return;
        }
        model.view.contractImage(e, true);
    }
    function toggleHiddenThumbnail(event) {
        const model = state_8.getModel(event.target);
        if (!model) {
            return;
        }
        const { revealed } = model.image;
        model.view.renderImage(!revealed);
        model.image.revealed = !revealed;
    }
    function toggleExpandAll() {
        exports.expandAll = !exports.expandAll;
        const e = document.querySelector("#expand-images a");
        if (e) {
            const k = (exports.expandAll ? "contract" : "expand") + "Images";
            e.textContent = lang_3.default.posts[k];
        }
        for (let post of state_8.posts) {
            if (!shouldAutoExpand(post)) {
                continue;
            }
            if (exports.expandAll) {
                post.view.expandImage(null, true);
            }
            else {
                post.view.contractImage(null, false);
            }
        }
    }
    exports.toggleExpandAll = toggleExpandAll;
    function setExpandAll(b) {
        exports.expandAll = b;
    }
    exports.setExpandAll = setExpandAll;
    function shouldAutoExpand(model) {
        if (!model.image) {
            return false;
        }
        switch (model.image.file_type) {
            case common_2.fileTypes.jpg:
            case common_2.fileTypes.png:
            case common_2.fileTypes.gif:
                return true;
            default:
                return false;
        }
    }
    util_12.on(document, "click", handleImageClick, {
        selector: "figure img, figure video, figure a",
    });
    util_12.on(document, "click", toggleHiddenThumbnail, {
        passive: true,
        selector: ".image-toggle",
    });
    util_12.on(document, "click", toggleExpandAll, {
        passive: true,
        selector: "#expand-images a",
    });
    util_12.on(document, "click", contractImage, {
        passive: true,
        selector: ".contract-button a",
    });
});
define("posts/syncwatch", ["require", "exports", "lang", "util/index", "connection/index"], function (require, exports, lang_4, util_13, connection_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let offset = 0;
    connection_2.handlers[36] = (time) => offset = Date.now() / 1000 - time;
    function serverNow() {
        return Date.now() / 1000 + offset;
    }
    exports.serverNow = serverNow;
    class Syncwatch {
        constructor(el) {
            this.el = el;
            this.el.classList.add("ticking");
            for (let id of ["hour", "min", "sec", "start", "end"]) {
                this[id] = parseInt(this.el.getAttribute("data-" + id));
            }
            this.render();
        }
        render() {
            const now = Math.round(serverNow());
            if (now > this.end) {
                this.el.innerText = lang_4.default.ui["finished"];
                return;
            }
            else if (now < this.start) {
                this.el.innerHTML = (this.start - now).toString();
            }
            else {
                let diff = now - this.start;
                const hour = Math.floor(diff / 3600);
                diff -= hour * 3600;
                const min = Math.floor(diff / 60);
                diff -= min * 60;
                this.el.innerHTML = this.formatTime(hour, min, diff)
                    + " / "
                    + this.formatTime(this.hour, this.min, this.sec);
            }
            setTimeout(() => {
                if (document.contains(this.el)) {
                    this.render();
                }
            }, 1000);
        }
        formatTime(hour, min, sec) {
            return `${util_13.pad(hour)}:${util_13.pad(min)}:${util_13.pad(sec)}`;
        }
    }
    function findSyncwatches(qs) {
        for (let el of qs.querySelectorAll(".syncwatch:not(.ticking)")) {
            new Syncwatch(el);
        }
    }
    exports.findSyncwatches = findSyncwatches;
});
define("posts/countries", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "ad": "Andorra",
        "ae": "United Arab Emirates",
        "af": "Afghanistan",
        "ag": "Antigua and Barbuda",
        "ai": "Anguilla",
        "al": "Albania",
        "am": "Armenia",
        "ao": "Angola",
        "aq": "Antarctica",
        "ar": "Argentina",
        "as": "American Samoa",
        "at": "Austria",
        "au": "Australia",
        "aw": "Aruba",
        "ax": "Aland Islands !",
        "az": "Azerbaijan",
        "ba": "Bosnia and Herzegovina",
        "bb": "Barbados",
        "bd": "Bangladesh",
        "be": "Belgium",
        "bf": "Burkina Faso",
        "bg": "Bulgaria",
        "bh": "Bahrain",
        "bi": "Burundi",
        "bj": "Benin",
        "bl": "Saint Barthélemy",
        "bm": "Bermuda",
        "bn": "Brunei Darussalam",
        "bo": "Bolivia",
        "bq": "Bonaire",
        "br": "Brazil",
        "bs": "Bahamas",
        "bt": "Bhutan",
        "bv": "Bouvet Island",
        "bw": "Botswana",
        "by": "Belarus",
        "bz": "Belize",
        "ca": "Canada",
        "cc": "Cocos (Keeling) Islands",
        "cd": "Congo",
        "cf": "Central African Republic",
        "cg": "Congo",
        "ch": "Switzerland",
        "ci": "Cote d'Ivoire !",
        "ck": "Cook Islands",
        "cl": "Chile",
        "cm": "Cameroon",
        "cn": "China",
        "co": "Colombia",
        "cr": "Costa Rica",
        "cu": "Cuba",
        "cv": "Cabo Verde",
        "cw": "Curaçao",
        "cx": "Christmas Island",
        "cy": "Cyprus",
        "cz": "Czechia",
        "de": "Germany",
        "dj": "Djibouti",
        "dk": "Denmark",
        "dm": "Dominica",
        "do": "Dominican Republic",
        "dz": "Algeria",
        "ec": "Ecuador",
        "ee": "Estonia",
        "eg": "Egypt",
        "eh": "Western Sahara",
        "er": "Eritrea",
        "es": "Spain",
        "et": "Ethiopia",
        "fi": "Finland",
        "fj": "Fiji",
        "fk": "Falkland Islands (Malvinas)",
        "fm": "Micronesia",
        "fo": "Faroe Islands",
        "fr": "France",
        "ga": "Gabon",
        "gb": "United Kingdom",
        "gd": "Grenada",
        "ge": "Georgia",
        "gf": "French Guiana",
        "gg": "Guernsey",
        "gh": "Ghana",
        "gi": "Gibraltar",
        "gl": "Greenland",
        "gm": "Gambia",
        "gn": "Guinea",
        "gp": "Guadeloupe",
        "gq": "Equatorial Guinea",
        "gr": "Greece",
        "gs": "South Georgia and the South Sandwich Islands",
        "gt": "Guatemala",
        "gu": "Guam",
        "gw": "Guinea-Bissau",
        "gy": "Guyana",
        "hk": "Hong Kong",
        "hm": "Heard Island and McDonald Islands",
        "hn": "Honduras",
        "hr": "Croatia",
        "ht": "Haiti",
        "hu": "Hungary",
        "id": "Indonesia",
        "ie": "Ireland",
        "il": "Israel",
        "im": "Isle of Man",
        "in": "India",
        "io": "British Indian Ocean Territory",
        "iq": "Iraq",
        "ir": "Iran",
        "is": "Iceland",
        "it": "Italy",
        "je": "Jersey",
        "jm": "Jamaica",
        "jo": "Jordan",
        "jp": "Japan",
        "ke": "Kenya",
        "kg": "Kyrgyzstan",
        "kh": "Cambodia",
        "ki": "Kiribati",
        "km": "Comoros",
        "kn": "Saint Kitts and Nevis",
        "kp": "Democratic People's Republic of Korea",
        "kr": "Republic of Korea",
        "kw": "Kuwait",
        "ky": "Cayman Islands",
        "kz": "Kazakhstan",
        "la": "Lao People's Democratic Republic",
        "lb": "Lebanon",
        "lc": "Saint Lucia",
        "li": "Liechtenstein",
        "lk": "Sri Lanka",
        "lr": "Liberia",
        "ls": "Lesotho",
        "lt": "Lithuania",
        "lu": "Luxembourg",
        "lv": "Latvia",
        "ly": "Libya",
        "ma": "Morocco",
        "mc": "Monaco",
        "md": "Moldova",
        "me": "Montenegro",
        "mf": "Saint Martin (French part)",
        "mg": "Madagascar",
        "mh": "Marshall Islands",
        "mk": "Macedonia",
        "ml": "Mali",
        "mm": "Myanmar",
        "mn": "Mongolia",
        "mo": "Macao",
        "mp": "Northern Mariana Islands",
        "mq": "Martinique",
        "mr": "Mauritania",
        "ms": "Montserrat",
        "mt": "Malta",
        "mu": "Mauritius",
        "mv": "Maldives",
        "mw": "Malawi",
        "mx": "Mexico",
        "my": "Malaysia",
        "mz": "Mozambique",
        "na": "Namibia",
        "nc": "New Caledonia",
        "ne": "Niger",
        "nf": "Norfolk Island",
        "ng": "Nigeria",
        "ni": "Nicaragua",
        "nl": "Netherlands",
        "no": "Norway",
        "np": "Nepal",
        "nr": "Nauru",
        "nu": "Niue",
        "nz": "New Zealand",
        "om": "Oman",
        "pa": "Panama",
        "pe": "Peru",
        "pf": "French Polynesia",
        "pg": "Papua New Guinea",
        "ph": "Philippines",
        "pk": "Pakistan",
        "pl": "Poland",
        "pm": "Saint Pierre and Miquelon",
        "pn": "Pitcairn",
        "pr": "Puerto Rico",
        "ps": "Palestine",
        "pt": "Portugal",
        "pw": "Palau",
        "py": "Paraguay",
        "qa": "Qatar",
        "re": "Reunion !",
        "ro": "Romania",
        "rs": "Serbia",
        "ru": "Russian Federation",
        "rw": "Rwanda",
        "sa": "Saudi Arabia",
        "sb": "Solomon Islands",
        "sc": "Seychelles",
        "sd": "Sudan",
        "se": "Sweden",
        "sg": "Singapore",
        "sh": "Saint Helena",
        "si": "Slovenia",
        "sj": "Svalbard and Jan Mayen",
        "sk": "Slovakia",
        "sl": "Sierra Leone",
        "sm": "San Marino",
        "sn": "Senegal",
        "so": "Somalia",
        "sr": "Suriname",
        "ss": "South Sudan",
        "st": "Sao Tome and Principe",
        "sv": "El Salvador",
        "sx": "Sint Maarten (Dutch part)",
        "sy": "Syrian Arab Republic",
        "sz": "Swaziland",
        "tc": "Turks and Caicos Islands",
        "td": "Chad",
        "tf": "French Southern Territories",
        "tg": "Togo",
        "th": "Thailand",
        "tj": "Tajikistan",
        "tk": "Tokelau",
        "tl": "Timor-Leste",
        "tm": "Turkmenistan",
        "tn": "Tunisia",
        "to": "Tonga",
        "tr": "Turkey",
        "tt": "Trinidad and Tobago",
        "tv": "Tuvalu",
        "tw": "Taiwan",
        "tz": "Tanzania",
        "ua": "Ukraine",
        "ug": "Uganda",
        "um": "United States Minor Outlying Islands",
        "us": "United States of America",
        "uy": "Uruguay",
        "uz": "Uzbekistan",
        "va": "Holy See",
        "vc": "Saint Vincent and the Grenadines",
        "ve": "Venezuela",
        "vg": "British Virgin Islands",
        "vi": "U.S. Virgin Islands",
        "vn": "Viet Nam",
        "vu": "Vanuatu",
        "wf": "Wallis and Futuna",
        "ws": "Samoa",
        "ye": "Yemen",
        "yt": "Mayotte",
        "za": "South Africa",
        "zm": "Zambia",
        "zw": "Zimbabwe",
    };
});
define("util/time", ["require", "exports", "lang"], function (require, exports, lang_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function secondsToTime(s) {
        const divide = [60, 60, 24, 30, 12];
        const unit = ['second', 'minute', 'hour', 'day', 'month'];
        let time = s;
        const format = (key) => {
            let tmp = time.toFixed(1);
            let plural = lang_5.default.plurals[key][1];
            if (tmp.includes(".0")) {
                tmp = tmp.substr(0, tmp.length - 2);
                if (tmp == '1') {
                    plural = lang_5.default.plurals[key][0];
                }
            }
            return `${tmp} ${plural}`;
        };
        for (let i = 0; i < divide.length; i++) {
            if (time < divide[i]) {
                return format(unit[i]);
            }
            time /= divide[i];
        }
        return format("year");
    }
    exports.secondsToTime = secondsToTime;
});
define("posts/view", ["require", "exports", "util/index", "posts/render/index", "posts/images", "posts/syncwatch", "lang", "state", "options/index", "posts/countries", "util/time"], function (require, exports, util_14, render_1, images_1, syncwatch_1, lang_6, state_9, options_2, countries_1, time_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const modLevelStrings = ["", "janitors", "moderators", "owners", "admin"];
    class PostView extends images_1.default {
        constructor(model, el) {
            const attrs = { model };
            if (el) {
                attrs.el = el;
                if (el.classList.contains("deleted") && !model.isDeleted()) {
                    el.classList.remove("deleted");
                }
            }
            else {
                attrs.class = 'glass';
                if (model.editing) {
                    attrs.class += ' editing';
                }
                if (model.id === model.op) {
                    attrs.class += " op";
                }
                if (model.isDeleted()) {
                    attrs.class += " deleted";
                    if (options_2.default.hideBinned) {
                        attrs.class += " hidden";
                    }
                }
                attrs.tag = "article";
                attrs.id = "p" + model.id;
            }
            super(attrs);
            this.model.view = this;
            if (!el) {
                this.el.append(util_14.importTemplate("article"));
                this.render();
                this.autoExpandImage();
            }
            else if (this.model.moderation) {
                this.renderModerationLog();
            }
        }
        render() {
            if (this.model.subject) {
                const el = this.el.querySelector("h3");
                el.innerHTML = `「${util_14.escape(this.model.subject)}」`;
                el.hidden = false;
            }
            this.el.querySelector("blockquote").innerHTML = render_1.parseBody(this.model);
            if (this.model.backlinks) {
                this.renderBacklinks();
            }
            if (this.model.moderation && this.model.moderation.length) {
                this.renderModerationLog();
            }
            this.renderHeader();
            if (this.model.image) {
                this.renderImage(false);
            }
        }
        buffer() {
            const { state: { spoiler, quote, bold, italic, red, blue } } = this.model;
            let buf = this.el.querySelector("blockquote");
            for (let b of [quote, spoiler, bold, italic, red, blue]) {
                if (b) {
                    buf = buf.lastElementChild;
                }
            }
            return buf;
        }
        scrolledPast() {
            const rect = this.el.getBoundingClientRect(), viewW = document.documentElement.clientWidth, viewH = document.documentElement.clientHeight;
            return rect.bottom < viewH && rect.left > 0 && rect.left < viewW;
        }
        reparseBody() {
            const bq = this.el.querySelector("blockquote");
            bq.innerHTML = "";
            bq.append(util_14.makeFrag(render_1.parseBody(this.model)));
            if (this.model.state.haveSyncwatch) {
                syncwatch_1.findSyncwatches(this.el);
            }
        }
        appendString(s) {
            this.buffer().append(s);
        }
        backspace() {
            const buf = this.buffer();
            buf.normalize();
            buf.innerHTML = buf.innerHTML.slice(0, -1);
        }
        renderBacklinks() {
            let el = util_14.firstChild(this.el, ch => ch.classList.contains("backlinks"));
            if (!el) {
                el = document.createElement("span");
                el.classList.add("spaced", "backlinks");
                this.el.append(el);
            }
            const rendered = new Set();
            for (let em of Array.from(el.children)) {
                const id = em.firstChild.getAttribute("data-id");
                rendered.add(parseInt(id));
            }
            let html = "";
            for (let idStr in this.model.backlinks) {
                const id = parseInt(idStr);
                if (rendered.has(id)) {
                    continue;
                }
                rendered.add(id);
                const bl = this.model.backlinks[id];
                html += "<em>"
                    + render_1.renderPostLink({
                        id: id,
                        op: bl.op,
                        board: bl.board,
                    })
                    + "</em>";
            }
            el.append(util_14.makeFrag(html));
        }
        renderHeader() {
            this.renderTime();
            this.renderName();
            if (this.model.sticky) {
                this.renderSticky();
            }
            const nav = this.el.querySelector("nav"), link = nav.firstElementChild, quote = nav.lastElementChild, { id, flag } = this.model;
            let url = `#p${id}`;
            if (!state_9.page.thread && !state_9.page.catalog) {
                url = `/all/${id}?last=100` + url;
            }
            quote.href = link.href = url;
            quote.textContent = id.toString();
            if (flag) {
                const el = this.el.querySelector(".flag");
                el.setAttribute("src", `/assets/flags/${flag}.svg`);
                el.setAttribute("title", countries_1.default[flag] || flag);
                el.hidden = false;
            }
        }
        renderTime() {
            const abs = this.readableTime();
            const rel = render_1.relativeTime(this.model.time);
            const el = this.el.querySelector("time");
            const currentTitle = el.getAttribute("title");
            const newTitle = options_2.default.relativeTime ? abs : rel;
            if (currentTitle != newTitle) {
                el.setAttribute("title", newTitle);
            }
            const currentText = el.textContent;
            const newText = options_2.default.relativeTime ? rel : abs;
            if (currentText != newText) {
                el.textContent = newText;
            }
        }
        readableTime() {
            const d = new Date(this.model.time * 1000);
            return `${util_14.pad(d.getDate())} ${lang_6.default.time.calendar[d.getMonth()]} `
                + `${d.getFullYear()} (${lang_6.default.time.week[d.getDay()]}) `
                + `${util_14.pad(d.getHours())}:${util_14.pad(d.getMinutes())}:${util_14.pad(d.getSeconds())}`;
        }
        closePost() {
            this.setEditing(false);
            this.reparseBody();
        }
        hide() {
            this.el.classList.add("hidden");
        }
        unhide() {
            this.el.classList.remove("hidden");
        }
        renderName() {
            const el = this.el.querySelector(".name");
            if (options_2.default.anonymise) {
                el.innerHTML = lang_6.default.posts["anon"];
                return;
            }
            let html = "";
            const { trip, name, auth, sage, id } = this.model;
            if (name || !trip) {
                html += `<span>${name ? util_14.escape(name) : lang_6.default.posts["anon"]}</span>`;
            }
            if (trip) {
                html += `<code>!${util_14.escape(trip)}</code>`;
            }
            if (auth) {
                el.classList.add("admin");
                html +=
                    `<span>## ${lang_6.default.posts[modLevelStrings[auth]] || "??"}</span>`;
            }
            if (state_9.mine.has(id)) {
                html += `<i>${lang_6.default.posts["you"]}</i>`;
            }
            el.classList.toggle("sage", !!sage);
            el.innerHTML = html;
        }
        renderModerationLog() {
            this.uncheckModerationBox();
            if (state_9.page.catalog) {
                return;
            }
            const pc = this.el.querySelector(".post-container");
            for (let el of Array.from(pc.children)) {
                if (el.classList.contains("post-moderation")) {
                    el.remove();
                }
            }
            if (!this.model.moderation) {
                return;
            }
            for (let { type, length, by, data } of this.model.moderation) {
                let s;
                switch (type) {
                    case 0:
                        s = this.format('banned', by, time_1.secondsToTime(length)
                            .toUpperCase(), data);
                        break;
                    case 9:
                        if (state_9.mine.has(this.model.id)) {
                            continue;
                        }
                        s = this.format('shadowBinned', by, time_1.secondsToTime(length)
                            .toUpperCase(), data);
                        break;
                    case 2:
                        if (state_9.mine.has(this.model.id)) {
                            continue;
                        }
                        s = this.format('deleted', by);
                        break;
                    case 3:
                        s = this.format('imageDeleted', by);
                        break;
                    case 4:
                        s = this.format("imageSpoilered", by);
                        break;
                    case 5:
                        s = this.format("threadLockToggled", lang_6.default.posts[data === 'true' ? "locked" : "unlocked"], by);
                        break;
                    case 7:
                        s = this.format("viewedSameIP", by);
                        break;
                    case 8:
                        s = this.format("purgedPost", by, data);
                        break;
                    case 1:
                        s = this.format('unbanned', by);
                        break;
                    default:
                        continue;
                }
                const el = document.createElement('b');
                el.setAttribute("class", "admin post-moderation");
                el.append(s, document.createElement("br"));
                pc.append(el);
            }
        }
        format(formatKey, ...args) {
            let i = 0;
            return lang_6.default.format[formatKey].replace(/%s/g, _ => args[i++]);
        }
        setHighlight(on) {
            this.el.classList.toggle("highlight", on);
        }
        setEditing(on) {
            this.el.classList.toggle("editing", on);
        }
        renderSticky() {
            this.renderIcon("sticky", this.model.sticky);
        }
        renderLocked() {
            this.renderIcon("locked", this.model.locked);
        }
        renderIcon(id, render) {
            const old = this.el.querySelector("." + id);
            if (old) {
                old.remove();
            }
            if (render) {
                this.el.querySelector(".mod-checkbox").after(util_14.importTemplate(id));
            }
        }
        reposition() {
            const { id, op } = this.model, sec = document.querySelector(`section[data-id="${op}"]`);
            if (!sec) {
                return;
            }
            for (let el of Array.from(sec.children)) {
                switch (el.tagName) {
                    case "ARTICLE":
                        if (util_14.getID(el) > id) {
                            el.before(this.el);
                            return;
                        }
                        break;
                    case "ASIDE":
                        el.before(this.el);
                        return;
                }
            }
            sec.append(this.el);
        }
    }
    exports.default = PostView;
    function updateTimeTooltip(event) {
        if (options_2.default.relativeTime) {
            return;
        }
        if (!(event.target instanceof HTMLElement)) {
            return;
        }
        const target = event.target;
        const post = target.closest("article[id^=p]");
        const postId = post && post.id.match(/\d+/)[0];
        const model = postId && state_9.posts.get(postId);
        const view = model && model.view;
        if (!view) {
            return;
        }
        view.renderTime();
    }
    util_14.on(document, "mouseover", updateTimeTooltip, {
        passive: true,
        selector: "time",
    });
});
define("ui/banner", ["require", "exports", "base/index"], function (require, exports, base_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = () => {
        for (let id of ["options", "FAQ", "identity", "account"]) {
            highlightBanner(id);
        }
        new base_3.BannerModal(document.getElementById("FAQ"));
    };
    function highlightBanner(name) {
        const key = name + "_seen";
        if (localStorage.getItem(key)) {
            return;
        }
        const el = document.querySelector('#banner-' + name);
        el.classList.add("blinking");
        el.addEventListener("click", () => {
            el.classList.remove("blinking");
            localStorage.setItem(key, '1');
        });
    }
});
define("ui/forms", ["require", "exports", "util/index", "base/index", "state"], function (require, exports, util_15, base_4, state_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FormView extends base_4.View {
        constructor(attrs) {
            super(attrs);
            this.needCaptcha = false;
            if (attrs.needCaptcha) {
                this.needCaptcha = true;
            }
            this.onClick({
                "input[name=cancel]": () => this.remove(),
                ".map-remove, .array-remove": e => this.removeInput(e),
                ".map-add": e => this.addInput(e, "keyValue"),
                ".array-add": e => this.addInput(e, "arrayItem"),
            });
            this.on("submit", e => this.submit(e));
        }
        submit(event) {
            event.preventDefault();
            if (state_10.config.captcha && this.needCaptcha) {
                util_15.trigger("renderCaptchaForm", this.send.bind(this));
            }
            else {
                this.send();
            }
        }
        renderFormResponse(text) {
            const el = this.el.querySelector(".form-response");
            if (el) {
                el.textContent = text;
            }
            else {
                alert(text);
            }
        }
        addInput(event, id) {
            event.target.before(util_15.importTemplate(id));
        }
        removeInput(event) {
            event.target.closest("span").remove();
        }
    }
    exports.default = FormView;
});
define("ui/tab", ["require", "exports", "connection/index", "state"], function (require, exports, connection_3, state_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const titleEl = document.head.querySelector("title"), title = titleEl.textContent, faviconEl = document.getElementById("favicon"), urlBase = "/assets/favicons/", queue = [];
    const lastRendered = {
        state: 0,
        unseenPosts: 0,
    };
    let unseenPosts = 0, unseenReplies = false, discoFavicon;
    function postAdded(post) {
        if (queue.length == 0) {
            setTimeout(processQueue, 16);
        }
        queue.push(post);
    }
    exports.postAdded = postAdded;
    function processQueue() {
        for (let post of queue) {
            if (!post.seen()) {
                unseenPosts++;
            }
        }
        queue.length = 0;
        resolve();
    }
    function repliedToMe(post) {
        if (!post.seen()) {
            unseenReplies = true;
            resolve();
        }
    }
    exports.repliedToMe = repliedToMe;
    function resolve() {
        switch (connection_3.connSM.state) {
            case 6:
                return apply("--- ", 2);
            case 5:
                return apply("--- ", 1);
        }
        let prefix = "", state = 0;
        if (unseenPosts) {
            state = 3;
            prefix = `(${unseenPosts}) `;
        }
        if (unseenReplies) {
            state = 4;
            prefix = ">> " + prefix;
        }
        apply(prefix, state);
    }
    let recalcPending = false;
    function recalc() {
        recalcPending = false;
        unseenPosts = 0;
        unseenReplies = false;
        for (let post of state_11.posts) {
            if (post.seen()) {
                continue;
            }
            unseenPosts++;
            if (post.isReply()) {
                unseenReplies = true;
            }
        }
        resolve();
    }
    function apply(prefix, state) {
        if (lastRendered.state === state
            && lastRendered.unseenPosts === unseenPosts) {
            return;
        }
        lastRendered.unseenPosts = unseenPosts;
        lastRendered.state = state;
        titleEl.innerHTML = prefix + title;
        let url;
        switch (state) {
            case 0:
                url = urlBase + "default.ico";
                break;
            case 1:
                url = discoFavicon;
                break;
            case 2:
                url = urlBase + "error.ico";
                break;
            case 4:
                url = urlBase + "reply.ico";
                break;
            case 3:
                url = urlBase + "unread.ico";
                break;
        }
        faviconEl.setAttribute("href", url);
    }
    function delayedDiscoRender() {
        setTimeout(() => {
            switch (connection_3.connSM.state) {
                case 5:
                case 6:
                    resolve();
            }
        }, 5000);
    }
    exports.default = () => {
        fetch(urlBase + "disconnected.ico")
            .then(res => res.blob())
            .then(blob => discoFavicon = URL.createObjectURL(blob));
        connection_3.connSM.on(3, resolve);
        for (let state of [5, 6]) {
            connection_3.connSM.on(state, delayedDiscoRender);
        }
        document.addEventListener("scroll", () => {
            if (recalcPending || document.hidden) {
                return;
            }
            recalcPending = true;
            setTimeout(recalc, 200);
        }, { passive: true });
    };
});
define("ui/notification", ["require", "exports", "state", "options/index", "lang", "posts/index", "ui/tab", "util/index", "base/index"], function (require, exports, state_12, options, lang_7, posts_3, tab_1, util, base_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function notifyAboutReply(post) {
        if (state_12.seenReplies.has(post.id) || state_12.hidden.has(post.id)) {
            return;
        }
        state_12.storeSeenReply(post.id, post.op);
        if (!document.hidden) {
            return;
        }
        tab_1.repliedToMe(post);
        if (!options.canNotify()) {
            return;
        }
        const opts = options.notificationOpts();
        if (options.canShowImages() && post.image) {
            const { sha1, thumb_type: thumbType, spoiler } = post.image;
            if (spoiler) {
                opts.icon = '/assets/spoil/default.jpg';
            }
            else {
                opts.icon = posts_3.thumbPath(sha1, thumbType);
            }
        }
        opts.body = post.body;
        opts.data = post.id;
        const n = new Notification(lang_7.default.ui["quoted"], opts);
        n.onclick = function () {
            this.close();
            window.focus();
            location.hash = "#p" + this.data;
            util.scrollToAnchor();
        };
    }
    exports.default = notifyAboutReply;
    class OverlayNotification extends base_5.View {
        constructor(text) {
            super({
                el: util.importTemplate("notification")
                    .firstChild,
            });
            this.on("click", () => this.remove());
            this.el.querySelector("b").textContent = text;
            const cont = document.getElementById("modal-overlay");
            let last;
            for (let i = cont.children.length - 1; i >= 0; i--) {
                const el = cont.children[i];
                if (el.classList.contains("notification")) {
                    last = el;
                    break;
                }
            }
            if (last) {
                last.after(this.el);
            }
            else {
                cont.prepend(this.el);
            }
        }
    }
    exports.OverlayNotification = OverlayNotification;
});
define("ui/captcha", ["require", "exports", "ui/forms", "util/index", "state"], function (require, exports, forms_1, util_16, state_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let instance;
    const overlay = document.getElementById("captcha-overlay");
    function renderCaptchaForm(onSuccess) {
        if (!instance) {
            instance = new CaptchaForm(onSuccess);
        }
        else {
            instance.onSuccess = onSuccess;
            instance.focus();
        }
    }
    exports.renderCaptchaForm = renderCaptchaForm;
    exports.captchaLoaded = () => !!instance;
    util_16.hook("renderCaptchaForm", renderCaptchaForm);
    class CaptchaForm extends forms_1.default {
        constructor(onSuccess) {
            super({
                tag: "div",
                class: "modal glass",
                id: "captcha-form",
            });
            instance = this;
            this.onSuccess = onSuccess;
            this.render();
        }
        remove() {
            instance = null;
            super.remove();
        }
        async render() {
            overlay.prepend(this.el);
            const res = await fetch(`/api/captcha/${state_13.page.board}?${this.query({}).toString()}`);
            if (res.status !== 200) {
                this.renderFormResponse(await res.text());
                return;
            }
            const s = await res.text();
            this.el.innerHTML = s;
            this.el.style.margin = "auto";
            this.focus();
        }
        focus() {
            const el = this.inputElement("captchouli-0");
            if (el) {
                el.focus();
            }
        }
        query(d) {
            d["captchouli-color"] = "inherit";
            d["captchouli-background"] = "inherit";
            return new URLSearchParams(d);
        }
        async send() {
            const body = {
                "captchouli-id": this.inputElement("captchouli-id").value,
            };
            for (let i = 0; i < 9; i++) {
                const k = `captchouli-${i}`;
                if (this.inputElement(k).checked) {
                    body[k] = "on";
                }
            }
            const res = await fetch(`/api/captcha/${state_13.page.board}`, {
                body: this.query(body),
                method: "POST"
            });
            const t = await res.text();
            switch (res.status) {
                case 200:
                    if (t !== "OK") {
                        this.el.innerHTML = t;
                        this.focus();
                    }
                    else {
                        this.remove();
                        this.onSuccess();
                    }
                    break;
                default:
                    this.renderFormResponse(t);
            }
        }
        renderFormResponse(text) {
            this.el.querySelector("form").innerHTML = text;
            this.el.classList.add("admin");
        }
    }
});
define("ui/keyboard", ["require", "exports", "options/index", "posts/index", "state", "util/index"], function (require, exports, options_3, posts_4, state_14, util_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = () => document.addEventListener("keydown", handleShortcut);
    function handleShortcut(event) {
        let caught = false;
        let anyModifier = event.altKey || event.metaKey || event.ctrlKey || event.shiftKey;
        let inInput = 'selectionStart' in event.target;
        let altGr = event.getModifierState && event.getModifierState("AltGraph");
        if (!anyModifier && !inInput) {
            caught = true;
            switch (event.key) {
                case "w":
                case "ArrowLeft":
                    navigatePost(true);
                    break;
                case "s":
                case "ArrowRight":
                    navigatePost(false);
                    break;
                default:
                    caught = false;
            }
        }
        if (event.altKey && !altGr) {
            caught = true;
            switch (event.which) {
                case options_3.default.newPost:
                    if (state_14.page.thread) {
                        posts_4.postSM.feed(4);
                    }
                    else {
                        posts_4.expandThreadForm();
                    }
                    break;
                case options_3.default.done:
                    posts_4.postSM.feed(3);
                    break;
                case options_3.default.toggleSpoiler:
                    const m = util_17.trigger("getPostModel");
                    if (m) {
                        m.view.toggleSpoiler();
                    }
                    break;
                case options_3.default.galleryMode:
                    options_3.default.galleryModeToggle = !options_3.default.galleryModeToggle;
                    break;
                case options_3.default.expandAll:
                    posts_4.toggleExpandAll();
                    break;
                case options_3.default.workMode:
                    options_3.default.workModeToggle = !options_3.default.workModeToggle;
                    break;
                case options_3.default.meguTVShortcut:
                    options_3.default.meguTV = !options_3.default.meguTV;
                    break;
                case 38:
                    navigateUp();
                    break;
                default:
                    caught = false;
            }
        }
        if (caught) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
    }
    function navigateUp() {
        let url;
        if (state_14.page.thread) {
            url = `/${state_14.page.board}/`;
        }
        else if (state_14.page.board !== "all") {
            url = "/all/";
        }
        if (url) {
            const a = document.createElement("a");
            a.href = url;
            location.href = url;
        }
    }
    const postSelector = "article[id^=p]";
    function navigatePost(reverse) {
        let all = Array.from(document.querySelectorAll(postSelector));
        let current = document.querySelector(postSelector + ":target") || all[0];
        let currentIdx = all.indexOf(current);
        while (current) {
            currentIdx = reverse ? currentIdx - 1 : currentIdx + 1;
            current = all[currentIdx];
            if (current && window.getComputedStyle(current).display != "none") {
                break;
            }
        }
        if (current) {
            window.location.hash = current.id;
        }
    }
});
define("ui/options", ["require", "exports", "base/index", "options/index", "util/index", "lang", "posts/index", "state"], function (require, exports, base_6, options_4, util_18, lang_8, posts_5, state_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OptionsPanel extends base_6.TabbedModal {
        constructor() {
            super(document.getElementById("options"));
            exports.panel = this;
            this.hidden = document.getElementById('hidden');
            this.import = this.el
                .querySelector("#importSettings");
            this.onClick({
                '#export': () => this.exportConfigs(),
                '#import': e => this.importConfigs(e),
                '#hidden': posts_5.clearHidden,
            });
            this.on('change', e => this.applyChange(e));
            this.renderHidden(state_15.hidden.size);
            this.assignValues();
            util_18.hook("renderOptionValue", ([id, type, val]) => this.assignValue(id, type, val));
            util_18.hook("renderHiddenCount", n => this.renderHidden(n));
        }
        assignValues() {
            for (let id in options_4.models) {
                const model = options_4.models[id], val = model.get();
                this.assignValue(id, model.spec.type, val);
            }
        }
        assignValue(id, type, val) {
            if (type == 6) {
                return;
            }
            const el = document.getElementById(id);
            switch (type) {
                case 0:
                    el.checked = val;
                    break;
                case 1:
                case 4:
                case 7:
                case 5:
                    el.value = val || "";
                    break;
                case 3:
                    el.value = String.fromCodePoint(val).toUpperCase();
                    break;
            }
        }
        applyChange(event) {
            const el = event.target, id = el.getAttribute('id'), model = options_4.models[id];
            if (!model) {
                return;
            }
            let val;
            switch (model.spec.type) {
                case 0:
                    val = el.checked;
                    break;
                case 1:
                case 7:
                    val = parseInt(el.value);
                    break;
                case 4:
                case 5:
                    val = el.value;
                    break;
                case 3:
                    val = el.value.toUpperCase().codePointAt(0);
                    break;
                case 2:
                    const file = el.files[0];
                    el.value = "";
                    switch (id) {
                        case "userBGImage":
                            options_4.storeBackground(file);
                            break;
                        case "mascotImage":
                            options_4.storeMascot(file);
                            break;
                    }
                    return;
            }
            options_4.default[id] = val;
        }
        exportConfigs() {
            const a = document.getElementById('export');
            const blob = new Blob([JSON.stringify(localStorage)], {
                type: 'octet/stream'
            });
            a.setAttribute('href', window.URL.createObjectURL(blob));
            a.setAttribute('download', 'meguca-config.json');
        }
        importConfigs(event) {
            this.import.click();
            const handler = () => this.importConfigFile();
            this.import.addEventListener("change", handler, { once: true });
        }
        async importConfigFile() {
            const reader = new FileReader();
            reader.readAsText(this.import.files[0]);
            const event = await util_18.load(reader);
            let json;
            try {
                json = JSON.parse(event.target.result);
            }
            catch (err) {
                alert(lang_8.default.ui["importCorrupt"]);
                return;
            }
            localStorage.clear();
            for (let key in json) {
                localStorage.setItem(key, json[key]);
            }
            alert(lang_8.default.ui["importDone"]);
            location.reload();
        }
        renderHidden(count) {
            const el = this.hidden;
            el.textContent = el.textContent.replace(/\d+$/, count.toString());
        }
    }
    exports.default = OptionsPanel;
});
define("ui/index", ["require", "exports", "ui/banner", "ui/forms", "ui/tab", "ui/notification", "ui/captcha", "ui/keyboard", "ui/tab", "ui/banner", "ui/options"], function (require, exports, banner_2, forms_2, tab_2, notification_1, captcha_1, keyboard_1, tab_3, banner_3, options_5) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(banner_2);
    exports.FormView = forms_2.default;
    exports.postAdded = tab_2.postAdded;
    exports.notifyAboutReply = notification_1.default;
    exports.OverlayNotification = notification_1.OverlayNotification;
    exports.renderCaptchaForm = captcha_1.renderCaptchaForm;
    exports.captchaLoaded = captcha_1.captchaLoaded;
    exports.default = () => {
        keyboard_1.default();
        tab_3.default();
        banner_3.default();
        new options_5.default();
    };
});
define("posts/hide", ["require", "exports", "state", "db", "util/index", "options/index"], function (require, exports, state_16, db_3, util_19, options_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function hidePost(model) {
        hideRecursively(model);
        state_16.storeHidden(model.id, model.op);
        util_19.trigger("renderHiddenCount", state_16.hidden.size);
    }
    exports.hidePost = hidePost;
    function clearHidden() {
        state_16.hidden.clear();
        util_19.trigger("renderHiddenCount", 0);
        db_3.clearStore("hidden");
        for (let p of state_16.posts) {
            p.unhide();
        }
    }
    exports.clearHidden = clearHidden;
    function hideRecursively(post) {
        if (post.hidden || state_16.mine.has(post.id)) {
            return;
        }
        post.hide();
        state_16.hidden.add(post.id);
        if (post.backlinks && options_6.default.hideRecursively) {
            for (let id in post.backlinks) {
                const p = state_16.posts.get(parseInt(id));
                if (p) {
                    hideRecursively(p);
                }
            }
        }
        if (post.id === post.op) {
            for (let p of state_16.posts) {
                if (p.op === post.id) {
                    hideRecursively(p);
                }
            }
        }
    }
    exports.hideRecursively = hideRecursively;
});
define("posts/model", ["require", "exports", "base/index", "util/index", "state", "ui/index", "posts/hide", "options/index"], function (require, exports, base_7, util_20, state_17, ui_1, hide_1, options_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Post extends base_7.Model {
        constructor(attrs) {
            super();
            util_20.extend(this, attrs);
            if (options_7.default.hideBinned && this.isDeleted()) {
                state_17.hidden.add(this.id);
                state_17.storeSeenPost(this.id, this.op);
                this.seenOnce = true;
            }
            else {
                this.seenOnce = state_17.seenPosts.has(this.id);
            }
            this.state = {
                spoiler: false,
                quote: false,
                code: false,
                bold: false,
                italic: false,
                red: false,
                blue: false,
                haveSyncwatch: false,
                successive_newlines: 0,
                iDice: 0,
            };
        }
        remove() {
            if (this.collection) {
                this.collection.remove(this);
            }
            if (this.view) {
                this.view.remove();
            }
        }
        hide() {
            this.hidden = true;
            this.view.hide();
        }
        unhide() {
            if (!this.hidden) {
                return;
            }
            this.hidden = false;
            this.view.unhide();
        }
        append(code) {
            const char = String.fromCodePoint(code);
            this.body += char;
            const needReparse = char === "\n"
                || !this.editing
                || this.state.code
                || endsWithTag(this.body);
            if (needReparse) {
                this.view.reparseBody();
            }
            else {
                this.view.appendString(char);
            }
        }
        backspace() {
            const needReparse = this.body[this.body.length - 1] === "\n"
                || !this.editing
                || this.state.code
                || endsWithTag(this.body);
            this.body = this.body.slice(0, -1);
            if (needReparse) {
                this.view.reparseBody();
            }
            else {
                this.view.backspace();
            }
        }
        splice(msg) {
            this.spliceText(msg);
            this.view.reparseBody();
        }
        spliceText({ start, len, text }) {
            const arr = [...this.body];
            arr.splice(start, len, ...text);
            this.body = arr.join("");
        }
        propagateLinks() {
            if (this.isReply()) {
                ui_1.notifyAboutReply(this);
            }
            if (this.links) {
                for (let { id } of this.links) {
                    const post = state_17.posts.get(id);
                    if (post) {
                        post.insertBacklink({
                            id: this.id,
                            op: this.op,
                            board: this.board,
                        });
                    }
                    if (options_7.default.hideRecursively && state_17.hidden.has(id)) {
                        hide_1.hideRecursively(this);
                    }
                }
            }
        }
        isReply() {
            if (!this.links) {
                return false;
            }
            for (let { id } of this.links) {
                if (state_17.mine.has(id)) {
                    return true;
                }
            }
            return false;
        }
        insertBacklink({ id, op, board }) {
            if (!this.backlinks) {
                this.backlinks = {};
            }
            this.backlinks[id] = { op, board };
            this.view.renderBacklinks();
        }
        insertImage(img) {
            this.image = img;
            this.view.renderImage(false);
            this.view.autoExpandImage();
        }
        spoilerImage() {
            this.image.spoiler = true;
            this.view.renderImage(false);
        }
        closePost() {
            this.editing = false;
            this.view.closePost();
        }
        applyModeration(entry) {
            if (!this.moderation) {
                this.moderation = [];
            }
            this.moderation.push(entry);
            const { type, data } = entry;
            switch (type) {
                case 2:
                    if (!state_17.mine.has(this.id)) {
                        this.view.el.classList.add("deleted");
                        if (options_7.default.hideBinned) {
                            hide_1.hideRecursively(this);
                        }
                    }
                    break;
                case 3:
                    if (this.image) {
                        this.image = null;
                        this.view.removeImage();
                    }
                    break;
                case 4:
                    if (this.image) {
                        this.image.spoiler = true;
                        this.view.renderImage(false);
                    }
                    break;
                case 5:
                    this.locked = data === 'true';
                    break;
                case 8:
                    if (this.image) {
                        this.image = null;
                        this.view.removeImage();
                    }
                    this.body = "";
                    this.view.reparseBody();
                    break;
            }
            this.view.renderModerationLog();
        }
        isDeleted() {
            if (!this.moderation || state_17.mine.has(this.id)) {
                return false;
            }
            for (let { type } of this.moderation) {
                if (type === 2) {
                    return true;
                }
            }
            return false;
        }
        removeImage() {
            this.image = null;
            this.view.removeImage();
        }
        seen() {
            if (this.hidden || this.seenOnce) {
                return true;
            }
            if (document.hidden) {
                return false;
            }
            if (this.seenOnce = this.view.scrolledPast()) {
                state_17.storeSeenPost(this.id, this.op);
            }
            return this.seenOnce;
        }
    }
    exports.Post = Post;
    function endsWithTag(body) {
        const sl = body[body.length - 2];
        switch (body[body.length - 1]) {
            case ">":
                return true;
            case "*":
                return sl === "*";
            case "`":
                return sl === "`";
            case "@":
                return sl === "@";
            case "~":
                return sl === "~";
            case "r":
                return sl === "^";
            case "b":
                return sl === "^";
        }
        return false;
    }
});
define("posts/posting/upload", ["require", "exports", "lang", "util/index", "base/index", "state", "posts/posting/index"], function (require, exports, lang_9, util_21, base_8, state_18, _7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const micSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
    <path d="M2.91-.03a1 1 0 0 0-.13.03 1 1 0 0 0-.78 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1.09-1.03zm-2.56 2.03a.5.5 0 0 0-.34.5v.5c0 1.48 1.09 2.69 2.5 2.94v1.06h-.5c-.55 0-1 .45-1 1h4.01c0-.55-.45-1-1-1h-.5v-1.06c1.41-.24 2.5-1.46 2.5-2.94v-.5a.5.5 0 1 0-1 0v.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2v-.5a.5.5 0 0 0-.59-.5.5.5 0 0 0-.06 0z"
transform="translate(1)" />
</svg>`;
    const stopSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
    <path d="M0 0v6h6v-6h-6z" transform="translate(1 1)" />
</svg>`;
    class UploadForm extends base_8.View {
        constructor(model, el) {
            super({ el, model });
            this.audioChunks = [];
            el.hidden = false;
            this.spoiler = el
                .querySelector(`span[data-id="spoiler"]`);
            this.hiddenInput = el
                .querySelector("input[name=image]");
            this.button = el.querySelector("button");
            this.button.addEventListener("click", () => {
                if (this.isUploading) {
                    this.reset();
                }
                else if (this.canAllocImage()) {
                    this.hiddenInput.click();
                }
            }, { passive: true });
            this.hiddenInput.addEventListener("change", () => {
                if (this.canAllocImage() && this.hiddenInput.files.length) {
                    util_21.trigger("getPostModel").
                        uploadFile(this.hiddenInput.files[0]);
                }
            }, { passive: true });
            if (navigator.mediaDevices
                && navigator.mediaDevices.getUserMedia) {
                this.micButton = document.createElement("a");
                this.micButton.classList.add("record-button", "svg-link");
                this.micButton.innerHTML = micSVG;
                el.children[0].after(this.micButton);
                this.micButton.addEventListener("click", () => {
                    if (!this.recorder) {
                        navigator
                            .mediaDevices
                            .getUserMedia({
                            audio: true,
                        })
                            .then(stream => {
                            this.recorder = new MediaRecorder(stream);
                            this.recorder.start();
                            this.micButton.innerHTML = stopSVG;
                            this.recorder.ondataavailable = ({ data }) => this.audioChunks.push(data);
                            this.recorder.onerror = ({ error }) => {
                                this.recorder = null;
                                console.error(error);
                                alert(error);
                                this.reset();
                            };
                            this.recorder.onpause = () => this.recorder.stop();
                            this.recorder.onstop = () => {
                                util_21.trigger("getPostModel").uploadFile(new File(this.audioChunks, "recording.ogg"));
                                this.micButton.hidden = true;
                                this.recorder = null;
                                this.audioChunks = [];
                            };
                        });
                    }
                    else {
                        this.recorder.stop();
                    }
                });
            }
        }
        canAllocImage() {
            switch (_7.postSM.state) {
                case 5:
                case 6:
                case 4:
                    return true;
                default:
                    return false;
            }
        }
        async uploadFile(file) {
            if (!navigator.onLine || this.isUploading) {
                return null;
            }
            if (file.size > (state_18.config.maxSize << 20)) {
                this.reset(lang_9.default.ui["fileTooLarge"]);
                return null;
            }
            this.bufferedFile = file;
            this.isUploading = true;
            this.renderProgress({ total: 1, loaded: 0 });
            let token;
            if (location.protocol === "https:"
                || location.hostname === "localhost") {
                const r = new FileReader();
                r.readAsArrayBuffer(file);
                const { target: { result } } = await util_21.load(r);
                const res = await fetch("/api/upload-hash", {
                    method: "POST",
                    body: bufferToHex(await crypto.subtle.digest("SHA-1", result)),
                });
                const text = await res.text();
                if (this.handleResponse(res.status, text)) {
                    token = text;
                }
                else {
                    return null;
                }
            }
            if (!token) {
                token = await this.upload(file);
                if (!token) {
                    this.isUploading = false;
                    return null;
                }
            }
            this.isUploading = false;
            return {
                token,
                name: file.name,
                spoiler: this.inputElement("spoiler").checked,
            };
        }
        handleResponse(code, text) {
            switch (code) {
                case 200:
                    return true;
                case 403:
                    if (this.isCaptchaRequest(text)) {
                        _7.postSM.feed(10);
                        this.reset();
                        return false;
                    }
                case 502:
                    if (this.canAllocImage()) {
                        util_21.trigger("getPostModel").retryUpload();
                        this.reset();
                        return false;
                    }
                default:
                    this.reset(text);
                    return false;
            }
        }
        displayStatus(status, title) {
            this.button.textContent = status;
            this.button.title = title || "";
        }
        isCaptchaRequest(s) {
            return s.indexOf("captcha required") !== -1;
        }
        async retry() {
            if (this.bufferedFile) {
                this.reset();
                return await this.uploadFile(this.bufferedFile);
            }
            return null;
        }
        async upload(file) {
            const formData = new FormData();
            formData.append("image", file);
            this.xhr = new XMLHttpRequest();
            this.xhr.open("POST", "/api/upload");
            this.xhr.upload.onprogress = e => this.renderProgress(e);
            this.xhr.onabort = () => this.reset();
            this.xhr.send(formData);
            await util_21.load(this.xhr);
            if (!this.isUploading) {
                return "";
            }
            this.isUploading = false;
            const text = this.xhr.responseText;
            if (this.handleResponse(this.xhr.status, text)) {
                this.xhr = null;
                this.button.hidden = true;
                return text;
            }
            return "";
        }
        cancel() {
            if (this.xhr) {
                this.xhr.abort();
                this.xhr = null;
            }
        }
        reset(status = lang_9.default.ui["uploadFile"]) {
            this.isUploading = false;
            this.cancel();
            this.displayStatus(status);
            this.spoiler.hidden = false;
            this.button.hidden = false;
            this.audioChunks = [];
            if (this.micButton) {
                this.micButton.hidden = false;
                this.micButton.innerHTML = micSVG;
            }
        }
        hideSpoilerToggle() {
            this.spoiler.hidden = true;
        }
        hideButton() {
            this.button.hidden = true;
            if (this.micButton) {
                this.micButton.hidden = true;
            }
        }
        renderProgress({ total, loaded }) {
            let s;
            if (loaded === total) {
                s = lang_9.default.ui["thumbnailing"];
            }
            else {
                const n = Math.floor(loaded / total * 100);
                s = `${n}% ${lang_9.default.ui["uploadProgress"]}`;
            }
            this.displayStatus(s, lang_9.default.ui["clickToCancel"]);
        }
    }
    exports.default = UploadForm;
    const precomputedHex = new Array(256);
    for (let i = 0; i < 256; i++) {
        precomputedHex[i] = (i < 16 ? '0' : '') + i.toString(16);
    }
    function bufferToHex(buf) {
        const b = new Uint8Array(buf), res = new Array(buf.byteLength);
        for (let i = 0; i < res.length; i++) {
            res[i] = precomputedHex[b[i]];
        }
        return res.join('');
    }
});
define("mod/common", ["require", "exports", "lang", "util/index"], function (require, exports, lang_10, util_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function loginID() {
        return util_22.getCookie("loginID");
    }
    exports.loginID = loginID;
    function sessionToken() {
        return util_22.getCookie("session");
    }
    exports.sessionToken = sessionToken;
    function validatePasswordMatch(parent, name1, name2) {
        const el1 = util_22.inputElement(parent, name1), el2 = util_22.inputElement(parent, name2);
        el1.onchange = el2.onchange = () => {
            const s = el2.value !== el1.value ? lang_10.default.ui["mustMatch"] : "";
            el2.setCustomValidity(s);
        };
    }
    exports.validatePasswordMatch = validatePasswordMatch;
});
define("mod/panel", ["require", "exports", "base/index", "util/index", "state"], function (require, exports, base_9, util_23, state_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let displayCheckboxes = localStorage.getItem("hideModCheckboxes") !== "true", checkboxStyler;
    class ModPanel extends base_9.View {
        constructor() {
            checkboxStyler = util_23.toggleHeadStyle("mod-checkboxes", ".mod-checkbox{ display: inline; }");
            super({ el: document.getElementById("moderation-panel") });
            new BanForm();
            new NotificationForm();
            new PostPurgeForm();
            this.el.querySelector("form").addEventListener("submit", e => this.onSubmit(e));
            this.el
                .querySelector("select[name=action]")
                .addEventListener("change", () => this.onSelectChange(), {
                passive: true
            });
            this.inputElement("clear")
                .addEventListener("click", () => {
                for (let el of this.getChecked()) {
                    el.checked = false;
                }
            }, { passive: true });
            const checkboxToggle = this.inputElement("showCheckboxes");
            checkboxToggle.checked = displayCheckboxes;
            checkboxToggle.addEventListener("change", e => this.setVisibility(event.target.checked), { passive: true });
            this.setVisibility(displayCheckboxes);
        }
        setVisibility(on) {
            localStorage.setItem("hideModCheckboxes", (!on).toString());
            this.setSlideOut(on);
            checkboxStyler(on);
        }
        async onSubmit(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const checked = this.getChecked(), models = [...checked].map(state_19.getModel);
            const sendIDRequests = async (formID, url) => {
                if (!checked.length) {
                    return;
                }
                const args = HidableForm.forms[formID].vals();
                for (let id of mapToIDs(models)) {
                    args["id"] = id;
                    await this.postJSON(url, args);
                }
            };
            const sendMultiIDRequest = async (path, withImages) => {
                if (checked.length) {
                    await this.postJSON("/api" + path, mapToIDs(withImages
                        ? models.filter(m => !!m.image)
                        : models));
                }
            };
            switch (this.getMode()) {
                case "deletePost":
                    await sendMultiIDRequest("/delete-posts", false);
                    break;
                case "spoilerImage":
                    await sendMultiIDRequest("/spoiler-image", true);
                    break;
                case "deleteImage":
                    await sendMultiIDRequest("/delete-image", true);
                    break;
                case "ban":
                    if (checked.length) {
                        const args = HidableForm.forms["ban"].vals();
                        args["ids"] = mapToIDs(models);
                        util_23.trigger("renderCaptchaForm", () => this.postJSON("/api/ban", args));
                    }
                    break;
                case "purgePost":
                    await sendIDRequests("purgePost", "/api/purge-post");
                    break;
                case "notification":
                    const f = HidableForm.forms["notification"];
                    await this.postJSON("/api/notification", f.vals());
                    f.clear();
                    break;
            }
            for (let el of checked) {
                el.checked = false;
            }
        }
        getChecked() {
            const query = document.querySelectorAll(".mod-checkbox:checked");
            var el = new Array(query.length);
            for (let i = 0; i < query.length; i++) {
                el[i] = query[i];
            }
            return el;
        }
        getMode() {
            return this.el
                .querySelector(`select[name="action"]`)
                .value;
        }
        async postJSON(url, data) {
            const res = await util_23.postJSON(url, data);
            this.el.querySelector(".form-response").textContent =
                res.status === 200
                    ? ""
                    : await res.text();
        }
        onSelectChange() {
            HidableForm.show(this.getMode());
        }
        setSlideOut(on) {
            this.el.classList.toggle("keep-visible", on);
        }
    }
    exports.default = ModPanel;
    class HidableForm extends base_9.View {
        constructor(id) {
            super({ el: document.getElementById(id + "-form") });
            HidableForm.forms[id] = this;
            this.toggleDisplay(false);
        }
        toggleDisplay(on) {
            for (let el of this.el.getElementsByTagName("input")) {
                el.disabled = !on;
            }
            this.el.classList.toggle("hidden", !on);
        }
        static hideAll() {
            for (let id in HidableForm.forms) {
                HidableForm.forms[id].toggleDisplay(false);
            }
        }
        static show(id) {
            HidableForm.hideAll();
            const f = HidableForm.forms[id];
            if (f) {
                f.toggleDisplay(true);
            }
        }
        clear() {
            for (let el of this.el.querySelectorAll("input[type=text]")) {
                el.value = "";
            }
        }
    }
    HidableForm.forms = {};
    class BanForm extends HidableForm {
        constructor() {
            super("ban");
        }
        vals() {
            const data = {
                duration: this.extractDuration(),
                reason: this.inputElement("reason").value,
            };
            const g = this.inputElement("global");
            if (g) {
                data["global"] = g.checked;
            }
            return data;
        }
    }
    class PostPurgeForm extends HidableForm {
        constructor() {
            super("purgePost");
        }
        vals() {
            return {
                reason: this.inputElement("purge-reason").value,
            };
        }
    }
    class NotificationForm extends HidableForm {
        constructor() {
            super("notification");
        }
        vals() {
            return this.inputElement("notification").value;
        }
    }
    function mapToIDs(models) {
        return models.map(m => m.id);
    }
});
define("mod/forms/common", ["require", "exports", "lang", "ui/index", "mod/index", "util/index"], function (require, exports, lang_11, ui_2, __1, util_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AccountForm extends ui_2.FormView {
        render() {
            __1.accountPanel.toggleMenu(false);
            __1.accountPanel.el.append(this.el);
        }
        async renderPublicForm(url) {
            const res = await fetch(url);
            const body = await res.text();
            switch (res.status) {
                case 200:
                    this.el.append(util_24.makeFrag(body));
                    this.render();
                    break;
                case 403:
                    this.handle403(body);
                    break;
                default:
                    throw body;
            }
        }
        remove() {
            super.remove();
            __1.accountPanel.toggleMenu(true);
        }
        async postResponse(url, fn) {
            const data = {};
            fn(data);
            await this.handlePostResponse(await util_24.postJSON(url, data));
        }
        async handlePostResponse(res) {
            const body = await res.text();
            switch (res.status) {
                case 200:
                    this.remove();
                    break;
                case 403:
                    this.handle403(body);
                    break;
                default:
                    this.renderFormResponse(body);
            }
        }
        extractForm(req) {
            const els = this.el
                .querySelectorAll("input[name], select[name], textarea[name]");
            for (let el of els) {
                let val;
                switch (el.type) {
                    case "submit":
                    case "button":
                        continue;
                    case "checkbox":
                        val = el.checked;
                        break;
                    case "number":
                        val = parseInt(el.value);
                        break;
                    default:
                        val = el.value;
                }
                req[el.name] = val;
            }
            for (let map of this.el.querySelectorAll(".map-form")) {
                const fields = map
                    .querySelectorAll(".map-field");
                if (!fields.length) {
                    continue;
                }
                const m = {};
                for (let i = 0; i < fields.length; i += 2) {
                    m[fields[i].value] = fields[i + 1].value;
                }
                req[map.getAttribute("name")] = m;
            }
            for (let ar of this.el.querySelectorAll(".array-form")) {
                const fields = [...ar.querySelectorAll(".array-field")];
                if (fields.length) {
                    req[ar.getAttribute("name")] = fields.map(f => f.value);
                }
            }
            return req;
        }
        handle403(body) {
            this.remove();
            if (body.includes("missing permissions")) {
                alert(lang_11.default.ui["sessionExpired"]);
                util_24.deleteCookie("loginID");
                util_24.deleteCookie("session");
                location.reload(true);
            }
        }
    }
    exports.AccountForm = AccountForm;
});
define("mod/forms/boards", ["require", "exports", "base/index", "util/index", "mod/forms/common", "mod/common"], function (require, exports, base_10, util_25, common_3, common_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OwnedBoardSelection extends base_10.View {
        constructor(parent) {
            super({ tag: "form" });
            this.parent = parent;
            this.on("submit", e => this.onSubmit(e));
            this.render();
        }
        async render() {
            const res = await fetch(`/html/owned-boards/${common_4.loginID()}`);
            const body = await res.text();
            switch (res.status) {
                case 200:
                    this.el.append(util_25.makeFrag(body));
                    this.parent.el.append(this.el);
                    break;
                case 403:
                    this.parent.handle403(body);
                    break;
                default:
                    throw body;
            }
        }
        onSubmit(e) {
            e.preventDefault();
            e.stopPropagation();
            const board = e.target
                .querySelector("select")
                .value;
            this.parent.renderNext(board);
            this.parent.board = board;
            this.remove();
        }
    }
    class SelectedBoardForm extends common_3.AccountForm {
        constructor(attrs) {
            attrs.needCaptcha = true;
            attrs.tag = "form";
            super(attrs);
            this.boardSelector = new OwnedBoardSelection(this);
            this.render();
        }
    }
    class BoardConfigForm extends SelectedBoardForm {
        constructor() {
            super({ class: "wide-fields" });
        }
        async renderNext(board) {
            const res = await util_25.postJSON(`/html/configure-board/${board}`, null);
            const body = await res.text();
            switch (res.status) {
                case 200:
                    const frag = util_25.makeFrag(body);
                    this.el.append(frag);
                    break;
                case 403:
                    this.handle403(body);
                    break;
                default:
                    throw body;
            }
        }
        send() {
            this.postResponse(`/api/configure-board/${this.board}`, req => this.extractForm(req));
        }
    }
    exports.BoardConfigForm = BoardConfigForm;
    class BoardDeletionForm extends SelectedBoardForm {
        constructor() {
            super({});
        }
        renderNext(board) {
            this.renderPublicForm("/api/captcha/confirmation");
        }
        send() {
            this.postResponse("/api/delete-board", req => req["board"] = this.board);
        }
    }
    exports.BoardDeletionForm = BoardDeletionForm;
    class StaffAssignmentForm extends SelectedBoardForm {
        constructor() {
            super({ class: "divide-rows" });
        }
        renderNext(board) {
            this.renderPublicForm(`/html/assign-staff/${board}`);
        }
        send() {
            this.postResponse("/api/assign-staff", req => {
                req["board"] = this.board;
                this.extractForm(req);
            });
        }
    }
    exports.StaffAssignmentForm = StaffAssignmentForm;
    class FormDataForm extends SelectedBoardForm {
        constructor(src, dest) {
            super({});
            this.srcURL = src;
            this.destURL = dest;
        }
        renderNext(board) {
            this.renderPublicForm(this.srcURL);
        }
        async send() {
            const data = new FormData(this.el);
            data.append("board", this.board);
            this.handlePostResponse(await fetch(this.destURL, {
                method: "POST",
                credentials: "include",
                body: data,
            }));
        }
    }
    exports.FormDataForm = FormDataForm;
    class BoardCreationForm extends common_3.AccountForm {
        constructor() {
            super({
                tag: "form",
                needCaptcha: true,
            });
            this.renderPublicForm("/html/create-board");
        }
        send() {
            this.postResponse("/api/create-board", req => {
                req["id"] = this.inputElement('boardName').value;
                req["title"] = this.inputElement('boardTitle').value;
            });
        }
    }
    exports.BoardCreationForm = BoardCreationForm;
});
define("mod/forms/password", ["require", "exports", "mod/forms/common", "mod/common"], function (require, exports, common_5, common_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PasswordChangeForm extends common_5.AccountForm {
        constructor() {
            super({
                tag: "form",
                needCaptcha: true,
            });
            this.renderPublicForm("/html/change-password").then(() => common_6.validatePasswordMatch(this.el, "newPassword", "repeat"));
        }
        send() {
            this.postResponse("/api/change-password", req => {
                req["old"] = this.inputElement("oldPassword").value;
                req["new"] = this.inputElement("newPassword").value;
            });
        }
    }
    exports.PasswordChangeForm = PasswordChangeForm;
});
define("mod/forms/server", ["require", "exports", "mod/forms/common", "util/index"], function (require, exports, common_7, util_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ServerConfigForm extends common_7.AccountForm {
        constructor() {
            super({
                tag: "form",
                class: "wide-fields",
            });
            this.render();
        }
        async render() {
            const res = await fetch("/html/configure-server", {
                method: "POST",
                credentials: "include",
            });
            const body = await res.text();
            switch (res.status) {
                case 200:
                    this.el.append(util_26.makeFrag(body));
                    super.render();
                    break;
                case 403:
                    this.handle403(body);
                    break;
                default:
                    throw body;
            }
        }
        send() {
            this.postResponse("/api/configure-server", req => this.extractForm(req));
        }
    }
    exports.ServerConfigForm = ServerConfigForm;
});
define("mod/forms/index", ["require", "exports", "mod/forms/boards", "mod/forms/password", "mod/forms/server"], function (require, exports, boards_1, password_1, server_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(boards_1);
    __export(password_1);
    __export(server_1);
});
define("mod/index", ["require", "exports", "util/index", "ui/index", "base/index", "mod/common", "mod/panel", "mod/forms/index", "mod/common"], function (require, exports, util_27, ui_3, base_11, common_8, panel_1, forms_3, common_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loginID = common_9.loginID;
    exports.sessionToken = common_9.sessionToken;
    exports.position = window.position;
    let registrationForm;
    class AccountPanel extends base_11.TabbedModal {
        constructor() {
            super(document.getElementById("account-panel"));
            this.onClick({
                '#logout': () => logout("/api/logout"),
                "#logoutAll": () => logout("/api/logout-all"),
                "#changePassword": this.loadConditional(() => new forms_3.PasswordChangeForm()),
                "#configureServer": this.loadConditional(() => new forms_3.ServerConfigForm()),
                "#createBoard": this.loadConditional(() => new forms_3.BoardCreationForm()),
                "#deleteBoard": this.loadConditional(() => new forms_3.BoardDeletionForm()),
                "#configureBoard": this.loadConditional(() => new forms_3.BoardConfigForm()),
                "#assignStaff": this.loadConditional(() => new forms_3.StaffAssignmentForm()),
                "#setBanners": this.loadConditional(() => new forms_3.FormDataForm("/html/set-banners", "/api/set-banners")),
                "#setLoading": this.loadConditional(() => new forms_3.FormDataForm("/html/set-loading", "/api/set-loading")),
            });
            if (exports.position > 0) {
                new panel_1.default();
            }
        }
        loadConditional(module) {
            return () => {
                this.toggleMenu(false);
                module();
            };
        }
        toggleMenu(show) {
            document.getElementById("form-selection")
                .style
                .display = show ? "block" : "none";
        }
    }
    async function logout(url) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
        });
        switch (res.status) {
            case 200:
            case 403:
                location.reload(true);
                break;
            default:
                alert(await res.text());
        }
    }
    class LoginForm extends ui_3.FormView {
        constructor(id, url) {
            super({
                el: document.getElementById(id),
                needCaptcha: true,
            });
            this.url = "/api/" + url;
        }
        async send() {
            const req = {};
            for (let key of ['id', 'password']) {
                req[key] = this.inputElement(key).value;
            }
            const res = await util_27.postJSON(this.url, req);
            switch (res.status) {
                case 200:
                    location.reload(true);
                default:
                    this.renderFormResponse(await res.text());
            }
        }
    }
    exports.default = () => {
        exports.accountPanel = new AccountPanel();
        if (exports.position === -1) {
            new LoginForm("login-form", "login");
            registrationForm = new LoginForm("registration-form", "register");
            common_8.validatePasswordMatch(registrationForm.el, "password", "repeat");
        }
    };
});
define("posts/posting/identity", ["require", "exports", "base/index", "util/index", "mod/index"], function (require, exports, base_12, util_28, mod_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const base64 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
    let identity = {
        auth: false,
        name: localStorage.getItem("name") || "",
        sage: localStorage.getItem("sage") === "true",
        postPassword: randomID(64),
    };
    exports.default = identity = util_28.emitChanges(identity);
    class IdentityPanel extends base_12.BannerModal {
        constructor() {
            super(document.getElementById("identity"));
            this.on("input", this.onInput.bind(this), {
                passive: true,
                selector: `input[type=text]`,
            });
            this.on("change", this.onCheckboxChange.bind(this), {
                passive: true,
                selector: `input[type=checkbox]`,
            });
            this.assignValues();
        }
        assignValues() {
            for (let el of this.el.querySelectorAll("input")) {
                const name = el.getAttribute("name");
                switch (el.getAttribute("type")) {
                    case "text":
                        el.value = identity[name];
                        break;
                    case "checkbox":
                        if (!el.disabled) {
                            el.checked = identity[name];
                        }
                        break;
                }
            }
        }
        onInput(event) {
            const el = event.target, name = el.getAttribute("name"), val = el.value;
            localStorage.setItem(name, val);
            identity[name] = val;
        }
        onCheckboxChange(e) {
            const el = e.target, name = el.getAttribute("name"), val = el.checked;
            if (name === "staffTitle") {
                identity["auth"] = val;
                return;
            }
            identity[name] = val;
            localStorage.setItem(name, val.toString());
        }
    }
    function newAllocRequest() {
        const req = { password: identity.postPassword };
        for (let key of ["name", "sage"]) {
            if (identity[key]) {
                req[key] = identity[key];
            }
        }
        if (identity.auth) {
            util_28.extend(req, {
                userID: mod_1.loginID(),
                session: mod_1.sessionToken(),
            });
        }
        return req;
    }
    exports.newAllocRequest = newAllocRequest;
    function randomID(len) {
        let id = '';
        const b = new Uint8Array(len);
        crypto.getRandomValues(b);
        for (let i = 0; i < len; i++) {
            id += base64[b[i] % 64];
        }
        return id;
    }
    function initIdentity() {
        new IdentityPanel();
    }
    exports.initIdentity = initIdentity;
});
define("posts/posting/view", ["require", "exports", "posts/view", "state", "util/index", "posts/posting/index", "posts/posting/upload", "posts/posting/identity", "lang"], function (require, exports, view_3, state_20, util_29, _8, upload_1, identity_1, lang_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let bottomSpacer;
    class FormView extends view_3.default {
        constructor(model) {
            super(model, null);
            this.renderInputs();
            this.initDraft();
        }
        renderInputs() {
            this.input = document.createElement("textarea");
            util_29.setAttrs(this.input, {
                id: "text-input",
                name: "body",
                rows: "1",
                maxlength: "2000",
            });
            this.el.append(util_29.importTemplate("post-controls"));
            this.resizeInput();
            this.input.addEventListener("input", e => {
                e.stopImmediatePropagation();
                this.onInput();
            });
            this.onClick({
                "input[name=\"done\"]": _8.postSM.feeder(3),
            });
            this.updateDoneButton();
            if (!state_20.boardConfig.textOnly) {
                this.upload = new upload_1.default(this.model, this.el.querySelector(".upload-container"));
            }
            const bq = this.el.querySelector("blockquote");
            bq.innerHTML = "";
            bq.append(this.input);
            requestAnimationFrame(() => this.input.focus());
        }
        renderIdentity() {
            let { name, auth } = identity_1.default, trip = "";
            const i = name.indexOf("#");
            if (i !== -1) {
                trip = "?";
                name = name.slice(0, i);
            }
            this.el.querySelector(".name").classList.remove("admin");
            this.model.name = name.trim();
            this.model.trip = trip;
            this.model.auth = auth ? -1 : 0;
            this.model.sage = identity_1.default.sage;
            this.renderName();
        }
        initDraft() {
            bottomSpacer = document.getElementById("bottom-spacer");
            this.el.classList.add("reply-form");
            this.el.querySelector("header").classList.add("temporary");
            this.renderIdentity();
            this.observer = new MutationObserver(() => this.resizeSpacer());
            this.observer.observe(this.el, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true,
            });
            document.getElementById("thread-container").append(this.el);
            this.resizeSpacer();
            this.setEditing(true);
        }
        resizeSpacer() {
            if (!bottomSpacer) {
                return;
            }
            const { height } = this.el.getBoundingClientRect();
            if (this.previousHeight === height) {
                return;
            }
            this.previousHeight = height;
            bottomSpacer.style.height = `calc(${height}px - 2.1em)`;
        }
        onInput() {
            if (!this.input) {
                return;
            }
            this.resizeInput();
            this.model.parseInput(this.input.value);
        }
        resizeInput() {
            const el = this.input, s = el.style;
            s.width = "0px";
            s.height = "0px";
            el.wrap = "off";
            s.width = Math.max(260, el.scrollWidth + 5) + "px";
            el.wrap = "soft";
            s.height = Math.max(16, el.scrollHeight) + "px";
        }
        trimInput(length) {
            this.input.value = this.input.value.slice(0, -length);
        }
        replaceText(body, pos, commit) {
            const el = this.input;
            el.value = body;
            if (commit) {
                this.onInput();
            }
            else {
                this.resizeInput();
            }
            requestAnimationFrame(() => {
                el.focus();
                el.setSelectionRange(pos, pos);
                requestAnimationFrame(() => el.focus());
            });
        }
        cleanUp() {
            if (this.upload) {
                this.upload.cancel();
            }
            this.el.classList.remove("reply-form");
            const pc = this.el.querySelector("#post-controls");
            if (pc) {
                pc.remove();
            }
            if (bottomSpacer) {
                bottomSpacer.style.height = "";
                if (util_29.atBottom) {
                    util_29.scrollToBottom();
                }
            }
            if (this.observer) {
                this.observer.disconnect();
            }
            bottomSpacer
                = this.observer
                    = this.upload
                        = null;
        }
        closePost() {
            let oldBody;
            if (this.model.inputBody) {
                oldBody = this.model.body;
                this.model.body = this.model.inputBody;
                this.model.inputBody = null;
            }
            super.closePost();
            if (oldBody) {
                this.model.body = oldBody;
            }
        }
        remove() {
            super.remove();
            this.cleanUp();
        }
        renderError() {
            this.el.classList.add("erred");
            this.input.setAttribute("contenteditable", "false");
        }
        renderAlloc() {
            this.id = this.el.id = "p" + this.model.id;
            this.el.querySelector("header").classList.remove("temporary");
            this.renderHeader();
        }
        toggleSpoiler() {
            if (this.model.image && _8.postSM.state === 4) {
                this.upload.hideSpoilerToggle();
                this.model.commitSpoiler();
            }
            else {
                const el = this.inputElement("spoiler");
                el.checked = !el.checked;
            }
        }
        insertImage() {
            this.renderImage(false);
            this.resizeInput();
            this.upload.hideButton();
            if (_8.postSM.state !== 4) {
                return;
            }
            if (this.model.image.spoiler) {
                this.upload.hideSpoilerToggle();
            }
            else {
                this.inputElement("spoiler").addEventListener("change", this.toggleSpoiler.bind(this), { passive: true });
            }
        }
        updateDoneButton() {
            const el = this.inputElement("done");
            if (!el) {
                return;
            }
            let text = lang_12.default.ui["done"];
            let disable = false;
            switch (_8.postSM.state) {
                case 2:
                    disable = true;
                    break;
                case 5:
                    text = lang_12.default.ui["cancel"];
                    break;
                case 4:
                    break;
                case 6:
                case 7:
                    disable = true;
                    break;
            }
            el.disabled = disable;
            el.value = text;
        }
    }
    exports.default = FormView;
});
define("posts/posting/model", ["require", "exports", "connection/index", "posts/model", "state", "posts/posting/index", "util/index", "posts/posting/identity"], function (require, exports, connection_4, model_1, state_21, _9, util_30, identity_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FormModel extends model_1.Post {
        constructor() {
            super({
                id: 0,
                op: state_21.page.thread,
                editing: true,
                sage: false,
                sticky: false,
                locked: false,
                time: Math.floor(Date.now() / 1000),
                body: "",
                name: "",
                auth: 0,
                trip: "",
                moderation: [],
                state: {
                    spoiler: false,
                    quote: false,
                    code: false,
                    bold: false,
                    italic: false,
                    red: false,
                    blue: false,
                    haveSyncwatch: false,
                    successive_newlines: 0,
                    iDice: 0,
                },
            });
            this.inputBody = "";
            this.allocatingImage = false;
        }
        append(code) {
            this.body += String.fromCodePoint(code);
        }
        backspace() {
            this.body = this.body.slice(0, -1);
        }
        splice(msg) {
            this.spliceText(msg);
        }
        parseInput(val) {
            switch (_9.postSM.state) {
                case 5:
                case 4:
                    break;
                default:
                    return;
            }
            const old = this.inputBody;
            val = this.trimInput(val, true);
            if (old === val) {
                return;
            }
            const lenDiff = val.length - old.length;
            if (_9.postSM.state === 5) {
                this.requestAlloc(val, null);
            }
            else if (lenDiff === 1 && val.slice(0, -1) === old) {
                const char = val.slice(-1);
                this.inputBody += char;
                this.send(2, char.codePointAt(0));
            }
            else if (lenDiff === -1 && old.slice(0, -1) === val) {
                this.inputBody = this.inputBody.slice(0, -1);
                this.send(3, null);
            }
            else {
                this.commitSplice(val);
            }
        }
        trimInput(val, write) {
            if (val.length > 2000) {
                const extra = val.length - 2000;
                val = val.slice(0, 2000);
                if (write) {
                    this.view.trimInput(extra);
                }
            }
            const lines = val.split("\n");
            if (lines.length - 1 > 100) {
                const trimmed = lines.slice(0, 100).join("\n");
                if (write) {
                    this.view.trimInput(val.length - trimmed.length);
                }
                return trimmed;
            }
            return val;
        }
        send(type, msg) {
            if (_9.postSM.state !== 2) {
                connection_4.send(type, msg);
            }
        }
        commitSplice(v) {
            const old = [...this.inputBody], val = [...v], start = diffIndex(old, val), till = diffIndex(old.slice(start).reverse(), val.slice(start).reverse());
            this.send(4, {
                start,
                len: old.length - till - start,
                text: val.slice(start, -till || undefined).join(""),
            });
            this.inputBody = v;
        }
        commitClose() {
            this.parseInput(this.view.input.value);
            this.abandon();
            this.send(5, null);
        }
        abandon() {
            this.view.cleanUp();
            this.closePost();
        }
        addReference(id, sel) {
            const pos = this.view.input.selectionEnd, old = this.view.input.value;
            let s = '', b = false;
            switch (old.charAt(pos - 1)) {
                case '':
                case '\n':
                    b = true;
                case ' ':
                    s = `>>${id}`;
                    break;
                default:
                    s = sel ? `\n>>${id}` : ` >>${id}`;
            }
            switch (old.charAt(pos)) {
                case '':
                case ' ':
                case '\n':
                    s += (b || sel) ? '\n' : '';
                    b = false;
                    break;
                default:
                    b = true;
                    s += sel ? '\n' : ' ';
            }
            if (sel) {
                for (let line of sel.split('\n')) {
                    s += `>${line}\n`;
                }
                s += b ? '\n' : '';
            }
            this.view.replaceText(old.slice(0, pos) + s + old.slice(pos), pos + s.length - (b ? 1 : 0), _9.postSM.state !== 5 || old.length !== 0);
        }
        paste(sel) {
            const start = this.view.input.selectionStart, end = this.view.input.selectionEnd, old = this.view.input.value;
            let p = util_30.modPaste(old, sel, end);
            if (!p) {
                return;
            }
            if (p.body.length > 2000) {
                p.body = this.trimInput(p.body, false);
                p.pos = 2000;
            }
            else if (start != end) {
                p.body = old.slice(0, start) + p.body + old.slice(end);
                p.pos -= (end - start);
            }
            else {
                p.body = old.slice(0, end) + p.body + old.slice(end);
            }
            this.view.replaceText(p.body, p.pos, _9.postSM.state !== 5 || old.length !== 0);
        }
        receiveID() {
            return (id) => {
                this.id = id;
                this.op = state_21.page.thread;
                this.seenOnce = true;
                _9.postSM.feed(7);
                state_21.storeSeenPost(this.id, this.op);
                state_21.storeMine(this.id, this.op);
                state_21.posts.add(this);
                delete connection_4.handlers[32];
            };
        }
        requestAlloc(body, image) {
            const req = identity_2.newAllocRequest();
            req["open"] = true;
            if (body) {
                req["body"] = this.inputBody = body;
            }
            if (image) {
                req["image"] = image;
            }
            connection_4.send(1, req);
            _9.postSM.feed(6);
            connection_4.handlers[32] = this.receiveID();
        }
        onAllocation(data) {
            util_30.extend(this, data);
            this.view.renderAlloc();
            if (this.image) {
                this.insertImage(this.image);
            }
            if (_9.postSM.state !== 4) {
                this.propagateLinks();
            }
        }
        async uploadFile(file) {
            if (!state_21.boardConfig.textOnly && !this.image) {
                const pr = this.view.upload.uploadFile(file);
                this.view.input.focus();
                this.handleUploadResponse(await pr);
            }
        }
        handleUploadResponse(data) {
            if (!data || this.image || this.allocatingImage) {
                return;
            }
            switch (_9.postSM.state) {
                case 5:
                    this.allocatingImage = true;
                    this.requestAlloc(this.trimInput(this.view.input.value, true), data);
                    break;
                case 6:
                    setTimeout(this.handleUploadResponse.bind(this, data), 200);
                    break;
                case 4:
                    this.allocatingImage = true;
                    connection_4.send(6, data);
                    break;
            }
        }
        async retryUpload() {
            if (this.view.upload) {
                this.allocatingImage = false;
                this.handleUploadResponse(await this.view.upload.retry());
            }
        }
        insertImage(img) {
            this.image = img;
            this.view.insertImage();
        }
        commitSpoiler() {
            this.send(7, null);
        }
    }
    exports.default = FormModel;
    function diffIndex(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return i;
            }
        }
        return a.length;
    }
});
define("posts/posting/threads", ["require", "exports", "util/index"], function (require, exports, util_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function expand(e) {
        const el = e.target.closest("aside");
        el.classList.add("expanded");
        const c = el.querySelector(".captcha-container");
        if (c) {
            const ns = c.querySelector("noscript");
            if (ns) {
                c.innerHTML = ns.innerHTML;
            }
        }
    }
    function expandThreadForm() {
        const tf = document.querySelector("aside:not(.expanded) .new-thread-button");
        if (tf) {
            tf.click();
            util_31.scrollToElement(tf);
        }
    }
    exports.expandThreadForm = expandThreadForm;
    exports.default = () => util_31.on(document.getElementById("threads"), "click", expand, {
        selector: ".new-thread-button",
        passive: true,
    });
});
define("posts/posting/drop", ["require", "exports", "posts/posting/index", "util/index", "state", "posts/posting/threads", "state"], function (require, exports, _10, util_32, state_22, threads_1, state_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    async function onDrop(e) {
        const { files } = e.dataTransfer;
        const url = e.dataTransfer.getData("text/uri-list");
        if ((!files.length && !url) || isFileInput(e.target)) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        if (state_22.boardConfig.textOnly) {
            return;
        }
        if (!state_22.page.thread) {
            if (!files.length) {
                return;
            }
            threads_1.expandThreadForm();
            document
                .querySelector("#new-thread-form input[type=file]")
                .files = files;
            return;
        }
        let file;
        if (files.length) {
            file = files[0];
        }
        else if (url) {
            try {
                let u = new URL(url);
                if (u.origin === location.origin) {
                    return;
                }
                const o = state_23.config.imageRootOverride;
                if (o && (new URL(o)).origin === u.origin) {
                    return;
                }
                const name = decodeURI(u.pathname.slice(u.pathname.lastIndexOf("/") + 1));
                file = new File([await (await fetch(url)).blob()], name);
            }
            catch (err) {
                alert(err);
                return;
            }
        }
        if (!file) {
            return;
        }
        _10.postSM.feed(4);
        const m = util_32.trigger("getPostModel");
        if (m) {
            await m.uploadFile(file);
        }
    }
    function isFileInput(target) {
        const el = target;
        return el.tagName === "INPUT" && el.getAttribute("type") === "file";
    }
    function stopDefault(e) {
        if (!isFileInput(e.target)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    exports.default = () => {
        for (let event of ["dragenter", "dragexit", "dragover"]) {
            document.addEventListener(event, stopDefault);
        }
        document.addEventListener("drop", onDrop);
    };
});
define("posts/posting/paste", ["require", "exports", "posts/posting/index", "util/index", "state", "posts/posting/threads"], function (require, exports, _11, util_33, state_24, threads_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function onPaste(e) {
        const text = e.clipboardData.getData("text"), files = e.clipboardData.files;
        var threadForm, m;
        if (files.length !== 1) {
            if (!text) {
                return;
            }
            const t = e.target;
            switch (t.tagName) {
                case "INPUT":
                    return;
                case "TEXTAREA":
                    if (t !== document.getElementById("text-input")) {
                        return;
                    }
                    break;
            }
        }
        e.stopPropagation();
        e.preventDefault();
        if (!state_24.page.thread) {
            threads_2.expandThreadForm();
            threadForm = document.querySelector("#new-thread-form");
        }
        else {
            _11.postSM.feed(4);
            m = util_33.trigger("getPostModel");
        }
        if (text) {
            if (threadForm) {
                const area = threadForm
                    .querySelector("textarea[name=body]");
                const start = area.selectionStart;
                const end = area.selectionEnd;
                const old = area.value;
                let p = util_33.modPaste(old, text, end);
                if (!p) {
                    return;
                }
                if (start != end) {
                    area.value = old.slice(0, start) + p.body + old.slice(end);
                    p.pos -= start;
                }
                else {
                    area.value = old.slice(0, end) + p.body + old.slice(end);
                }
                area.setSelectionRange(p.pos, p.pos);
                area.focus();
                return;
            }
            if (m) {
                m.paste(text);
            }
        }
        if (files.length === 1) {
            if (state_24.boardConfig.textOnly) {
                return;
            }
            if (threadForm) {
                threadForm.querySelector("input[type=file]").files = files;
                return;
            }
            if (m) {
                m.uploadFile(files.item(0));
            }
        }
    }
    exports.default = () => document.addEventListener("paste", onPaste);
});
define("posts/posting/image", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function onImageErr(e) {
        const el = e.target;
        if (el.tagName !== "IMG"
            || (el.complete && el.naturalWidth !== 0)
            || el.getAttribute("data-scheduled-retry")) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        el.setAttribute("data-scheduled-retry", "1");
        setTimeout(() => retry(el), 2000);
    }
    function retry(el) {
        if (!document.contains(el) || el.naturalWidth !== 0) {
            el.removeAttribute("data-scheduled-retry");
            return;
        }
        el.src = el.src;
        setTimeout(() => retry(el), 2000);
    }
    exports.default = () => {
        document.addEventListener("error", onImageErr, true);
    };
});
define("page/navigation", ["require", "exports", "base/index", "util/index"], function (require, exports, base_13, util_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const selected = new Set();
    let navigation, selectionPanel;
    class BoardNavigation extends base_13.View {
        constructor() {
            super({ el: document.getElementById("board-navigation") });
            this.render();
            this.onClick({
                ".board-selection": e => this.togglePanel(e.target),
            });
        }
        render() {
            let html = "[";
            const boards = Array.from(selected).sort((a, b) => {
                if (a == "all") {
                    return -1;
                }
                else if (b == "all") {
                    return 1;
                }
                return a > b ? 1 : -1;
            });
            const catalog = pointToCatalog() ? "catalog" : "";
            for (let i = 0; i < boards.length; i++) {
                if (i !== 0) {
                    html += " / ";
                }
                html += util_34.HTML `<a href="../${boards[i]}/${catalog}">
					${boards[i]}
				</a>`;
            }
            html += util_34.HTML `] [
			<a class="board-selection bold mono">
				+
			</a>
			]
			</nav>`;
            this.el.innerHTML = html;
            document.getElementById("banner").prepend(this.el);
        }
        togglePanel(el) {
            if (selectionPanel) {
                selectionPanel.remove();
                selectionPanel = null;
            }
            else {
                selectionPanel = new BoardSelectionPanel(el);
            }
        }
    }
    class BoardSelectionPanel extends base_13.View {
        constructor(parentEl) {
            super({ class: "board-selection-panel glass modal" });
            this.el.setAttribute("style", "margin-left: .5em; display: block");
            this.parentEl = parentEl;
            this.render();
            this.onClick({
                "input[name=cancel]": () => this.remove(),
            });
            this.on("submit", e => this.submit(e));
            this.on("input", e => this.search(e), {
                selector: 'input[name=search]',
                passive: true,
            });
            this.on("change", e => {
                const on = e.target.checked;
                this.applyCatalogLinking(on);
            }, {
                passive: true,
                selector: "input[name=pointToCatalog]",
            });
        }
        async render() {
            const r = await fetch("/html/board-navigation"), text = await r.text();
            if (r.status !== 200) {
                throw text;
            }
            const frag = util_34.makeFrag(text);
            const boards = Array
                .from(frag.querySelectorAll(".board input"))
                .map(b => b.getAttribute("name"));
            for (let s of selected) {
                if (boards.includes(s)) {
                    util_34.inputElement(frag, s).checked = true;
                    continue;
                }
                selected.delete(s);
                persistSelected();
                navigation.render();
            }
            this.el.innerHTML = "";
            this.el.append(frag);
            if (pointToCatalog()) {
                this.inputElement("pointToCatalog").checked = true;
                this.applyCatalogLinking(true);
            }
            this.parentEl.textContent = "-";
            for (let el of document.querySelectorAll(".board-selection-panel")) {
                el.remove();
            }
            document.getElementById("modal-overlay").prepend(this.el);
        }
        remove() {
            this.parentEl.textContent = "+";
            selectionPanel = null;
            super.remove();
        }
        submit(event) {
            event.preventDefault();
            selected.clear();
            for (let el of this.el.querySelectorAll(".board input")) {
                if (el.checked) {
                    selected.add(el.getAttribute("name"));
                }
            }
            persistSelected();
            navigation.render();
            this.remove();
        }
        search(event) {
            const term = event.target.value.trim(), regexp = new RegExp(term, 'i');
            for (let el of this.el.querySelectorAll(".board-list label")) {
                let display;
                if (regexp.test(el.querySelector("a").textContent)) {
                    display = "block";
                }
                else {
                    display = "none";
                }
                el.style.display = display;
            }
        }
        applyCatalogLinking(on) {
            for (let input of this.el.querySelectorAll(".board input")) {
                let url = `/${input.getAttribute("name")}/`;
                if (on) {
                    url += "catalog";
                }
                input.nextElementSibling.href = url;
            }
            localStorage.setItem("pointToCatalog", on.toString());
        }
    }
    function persistSelected() {
        localStorage.setItem("selectedBoards", [...selected].join());
    }
    function pointToCatalog() {
        return localStorage.getItem("pointToCatalog") === "true";
    }
    exports.default = () => {
        const sel = localStorage.getItem("selectedBoards");
        if (sel) {
            let arr;
            if (sel.startsWith("[")) {
                arr = JSON.parse(sel);
            }
            else {
                arr = sel.split(',');
            }
            for (let b of arr) {
                selected.add(b);
            }
        }
        if (!selected.size) {
            selected.add("all");
        }
        navigation = new BoardNavigation();
    };
});
define("page/common", ["require", "exports", "state", "options/index", "common/index", "posts/index", "lang", "ui/index", "util/index"], function (require, exports, state_25, options_8, common_10, posts_6, lang_13, ui_4, util_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function extractConfigs() {
        state_25.setBoardConfig(util_35.extractJSON("board-configs"));
    }
    exports.extractConfigs = extractConfigs;
    function extractPageData() {
        return {
            threads: util_35.extractJSON("post-data"),
            backlinks: util_35.extractJSON("backlink-data"),
        };
    }
    exports.extractPageData = extractPageData;
    function extractPost(post, op, board, backlinks) {
        const el = document.getElementById(`p${post.id}`);
        post.op = op;
        post.board = board;
        const model = new posts_6.Post(post), view = new posts_6.PostView(model, el);
        state_25.posts.add(model);
        if (state_25.page.catalog) {
            return false;
        }
        model.backlinks = backlinks[post.id];
        view.renderTime();
        view.renderName();
        localizeLinks(model);
        localizeBacklinks(model);
        ui_4.postAdded(model);
        const { image } = model;
        if (image) {
            if (options_8.default.hideThumbs
                || options_8.default.workModeToggle
                || (image.spoiler && !options_8.default.spoilers)
                || (image.file_type === common_10.fileTypes.gif && options_8.default.autogif)) {
                view.renderImage(false);
            }
        }
    }
    exports.extractPost = extractPost;
    function localizeLinks(post) {
        if (!post.links) {
            return;
        }
        let el, isReply = false;
        for (let id of new Set(post.links.map(l => l.id))) {
            if (!state_25.mine.has(id)) {
                continue;
            }
            isReply = true;
            if (!el) {
                el = post.view.el.querySelector("blockquote");
            }
            addYous(id, el);
        }
        if (isReply) {
            ui_4.notifyAboutReply(post);
        }
    }
    function addYous(id, el) {
        for (let a of el.querySelectorAll(`a[data-id="${id}"]`)) {
            a.textContent += " " + lang_13.default.posts["you"];
        }
    }
    function localizeBacklinks(post) {
        if (!post.backlinks) {
            return;
        }
        let el;
        for (let idStr in post.backlinks) {
            const id = parseInt(idStr);
            if (!state_25.mine.has(id)) {
                continue;
            }
            if (!el) {
                el = post.view.el.querySelector(".backlinks");
            }
            addYous(id, el);
        }
    }
    function hidePosts() {
        for (let post of state_25.posts) {
            if (state_25.hidden.has(post.id)) {
                posts_6.hideRecursively(post);
            }
        }
    }
    exports.hidePosts = hidePosts;
    function reparseOpenPosts() {
        for (let m of state_25.posts) {
            if (m.editing) {
                m.view.reparseBody();
            }
        }
    }
    exports.reparseOpenPosts = reparseOpenPosts;
});
define("page/thread", ["require", "exports", "page/common", "posts/index", "state", "posts/index"], function (require, exports, common_11, posts_7, state_26, posts_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const counters = document.getElementById("thread-post-counters");
    const threads = document.getElementById("threads");
    const bumpLimit = 1000;
    let image_count = 0, bump_time = 0, isDeleted = false;
    exports.post_count = 0;
    exports.subject = "";
    function default_3() {
        common_11.extractConfigs();
        const { threads: data, backlinks } = common_11.extractPageData(), { posts } = data;
        data.posts = null;
        exports.post_count = data.post_count;
        exports.subject = data.subject;
        image_count = data.image_count;
        bump_time = data.bump_time;
        if (data.moderation) {
            for (let { type } of data.moderation) {
                if (type === 0) {
                    isDeleted = true;
                    break;
                }
            }
        }
        renderPostCounter();
        common_11.extractPost(data, data.id, data.board, backlinks);
        for (let post of posts) {
            common_11.extractPost(post, data.id, data.board, backlinks);
        }
        common_11.hidePosts();
        common_11.reparseOpenPosts();
        posts_7.findSyncwatches(threads);
        if (data.locked) {
            posts_8.postSM.state = 8;
        }
    }
    exports.default = default_3;
    function incrementPostCount(post, hasImage) {
        if (post) {
            exports.post_count++;
            if (exports.post_count < bumpLimit) {
                bump_time = Math.floor(Date.now() / 1000);
            }
        }
        if (hasImage) {
            image_count++;
        }
        renderPostCounter();
    }
    exports.incrementPostCount = incrementPostCount;
    function renderPostCounter() {
        let text = "";
        if (exports.post_count) {
            text = `${exports.post_count} / ${image_count}`;
            if (state_26.config.pruneThreads) {
                const min = state_26.config.threadExpiryMin, max = state_26.config.threadExpiryMax;
                let days = min + (-max + min) * (exports.post_count / bumpLimit - 1) ** 3;
                if (isDeleted) {
                    days /= 3;
                }
                if (days < min) {
                    days = min;
                }
                days -= (Date.now() / 1000 - bump_time) / (3600 * 24);
                text += ` / `;
                if (days > 1) {
                    text += `${Math.round(days)}d`;
                }
                else {
                    text += `${Math.round(days * 24)}h`;
                }
            }
        }
        counters.textContent = text;
    }
});
define("page/board", ["require", "exports", "util/index", "lang", "state", "options/index", "posts/index", "page/common"], function (require, exports, util_36, lang_14, state_27, options_9, posts_9, common_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sorts = {
        bump: subtract("bump_time"),
        lastReply: subtract("update_time"),
        creation: subtract("time"),
        replyCount: subtract("post_count"),
        fileCount: subtract("image_count"),
    };
    const threadsEl = document.getElementById("threads");
    exports.threads = {};
    let lastFetchTime = Date.now() / 1000;
    function subtract(attr) {
        return (a, b) => b[attr] - a[attr];
    }
    function renderFresh(html) {
        lastFetchTime = Math.floor(Date.now() / 1000);
        threadsEl.innerHTML = html;
        if (isBanned()) {
            return;
        }
        common_12.extractConfigs();
        render();
    }
    exports.renderFresh = renderFresh;
    function isBanned() {
        return !!document.querySelector(".ban-page");
    }
    async function extractCatalogModels() {
        await state_27.loadFromDB();
        const data = common_12.extractPageData();
        for (let t of data.threads.threads) {
            exports.threads[t.id] = t;
            common_12.extractPost(t, t.id, t.board, data.backlinks);
        }
    }
    async function extractThreads() {
        const data = common_12.extractPageData();
        await state_27.loadFromDB(...(data.threads.threads).map(t => t.id));
        for (let thread of data.threads.threads) {
            const { posts } = thread;
            delete thread.posts;
            exports.threads[thread.id] = thread;
            if (common_12.extractPost(thread, thread.id, thread.board, data.backlinks)) {
                document.querySelector(`section[data-id="${thread.id}"]`).remove();
                continue;
            }
            for (let post of posts) {
                common_12.extractPost(post, thread.id, thread.board, data.backlinks);
            }
        }
        common_12.hidePosts();
        common_12.reparseOpenPosts();
    }
    async function render() {
        if (state_27.page.catalog) {
            await extractCatalogModels();
        }
        else {
            await extractThreads();
        }
        renderRefreshButton(threadsEl.querySelector("#refresh > a"));
        if (!state_27.page.catalog) {
            posts_9.findSyncwatches(threadsEl);
        }
        else {
            threadsEl.querySelector("select[name=sortMode]")
                .value = localStorage.getItem("catalogSort") || "bump";
            sortThreads(true);
        }
        state_27.displayLoading(false);
    }
    exports.render = render;
    function sortThreads(initial) {
        if (!state_27.page.catalog) {
            return;
        }
        const [cont, threads] = getThreads();
        if (state_27.page.catalog && (options_9.default.hideThumbs || options_9.default.workModeToggle)) {
            for (let el of cont.querySelectorAll("img.catalog")) {
                el.style.display = "none";
            }
        }
        const sortMode = localStorage.getItem("catalogSort") || "bump";
        if (initial && sortMode === "bump") {
            return;
        }
        const els = {};
        cont.append(...threads
            .map(el => {
            const id = el.getAttribute("data-id");
            els[id] = el;
            el.remove();
            return state_27.posts.get(parseInt(id));
        })
            .sort(sorts[sortMode])
            .map(({ id }) => els[id]));
    }
    exports.sortThreads = sortThreads;
    function getThreads() {
        let contID, threadTag;
        if (state_27.page.catalog) {
            contID = "catalog";
            threadTag = "article";
        }
        else {
            contID = "index-thread-container";
            threadTag = "section";
        }
        const cont = document.getElementById(contID);
        return [
            cont,
            Array.from(cont.querySelectorAll(threadTag)),
        ];
    }
    function renderRefreshButton(el) {
        let text = posts_9.relativeTime(lastFetchTime);
        if (text === lang_14.default.posts["justNow"]) {
            text = lang_14.default.ui["refresh"];
        }
        el.textContent = text;
    }
    function onSortChange(e) {
        localStorage.setItem("catalogSort", e.target.value);
        sortThreads(false);
    }
    function onSearchChange(e) {
        const filter = e.target.value;
        filterThreads(filter);
    }
    function filterThreads(filter) {
        const [, threads] = getThreads(), r = new RegExp(filter, "i"), matched = new Set();
        for (let m of state_27.posts) {
            const match = (m.board && r.test(`/${m.board}/`))
                || r.test(m.subject)
                || r.test(m.body);
            if (match) {
                matched.add(m.op);
            }
        }
        for (let el of threads) {
            const id = parseInt(el.getAttribute("data-id"));
            el.style.display = matched.has(id) ? "" : "none";
        }
    }
    async function refreshBoard() {
        const res = await util_36.fetchBoard(state_27.page.board, state_27.page.page, state_27.page.catalog), t = await res.text();
        switch (res.status) {
            case 200:
            case 403:
                state_27.posts.clear();
                renderFresh(t);
                break;
            default:
                throw t;
        }
    }
    setInterval(() => {
        if (state_27.page.thread || isBanned()) {
            return;
        }
        if (document.hidden) {
            refreshBoard();
        }
        else {
            renderRefreshButton(threadsEl.querySelector("#refresh > a"));
        }
    }, 600000);
    util_36.on(threadsEl, "input", onSortChange, {
        passive: true,
        selector: "select[name=sortMode]",
    });
    util_36.on(threadsEl, "input", onSearchChange, {
        passive: true,
        selector: "input[name=search]",
    });
    util_36.on(threadsEl, "click", refreshBoard, {
        passive: true,
        selector: "#refresh > a",
    });
});
define("page/thread_watcher", ["require", "exports", "db", "state", "lang", "page/thread", "options/index", "posts/index", "util/index", "page/board"], function (require, exports, db, state, lang_15, thread, options, posts, util, board) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    async function putExpiring(store, thread, data) {
        data["id"] = thread;
        data["expires"] = Date.now() + 90 * 24 * 60 * 60 * 1000;
        await db.putObj(store, data).catch(console.error);
    }
    async function getWatchedThreads() {
        const watched = {};
        await db.forEach("watchedThreads", rec => watched[rec.id] = rec);
        return watched;
    }
    exports.getWatchedThreads = getWatchedThreads;
    async function getOpenedThreads() {
        const opened = new Set();
        await db.forEach("openThreads", ({ id, time }) => {
            if (time >= Date.now() - 3 * 1000) {
                opened.add(id);
            }
        });
        return opened;
    }
    async function fetchWatchedThreads() {
        const last = localStorage.getItem("last_watched_fetched");
        if (last && parseInt(last) > Date.now() - 60 * 1000) {
            return;
        }
        const watched = await getWatchedThreads();
        if (!Object.keys(watched).length) {
            return;
        }
        localStorage.setItem("last_watched_fetched", Date.now().toString());
        const body = {};
        for (let id in watched) {
            body[id] = watched[id].postCount;
        }
        const res = await fetch("/json/thread-updates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (res.status != 200) {
            throw Error("watched threads: " + await res.text());
        }
        const diff = await res.json();
        const proms = [];
        const toNotify = [];
        const opened = await getOpenedThreads();
        if (state.page.thread) {
            opened.add(state.page.thread);
        }
        for (let k in diff.changed) {
            const id = parseInt(k);
            proms.push(watchThread(id, diff.changed[id], watched[id].subject));
            if (!opened.has(id)) {
                toNotify.push(parseInt(k));
            }
        }
        for (let id of diff.deleted) {
            proms.push(unwatchThread(id));
        }
        if (options.canNotify()) {
            for (let thread of toNotify) {
                const data = watched[thread];
                const id = data.id;
                const opts = options.notificationOpts();
                const delta = diff.changed[id] - data.postCount;
                opts.body = `「${data.subject}」`;
                opts.data = { id, delta };
                opts.tag = `watched_thread:${id}`;
                opts.renotify = true;
                if (options.canShowImages() && data.thumbnailURL) {
                    opts.icon = data.thumbnailURL;
                }
                const n = new Notification(lang_15.default.format["newPostsInThread"]
                    .replace("%d", delta.toString()), opts);
                n.onclick = function () {
                    const { id, delta } = this.data;
                    let u = `/all/${id}`;
                    if (delta <= 100) {
                        u += "?last=100";
                    }
                    window.open(u);
                };
            }
        }
        return await Promise.all(proms);
    }
    function markThreadOpened() {
        if (!state.page.thread) {
            return;
        }
        putExpiring("openThreads", state.page.thread, {
            time: Date.now(),
        });
    }
    function init() {
        setInterval(markThreadOpened, 1000);
        markThreadOpened();
        setInterval(fetchWatchedThreads, 60 * 1000);
        fetchWatchedThreads();
        localizeThreadWatchToggles();
        util.on(document, "click", (e) => {
            if (e.which != 1) {
                return;
            }
            const el = e.target.closest(".watcher-toggle");
            const id = parseInt(el.getAttribute("data-id"));
            let p;
            if (el.classList.contains("enabled")) {
                augmentToggle(el, false);
                p = unwatchThread(id);
            }
            else {
                if (state.page.thread) {
                    p = watchCurrentThread();
                }
                else {
                    const { subject, post_count } = board.threads[id];
                    p = watchThread(id, post_count, subject);
                }
                augmentToggle(el, true);
            }
            p.catch(console.error);
        }, {
            selector: ".watcher-toggle, .watcher-toggle svg, .watcher-toggle path",
            passive: true,
        });
    }
    exports.init = init;
    async function watchThread(id, postCount, subject) {
        if (!options.canNotify()) {
            return;
        }
        const data = { id, postCount, subject };
        const p = state.posts.get(id);
        if (p && p.image) {
            data.thumbnailURL = posts.thumbPath(p.image.sha1, p.image.thumb_type);
        }
        await putExpiring("watchedThreads", id, data);
    }
    exports.watchThread = watchThread;
    async function watchCurrentThread() {
        if (state.page.thread) {
            await watchThread(state.page.thread, thread.post_count, thread.subject);
            augmentToggle(document.querySelector(".watcher-toggle"), true);
        }
    }
    exports.watchCurrentThread = watchCurrentThread;
    async function unwatchThread(id) {
        await db.deleteObj("watchedThreads", id);
    }
    exports.unwatchThread = unwatchThread;
    async function localizeThreadWatchToggles() {
        const watched = new Set(Object.keys(await getWatchedThreads()));
        for (let el of document.querySelectorAll(".watcher-toggle")) {
            if (watched.has(el.getAttribute("data-id"))) {
                augmentToggle(el, true);
            }
        }
    }
    function augmentToggle(el, enabled) {
        el.classList.toggle("enabled", enabled);
        el.setAttribute("title", lang_15.default.ui[enabled ? "unwatchThread" : "watchThread"]);
    }
});
define("page/index", ["require", "exports", "page/navigation", "page/thread_watcher", "page/common", "page/thread", "page/board", "page/thread_watcher"], function (require, exports, navigation_1, watcher, common_13, thread_1, board_1, thread_watcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractConfigs = common_13.extractConfigs;
    exports.incrementPostCount = thread_1.incrementPostCount;
    exports.renderThread = thread_1.default;
    exports.renderBoard = board_1.render;
    exports.watchCurrentThread = thread_watcher_1.watchCurrentThread;
    function init() {
        navigation_1.default();
        watcher.init();
    }
    exports.init = init;
});
define("posts/posting/index", ["require", "exports", "posts/posting/model", "posts/posting/view", "connection/index", "util/index", "lang", "posts/posting/identity", "state", "posts/posting/drop", "posts/posting/paste", "posts/posting/image", "posts/posting/threads", "ui/captcha", "page/index", "options/index", "posts/posting/model", "posts/posting/identity", "posts/posting/threads"], function (require, exports, model_2, view_4, connection_5, util_37, lang_16, identity_3, state, drop_1, paste_1, image_1, threads_3, captcha_2, page, options_10, model_3, identity_4, threads_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormModel = model_3.default;
    exports.identity = identity_4.default;
    exports.expandThreadForm = threads_4.expandThreadForm;
    let postForm, postModel, lastSelection;
    exports.postSM = new util_37.FSM(0);
    util_37.hook("getPostModel", () => postModel);
    function stylePostControls(fn) {
        const el = document.querySelector("aside.posting");
        if (el) {
            fn(el);
        }
    }
    function bindNagging() {
        window.onbeforeunload = (event) => event.returnValue = lang_16.default.ui["unfinishedPost"];
    }
    function quotePost(e) {
        const bypass = e.which !== 1
            || e.ctrlKey
            || (state.page.thread && connection_5.connSM.state !== 3);
        if (bypass) {
            return;
        }
        const target = e.target;
        const post = target.closest("article");
        const isInside = (prop) => {
            const node = lastSelection[prop];
            if (!node) {
                return false;
            }
            const el = node.nodeType === Node.TEXT_NODE
                ? node.parentElement
                : node;
            if (!el) {
                return false;
            }
            if (el.closest("blockquote") && el.closest("article") === post) {
                return true;
            }
            switch (prop) {
                case "start":
                    return el === post;
                case "end":
                    if (el.closest("article") === post.nextSibling) {
                        return true;
                    }
                    if (el.tagName === "SECTION") {
                        const i = lastSelection.text.lastIndexOf("\n");
                        if (i >= 0) {
                            lastSelection.text = lastSelection.text.slice(0, i);
                        }
                        return true;
                    }
                    return false;
            }
        };
        let sel = "";
        if (lastSelection && isInside("start") && isInside("end")) {
            sel = lastSelection.text;
        }
        const id = parseInt(post.id.slice(1));
        if (!state.page.thread) {
            location.href = target.href;
            localStorage.setItem("openQuote", `${id}:${sel}`);
            return;
        }
        exports.postSM.feed(4);
        postModel.addReference(id, sel);
    }
    function updateIdentity() {
        if (exports.postSM.state === 5 && !state.boardConfig.forcedAnon) {
            postForm.renderIdentity();
        }
    }
    async function openReply(e) {
        if (e.which !== 1
            || !state.page.thread
            || e.ctrlKey
            || connection_5.connSM.state !== 3) {
            return;
        }
        e.preventDefault();
        exports.postSM.feed(4);
    }
    exports.default = () => {
        connection_5.connSM.on(3, exports.postSM.feeder(0));
        connection_5.connSM.on(5, exports.postSM.feeder(1));
        connection_5.connSM.on(6, exports.postSM.feeder(2));
        connection_5.handlers[39] = exports.postSM.feeder(10);
        exports.postSM.act(0, 0, () => 1);
        exports.postSM.on(1, () => {
            if (postModel) {
                postModel.abandon();
            }
            window.onbeforeunload = postModel = null;
            stylePostControls(el => {
                el.style.display = "";
                el.classList.remove("disabled");
            });
        });
        exports.postSM.onChange(() => {
            if (postForm) {
                postForm.updateDoneButton();
            }
        });
        exports.postSM.wildAct(1, () => {
            switch (exports.postSM.state) {
                case 4:
                case 2:
                    return 2;
                case 5:
                    postForm.remove();
                    postModel = postForm = null;
                    stylePostControls(el => el.style.display = "");
                    break;
                case 3:
                    return 3;
            }
            stylePostControls(el => el.classList.add("disabled"));
            return 3;
        });
        exports.postSM.act(2, 8, () => 4);
        exports.postSM.act(2, 9, () => 1);
        exports.postSM.act(3, 0, () => 1);
        exports.postSM.wildAct(2, () => {
            stylePostControls(el => el.classList.add("erred"));
            postForm && postForm.renderError();
            window.onbeforeunload = null;
            return 7;
        });
        exports.postSM.wildAct(5, () => 1);
        exports.postSM.act(6, 7, () => 4);
        exports.postSM.on(4, bindNagging);
        exports.postSM.on(4, () => {
            if (options_10.default.watchThreadsOnReply) {
                page.watchCurrentThread();
            }
        });
        exports.postSM.act(1, 4, () => {
            postModel = new model_2.default();
            postForm = new view_4.default(postModel);
            return 5;
        });
        const hidePostControls = () => stylePostControls(el => el.style.display = "none");
        exports.postSM.on(5, hidePostControls);
        exports.postSM.on(4, () => hidePostControls());
        exports.postSM.act(5, 6, () => 6);
        exports.postSM.act(5, 3, () => {
            if (captcha_2.captchaLoaded()) {
                return 5;
            }
            postForm.remove();
            return 1;
        });
        for (let s of [5, 6]) {
            exports.postSM.act(s, 10, () => {
                postModel.inputBody = "";
                captcha_2.renderCaptchaForm(exports.postSM.feeder(11));
                if (postForm.upload) {
                    postForm.upload.reset();
                }
                return 5;
            });
        }
        exports.postSM.act(4, 10, () => {
            captcha_2.renderCaptchaForm(exports.postSM.feeder(11));
            if (postForm.upload) {
                postForm.upload.reset();
            }
            return 4;
        });
        for (let s of [5, 6, 4]) {
            ((s) => {
                exports.postSM.act(s, 11, () => {
                    if (exports.postSM.state === 5) {
                        const b = postForm.input.value;
                        if (b) {
                            postModel.parseInput(b);
                        }
                    }
                    postModel.retryUpload();
                    postForm.input.focus();
                    return s;
                });
            })(s);
        }
        exports.postSM.act(4, 3, () => {
            if (captcha_2.captchaLoaded()) {
                return 4;
            }
            postModel.commitClose();
            return 1;
        });
        util_37.on(document, "click", openReply, {
            selector: "aside.posting a",
        });
        util_37.on(document, "click", quotePost, {
            selector: "a.quote",
        });
        document.addEventListener("selectionchange", () => {
            const sel = getSelection(), start = sel.anchorNode;
            if (!start) {
                return;
            }
            const el = start.parentElement;
            if (el && !el.classList.contains("quote")) {
                lastSelection = {
                    start: sel.anchorNode,
                    end: sel.focusNode,
                    text: sel.toString().trim(),
                };
            }
        });
        for (let id of ["name", "auth", "sage"]) {
            identity_3.default.onChange(id, updateIdentity);
        }
        identity_3.default.onChange("live", (live) => {
            if (exports.postSM.state !== 5) {
                return;
            }
            postForm.setEditing(live);
            postForm.inputElement("done").hidden = live;
        });
        drop_1.default();
        paste_1.default();
        image_1.default();
        threads_3.default();
        identity_3.initIdentity();
    };
});
define("posts/inlineExpansion", ["require", "exports", "state", "util/index", "options/index", "posts/model", "posts/view", "posts/collection"], function (require, exports, state_28, util_38, options_11, model_4, view_5, collection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inlinedPosts = new collection_1.default();
    async function onClick(e) {
        const el = e.target, bypass = e.which !== 1
            || e.ctrlKey
            || !options_11.default.postInlineExpand
            || el.classList.contains("temp");
        if (bypass) {
            return;
        }
        e.preventDefault();
        const parent = el.parentElement, id = parseInt(el.getAttribute("data-id"));
        if (parent.lastElementChild.tagName === "ARTICLE") {
            return contractPost(id, parent);
        }
        var model = state_28.posts.get(id) || inlinedPosts.get(id), found = false;
        if (model) {
            if (model.view.el.contains(parent)) {
                return;
            }
            found = true;
            const oldParent = model.view.el.parentElement;
            if (oldParent.tagName === "EM") {
                toggleLinkReferences(oldParent, id, false);
            }
        }
        else {
            const [data] = await util_38.fetchJSON(`/json/post/${id}`);
            if (data) {
                model = new model_4.Post(data);
                new view_5.default(model, null);
                found = true;
                inlinedPosts.add(model);
            }
        }
        if (found) {
            parent.append(model.view.el);
            toggleLinkReferences(parent, id, true);
        }
    }
    function contractPost(id, parent) {
        toggleLinkReferences(parent, id, false);
        const model = state_28.posts.get(id);
        if (!model) {
            const inl = inlinedPosts.get(id);
            if (inl) {
                inl.remove();
            }
        }
        else {
            contractAll(model.view.el.querySelector(".post-container blockquote"));
            contractAll(model.view.el.querySelector(".backlinks"));
            model.view.reposition();
        }
        function contractAll(el) {
            if (!el) {
                return;
            }
            for (let em of el.getElementsByTagName("EM")) {
                contractArticles(em);
            }
            contractArticles(el);
        }
        function contractArticles(el) {
            for (let art of el.getElementsByTagName("ARTICLE")) {
                contractPost(parseInt(art.id.slice(1)), el);
            }
        }
    }
    function toggleLinkReferences(parent, childID, on) {
        const p = parent.closest("article"), ch = document.getElementById(`p${childID}`), pID = p.closest("article").id.slice(1);
        for (let el of p.querySelectorAll(".post-link")) {
            if (el.closest("article") === ch &&
                el.getAttribute("data-id") === pID) {
                el.classList.toggle("referenced", on);
            }
        }
    }
    exports.toggleLinkReferences = toggleLinkReferences;
    exports.default = () => {
        util_38.on(document, "click", onClick, {
            selector: ".post-link",
        });
    };
});
define("posts/lightenThread", ["require", "exports", "state", "util/index", "posts/inlineExpansion", "lang"], function (require, exports, state_29, util_39, inlineExpansion_1, lang_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function renderOmitted(posts, images) {
        const op = document.querySelector("#thread-container article");
        const old = op.querySelector(".omit");
        if (old) {
            posts += parseInt(old.getAttribute("data-omit"));
            images += parseInt(old.getAttribute("data-image-omit"));
            old.remove();
        }
        let s;
        if (!images) {
            s = lang_17.default.format["postsOmitted"].replace("%d", posts.toString());
        }
        else {
            let i = 0;
            s = lang_17.default.format["postsAndImagesOmitted"].replace(/\%d/g, () => {
                if (i++) {
                    return images.toString();
                }
                return posts.toString();
            });
        }
        const el = util_39.makeEl(util_39.HTML `<span class="omit spaced" data-omit="${posts.toString()}" data-image-omit="${images.toString()}">
			${s}
			<span class="act">
				<a href="${state_29.page.thread.toString()}">
					${lang_17.default.posts['seeAll']}
				</a>
			</span>
		</span>`);
        op.querySelector(".post-container").after(el);
    }
    function lightenThread() {
        if (!state_29.page.thread
            || state_29.page.lastN !== 100
            || !util_39.isAtBottom()
            || state_29.posts.size() <= 100) {
            return;
        }
        const models = [...state_29.posts]
            .filter(m => m.id !== state_29.page.thread)
            .sort((a, b) => {
            if (a.time < b.time) {
                return -1;
            }
            if (a.time > b.time) {
                return 1;
            }
            return 0;
        });
        let removedPosts = 0;
        let removedImages = 0;
        while (models.length > 99) {
            const m = models.shift();
            state_29.posts.remove(m);
            removedPosts++;
            if (m.image) {
                removedImages++;
            }
            if (!m.view) {
                continue;
            }
            const el = m.view.el;
            const parent = el.closest("article");
            if (parent) {
                inlineExpansion_1.toggleLinkReferences(parent, m.id, false);
            }
            el.remove();
        }
        renderOmitted(removedPosts, removedImages);
    }
    exports.lightenThread = lightenThread;
});
define("posts/etc", ["require", "exports", "util/index"], function (require, exports, util_40) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function toggleSpoiler(event) {
        event.target.classList.toggle("reveal");
    }
    exports.default = () => util_40.on(document, "click", toggleSpoiler, { selector: "del" });
});
define("posts/collectionView", ["require", "exports", "posts/collection", "base/index", "posts/view", "posts/model", "state"], function (require, exports, collection_2, base_14, view_6, model_5, state_30) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const overlay = document.getElementById("modal-overlay");
    class CollectionView extends base_14.View {
        constructor(data) {
            super({
                tag: "div",
                class: "modal post-collection",
            });
            this.model = new collection_2.default();
            this.borrowed = [];
            const closer = document.createElement("a");
            closer.textContent = `[X]`;
            closer.style.cssFloat = "right";
            this.el.append(closer);
            closer.addEventListener("click", this.remove.bind(this), {
                passive: true,
            });
            data = data.sort((a, b) => a.id - b.id);
            for (let d of data) {
                let model = collection_2.default.getFromAll(d.id);
                if (!model) {
                    model = new model_5.Post(d);
                    new view_6.default(model, null);
                    this.model.add(model);
                }
                else {
                    this.borrowed.push(model);
                }
                this.el.append(model.view.el);
            }
            overlay.append(this.el);
            this.el.style.display = "block";
        }
        remove() {
            for (let m of this.borrowed) {
                if (state_30.posts.get(m.id)) {
                    m.view.reposition();
                }
            }
            this.model.unregister();
            super.remove();
        }
    }
    exports.default = CollectionView;
});
define("posts/report", ["require", "exports", "ui/index", "util/index"], function (require, exports, ui_5, util_41) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ReportForm extends ui_5.FormView {
        constructor(id) {
            super({
                tag: "form",
                class: "modal glass show report-form",
                needCaptcha: true,
            });
            this.render(id);
        }
        async render(id) {
            const res = await fetch(`/html/report/${id}`), t = await res.text();
            document.getElementById("modal-overlay").prepend(this.el);
            switch (res.status) {
                case 200:
                    this.el.append(util_41.makeFrag(t));
                    this.inputElement("reason").focus();
                    break;
                default:
                    this.renderFormResponse(t);
            }
        }
        async send() {
            const res = await fetch("/api/report", {
                method: "POST",
                body: new FormData(this.el),
            });
            if (res.status !== 200) {
                this.renderFormResponse(await res.text());
            }
            else {
                this.remove();
            }
        }
    }
    exports.default = ReportForm;
});
define("posts/menu", ["require", "exports", "base/index", "state", "util/index", "ui/index", "lang", "posts/hide", "mod/index", "posts/collectionView", "posts/report"], function (require, exports, base_15, state_31, util_42, ui_6, lang_18, hide_2, mod_2, collectionView_1, report_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MenuForm extends ui_6.FormView {
        constructor(parent, parentID, html, attrs = {}) {
            attrs["tag"] = "form";
            super(attrs);
            this.parentID = parentID;
            this.el.innerHTML = html
                + util_42.HTML `
			<br>
			<input type="submit" value="${lang_18.default.ui["submit"]}">
			<input type="button" name="cancel" value="${lang_18.default.ui["cancel"]}">
			<div class="form-response admin"></div>`;
            parent.append(this.el);
        }
        closeMenu() {
            const el = this.el.closest(".control");
            if (el && el._popup_menu) {
                el._popup_menu.remove();
            }
        }
    }
    class RedirectForm extends MenuForm {
        constructor(parent, parentID, apiPath) {
            super(parent, parentID, util_42.HTML `
			<br>
			<input type=text name=url>`);
            this.apiPath = apiPath;
        }
        async send() {
            let url = this.el
                .querySelector("input[type=text]")
                .value;
            await util_42.postJSON(`/api/redirect/${this.apiPath}`, {
                id: this.parentID,
                url,
            });
            this.closeMenu();
            this.remove();
        }
    }
    class DeleteByIPForm extends MenuForm {
        constructor(parent, parentID) {
            let s = util_42.HTML `
		<hr>
		<span>${lang_18.default.ui["keepDeletingFor"]}</span>
		<br>
		<br>`;
            for (let id of ["day", "hour", "minute"]) {
                let label = lang_18.default.plurals[id][1];
                label = label[0].toUpperCase() + label.slice(1);
                s += util_42.HTML `
			<input type="number" name="${id}" min="0" placeholder="${label}">
			<br>`;
            }
            s += util_42.HTML `
		<input type="text" name="reason" class="full-width" placeholder="${lang_18.default.ui["reason"]}">
		<hr>`;
            super(parent, parentID, s, { needCaptcha: true });
            this.el.style.padding = "0.5em";
            this.on("change", () => {
                const r = this.inputElement("reason");
                if (this.extractDuration() === 0) {
                    r.removeAttribute("required");
                }
                else {
                    r.setAttribute("required", "");
                }
            });
        }
        async send() {
            await util_42.postJSON("/api/delete-posts/by-ip", {
                id: this.parentID,
                duration: this.extractDuration(),
                reason: this.inputElement("reason").value,
            });
            this.closeMenu();
            this.remove();
        }
    }
    const actions = {
        hide: {
            text: lang_18.default.posts["hide"],
            shouldRender(m) {
                return !state_31.mine.has(m.id);
            },
            handler: hide_2.hidePost,
        },
        report: {
            text: lang_18.default.ui["report"],
            shouldRender(m) {
                return true;
            },
            handler(m) {
                new report_1.default(m.id);
            },
        },
        viewSameIP: {
            text: lang_18.default.posts["viewBySameIP"],
            shouldRender: canModerateIP,
            async handler(m) {
                new collectionView_1.default(await getSameIPPosts(m));
            },
        },
        deleteSameIP: {
            text: lang_18.default.posts["deleteBySameIP"],
            shouldRender: canModerateIP,
            keepOpen: true,
            handler(m, el) {
                new DeleteByIPForm(el, m.id);
            },
        },
        toggleSticky: {
            text: lang_18.default.posts["toggleSticky"],
            shouldRender(m) {
                return mod_2.position >= 2 && m.id === m.op;
            },
            async handler(m) {
                const res = await util_42.postJSON("/api/sticky", {
                    id: m.id,
                    val: !m.sticky,
                });
                if (res.status !== 200) {
                    return alert(await res.text());
                }
                m.sticky = !m.sticky;
                m.view.renderSticky();
            },
        },
        toggleLock: {
            text: lang_18.default.ui["lockThread"],
            shouldRender(m) {
                return mod_2.position >= 2 && m.id === m.op;
            },
            async handler(m) {
                const res = await util_42.postJSON("/api/lock-thread", {
                    id: m.id,
                    val: !m.locked,
                });
                if (res.status !== 200) {
                    return alert(await res.text());
                }
                m.locked = !m.locked;
                m.view.renderLocked();
            },
        },
        redirectByIP: {
            text: lang_18.default.ui["redirectByIP"],
            keepOpen: true,
            shouldRender(m) {
                return mod_2.position >= 4 && likelyHasIP(m);
            },
            handler(m, el) {
                new RedirectForm(el, m.id, "by-ip");
            },
        },
        redirectByThread: {
            text: lang_18.default.ui["redirectByThread"],
            keepOpen: true,
            shouldRender(m) {
                return mod_2.position >= 4 && m.id === m.op;
            },
            handler(m, el) {
                new RedirectForm(el, m.id, "by-thread");
            },
        },
    };
    function canModerateIP(m) {
        return mod_2.position >= 1 && likelyHasIP(m);
    }
    function likelyHasIP(m) {
        return m.time > Date.now() / 1000 - 24 * 7 * 3600;
    }
    class MenuView extends base_15.View {
        constructor(parent, model) {
            super({
                model,
                tag: "ul",
                class: "popup-menu glass",
            });
            this.parent = parent;
            parent._popup_menu = this;
            this.render();
            this.on("click", e => this.handleClick(e), {
                passive: true,
            });
        }
        render() {
            for (let key in actions) {
                const { shouldRender, text } = actions[key];
                if (!shouldRender(this.model)) {
                    continue;
                }
                const li = document.createElement("li");
                li.setAttribute("data-id", key);
                li.textContent = text;
                this.el.append(li);
            }
            this.parent.append(this.el);
        }
        handleClick(e) {
            const act = actions[e.target.getAttribute('data-id')];
            if (act) {
                act.handler(this.model, e.target.closest("li"));
                if (!act.keepOpen) {
                    this.remove();
                }
            }
        }
        remove() {
            this.parent._popup_menu = null;
            super.remove();
        }
    }
    function openMenu(e) {
        const parent = e.target.closest(".control");
        if (parent._popup_menu) {
            return parent._popup_menu.remove();
        }
        const model = state_31.getModel(parent);
        if (model) {
            new MenuView(parent, model);
        }
    }
    async function getSameIPPosts(m) {
        const res = await util_42.postJSON(`/api/same-IP/${m.id}`, null);
        if (res.status !== 200) {
            alert(await res.text());
            return;
        }
        return await res.json();
    }
    exports.default = () => util_42.on(document, "click", openMenu, {
        passive: true,
        selector: ".control, .control svg, .control path",
    });
});
define("posts/hover", ["require", "exports", "state", "options/index", "util/index", "posts/model", "posts/images", "posts/view", "common/index"], function (require, exports, state_32, options_12, util_43, model_6, images_2, view_7, common_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const overlay = document.querySelector("#hover-overlay");
    let postPreview, imagePreview;
    const mouseMove = util_43.emitChanges({
        event: {
            target: null,
        },
    });
    class PostPreview extends images_2.default {
        constructor(model, parent) {
            const { el } = model.view;
            super({ el: clonePost(el) });
            this.parent = parent;
            this.model = Object.assign({}, model);
            this.sourceModel = model;
            this.source = el;
            this.clickHandler = () => this.remove();
            parent.addEventListener("click", this.clickHandler, {
                passive: true,
            });
            this.observer = new MutationObserver(() => this.renderUpdates());
            this.observer.observe(el, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true,
            });
            this.render();
        }
        render() {
            const media = this.el.querySelector("audio, video");
            if (media) {
                media.pause();
            }
            for (let el of this.el.querySelectorAll("article")) {
                el.remove();
            }
            for (let el of this.el.querySelectorAll("a.post-link.referenced")) {
                el.classList.remove("referenced");
            }
            const patt = new RegExp(`[>\/]` + util_43.getClosestID(this.parent));
            for (let el of this.el.querySelectorAll("a.post-link")) {
                if (!patt.test(el.textContent)) {
                    continue;
                }
                el.classList.add("referenced");
            }
            const img = this.sourceModel.image;
            if (img && img.expanded) {
                this.model.image = Object.assign({}, this.sourceModel.image);
                this.contractImage(null, false);
            }
            const fc = overlay.firstChild;
            if (fc !== this.el) {
                if (fc) {
                    fc.remove();
                }
                overlay.append(this.el);
            }
            this.position();
            this.sourceModel.view.setHighlight(true);
        }
        position() {
            const rect = this.parent.getBoundingClientRect();
            this.el.style.left = rect.left + "px";
            const height = this.el.offsetHeight;
            let top = rect.top - height - 5;
            if (top < 0) {
                top += height + 23;
            }
            this.el.style.top = top + "px";
        }
        renderUpdates() {
            const el = clonePost(this.source);
            this.el.replaceWith(el);
            this.el = el;
            this.render();
        }
        remove() {
            this.observer.disconnect();
            this.parent.removeEventListener("click", this.clickHandler);
            postPreview = null;
            super.remove();
            this.sourceModel.view.setHighlight(false);
        }
    }
    function clear() {
        if (postPreview) {
            postPreview.remove();
            postPreview = null;
        }
        if (imagePreview) {
            imagePreview.remove();
            imagePreview = null;
        }
    }
    function clonePost(el) {
        const preview = el.cloneNode(true);
        preview.removeAttribute("id");
        preview.classList.add("preview");
        return preview;
    }
    function renderImagePreview(event) {
        if (!options_12.default.imageHover || state_32.page.catalog) {
            return;
        }
        const target = event.target;
        let bypass = !(target.matches && target.matches("figure img")), post;
        if (!bypass) {
            post = state_32.getModel(target);
            bypass = !post
                || post.image.expanded
                || post.image.thumb_type === common_14.fileTypes.noFile;
        }
        if (bypass) {
            if (imagePreview) {
                imagePreview.remove();
                imagePreview = null;
            }
            return;
        }
        let tag;
        if (common_14.isExpandable(post.image.file_type)) {
            switch (post.image.file_type) {
                case common_14.fileTypes.webm:
                case common_14.fileTypes.mp4:
                case common_14.fileTypes.ogg:
                    if (!options_12.default.webmHover || !post.image.video) {
                        return clear();
                    }
                    tag = "video";
                    break;
                default:
                    tag = "img";
            }
        }
        else {
            return clear();
        }
        const el = document.createElement(tag);
        util_43.setAttrs(el, {
            src: images_2.sourcePath(post.image.sha1, post.image.file_type),
        });
        if (tag === 'video') {
            util_43.setAttrs(el, {
                autoplay: "",
                loop: "",
            });
        }
        imagePreview = el;
        if (tag === "video") {
            el.volume = options_12.default.audioVolume / 100;
        }
        overlay.append(el);
        el.onload = () => el.style.transform = "translateZ(1px)";
    }
    async function renderPostPreview(event) {
        let target = event.target;
        if (!target.matches || !target.matches("a.post-link, .hash-link")) {
            return;
        }
        if (target.classList.contains("hash-link")) {
            target = target.previousElementSibling;
        }
        if (target.matches("em.expanded > a")) {
            return;
        }
        const id = parseInt(target.getAttribute("data-id"));
        if (!id) {
            return;
        }
        let post = state_32.posts.get(id);
        if (!post) {
            const [data] = await util_43.fetchJSON(`/json/post/${id}`);
            if (data) {
                post = new model_6.Post(data);
                new view_7.default(post, null);
            }
            else {
                return;
            }
        }
        else if (!post.seenOnce) {
            post.seenOnce = true;
            state_32.storeSeenPost(post.id, post.op);
        }
        postPreview = new PostPreview(post, target);
    }
    function onMouseMove(event) {
        if (event.target !== mouseMove.event.target) {
            clear();
            mouseMove.event = event;
        }
    }
    exports.default = () => {
        document.addEventListener("mousemove", onMouseMove, {
            passive: true,
        });
        mouseMove.onChange("event", renderPostPreview);
        mouseMove.onChange("event", renderImagePreview);
        util_43.hook("imageExpanded", clear);
    };
});
define("posts/index", ["require", "exports", "posts/model", "posts/view", "posts/posting/index", "posts/images", "posts/hide", "posts/render/index", "posts/collection", "posts/syncwatch", "posts/images", "posts/lightenThread", "posts/etc", "posts/posting/index", "posts/menu", "posts/inlineExpansion", "posts/hover"], function (require, exports, model_7, view_8, posting_1, images_3, hide_3, render_2, collection_3, syncwatch_2, images_4, lightenThread_1, etc_3, posting_2, menu_1, inlineExpansion_2, hover_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Post = model_7.Post;
    exports.PostView = view_8.default;
    exports.postSM = posting_1.postSM;
    exports.FormModel = posting_1.FormModel;
    exports.identity = posting_1.identity;
    exports.expandThreadForm = posting_1.expandThreadForm;
    exports.ImageHandler = images_3.default;
    exports.toggleExpandAll = images_3.toggleExpandAll;
    exports.thumbPath = images_3.thumbPath;
    exports.clearHidden = hide_3.clearHidden;
    exports.hideRecursively = hide_3.hideRecursively;
    __export(render_2);
    exports.PostCollection = collection_3.default;
    exports.findSyncwatches = syncwatch_2.findSyncwatches;
    exports.serverNow = syncwatch_2.serverNow;
    exports.sourcePath = images_4.sourcePath;
    __export(lightenThread_1);
    exports.default = () => {
        etc_3.default();
        posting_2.default();
        menu_1.default();
        inlineExpansion_2.default();
        hover_1.default();
    };
});
define("state", ["require", "exports", "posts/index", "util/index", "db", "connection/index"], function (require, exports, posts_10, util_44, db_4, connection_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tenDays = 10 * 24 * 60 * 60 * 1000;
    exports.config = window.config;
    exports.boards = window.boards;
    exports.bgVideos = window.bgVideos;
    exports.page = read(location.href);
    exports.posts = new posts_10.PostCollection();
    exports.debug = /[\?&]debug=true/.test(location.href);
    function read(href) {
        const u = new URL(href, location.origin), thread = u.pathname.match(/^\/\w+\/(\d+)/), page = u.search.match(/[&\?]page=(\d+)/);
        return {
            href,
            board: u.pathname.match(/^\/(\w+)\//)[1],
            lastN: /[&\?]last=100/.test(u.search) ? 100 : 0,
            page: page ? parseInt(page[1]) : 0,
            catalog: /^\/\w+\/catalog/.test(u.pathname),
            thread: parseInt(thread && thread[1]) || 0,
        };
    }
    function loadFromDB(...threads) {
        return Promise.all([
            db_4.readIDs("mine", threads).then(ids => exports.mine = new Set(ids)),
            db_4.readIDs("seen", threads).then(ids => exports.seenReplies = new Set(ids)),
            db_4.readIDs("seenPost", threads).then(ids => exports.seenPosts = new Set(ids)),
            db_4.readIDs("hidden", threads).then((ids) => exports.hidden = new Set(ids)),
        ]).then(() => {
            receive("mine", exports.mine);
            receive("seen", exports.seenReplies);
            receive("seenPosts", exports.seenPosts);
            receive("hidden", exports.hidden);
        });
    }
    exports.loadFromDB = loadFromDB;
    const channels = new Map();
    function getChannel(name) {
        if (channels.has(name)) {
            return channels.get(name);
        }
        const newChannel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(name) : null;
        channels.set(name, newChannel);
        return newChannel;
    }
    function propagate(channel, ...data) {
        const chan = getChannel(channel);
        chan && chan.postMessage(data);
    }
    function receive(channel, store) {
        const chan = getChannel(channel);
        if (chan) {
            chan.onmessage = (e) => {
                for (const el of e.data) {
                    store.add(el);
                }
            };
        }
    }
    const batchedPropagateSeenPost = util_44.timedAggregate(propagate.bind(null, "seenPost"));
    const batchedStoreSeenPost = util_44.timedAggregate(db_4.storeID.bind(null, "seenPost", tenDays));
    function storeMine(id, op) {
        exports.mine.add(id);
        propagate("mine", id);
        db_4.storeID("mine", tenDays, { id, op });
    }
    exports.storeMine = storeMine;
    function storeSeenReply(id, op) {
        exports.seenReplies.add(id);
        propagate("seen", id);
        db_4.storeID("seen", tenDays, { id, op });
    }
    exports.storeSeenReply = storeSeenReply;
    function storeSeenPost(id, op) {
        exports.seenPosts.add(id);
        batchedPropagateSeenPost(id);
        batchedStoreSeenPost({ id, op });
    }
    exports.storeSeenPost = storeSeenPost;
    function storeHidden(id, op) {
        exports.hidden.add(id);
        propagate("hidden", id);
        db_4.storeID("hidden", tenDays * 3 * 6, { id, op });
    }
    exports.storeHidden = storeHidden;
    function setBoardConfig(c) {
        exports.boardConfig = c;
    }
    exports.setBoardConfig = setBoardConfig;
    function getModel(el) {
        const id = util_44.getClosestID(el);
        if (!id) {
            return null;
        }
        return posts_10.PostCollection.getFromAll(id);
    }
    exports.getModel = getModel;
    function displayLoading(display) {
        const el = document.getElementById('loading-image');
        if (el) {
            el.style.display = display ? 'block' : 'none';
        }
    }
    exports.displayLoading = displayLoading;
    ;
    window.debugMode = () => {
        exports.debug = true;
        window.send = connection_6.send;
    };
});
define("util/scroll", ["require", "exports", "state", "util/hooks", "posts/index"], function (require, exports, state_33, hooks_1, posts_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const banner = document.getElementById("banner");
    let scrolled = false;
    let locked = false;
    function scrollToAnchor() {
        if (!location.hash) {
            if (!state_33.page.thread) {
                scrollToTop();
            }
            return;
        }
        const el = document.querySelector(location.hash);
        if (!el) {
            return scrollToTop();
        }
        scrollToElement(el);
        checkBottom();
    }
    exports.scrollToAnchor = scrollToAnchor;
    function scrollToElement(el) {
        window.scrollTo(0, el.offsetTop - banner.offsetHeight - 5);
    }
    exports.scrollToElement = scrollToElement;
    function scrollToTop() {
        window.scrollTo(0, 0);
        checkBottom();
    }
    function scrollToBottom() {
        window.scrollTo(0, document.documentElement.scrollHeight);
        exports.atBottom = true;
    }
    exports.scrollToBottom = scrollToBottom;
    function checkBottom() {
        if (!state_33.page.thread) {
            exports.atBottom = false;
            return;
        }
        const previous = exports.atBottom;
        exports.atBottom = isAtBottom();
        const lock = document.getElementById("lock");
        if (lock) {
            lock.style.visibility = exports.atBottom ? "visible" : "hidden";
        }
        if (!previous && exports.atBottom) {
            posts_11.lightenThread();
        }
    }
    exports.checkBottom = checkBottom;
    function isAtBottom() {
        return window.innerHeight
            + window.scrollY
            - document.documentElement.offsetHeight
            > -1;
    }
    exports.isAtBottom = isAtBottom;
    document.addEventListener("scroll", () => {
        scrolled = !isAtBottom();
        locked = !scrolled;
        checkBottom();
    }, { passive: true });
    let threadContainer = document.getElementById("thread-container");
    if (threadContainer !== null) {
        let threadObserver = new MutationObserver((mut) => {
            if (locked || (hooks_1.trigger("getOptions").alwaysLock && !scrolled)) {
                scrollToBottom();
            }
        });
        threadObserver.observe(threadContainer, {
            childList: true,
            subtree: true,
        });
    }
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            locked = false;
        }
    });
    window.addEventListener("hashchange", scrollToAnchor, {
        passive: true,
    });
});
define("util/render", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const templates = {};
    function importTemplate(name) {
        return document.importNode(templates[name], true);
    }
    exports.importTemplate = importTemplate;
    for (let el of document.head.querySelectorAll("template")) {
        templates[el.getAttribute("name")] = el.content;
    }
    function toggleHeadStyle(name, css) {
        return toggle => {
            const id = name + "-toggle";
            if (!document.getElementById(id)) {
                const html = `<style id="${id}">${css}</style>`;
                document.head.append(makeEl(html));
            }
            document.getElementById(id).disabled = !toggle;
        };
    }
    exports.toggleHeadStyle = toggleHeadStyle;
    function makeEl(DOMString) {
        const el = document.createElement('div');
        el.innerHTML = DOMString;
        return el.firstChild;
    }
    exports.makeEl = makeEl;
});
define("util/changes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function emitChanges(obj) {
        const changeHooks = {};
        const proxy = new Proxy(obj, {
            set(target, key, val) {
                target[key] = val;
                (changeHooks[key] || [])
                    .concat(changeHooks["*"] || [])
                    .forEach(fn => fn(val));
                return true;
            },
        });
        proxy.onChange = (key, func) => {
            const hooks = changeHooks[key];
            if (hooks) {
                hooks.push(func);
            }
            else {
                changeHooks[key] = [func];
            }
        };
        proxy.replaceWith = replaceWith;
        return proxy;
    }
    exports.emitChanges = emitChanges;
    function replaceWith(newObj) {
        for (let key in newObj) {
            const newProp = newObj[key];
            if (newProp !== this[key]) {
                this[key] = newProp;
            }
        }
    }
});
define("util/eventBatching", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const pendingBatches = new Map();
    function timedAggregate(f) {
        return (...values) => {
            if (pendingBatches.has(f)) {
                const batch = pendingBatches.get(f);
                batch.push(...values);
                return;
            }
            const ary = values;
            pendingBatches.set(f, ary);
            setTimeout(() => {
                pendingBatches.delete(f);
                f(...ary);
            }, 200);
        };
    }
    exports.timedAggregate = timedAggregate;
});
define("util/index", ["require", "exports", "util/fsm", "util/fetch", "util/hooks", "util/scroll", "util/render", "util/changes", "util/eventBatching"], function (require, exports, fsm_1, fetch_1, hooks_2, scroll_1, render_3, changes_1, eventBatching_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FSM = fsm_1.default;
    __export(fetch_1);
    __export(hooks_2);
    __export(scroll_1);
    __export(render_3);
    __export(changes_1);
    __export(eventBatching_1);
    function getID(el) {
        if (!el) {
            return 0;
        }
        return parseInt(el.getAttribute('id').slice(1), 10);
    }
    exports.getID = getID;
    function getClosestID(el) {
        if (!el) {
            return 0;
        }
        return getID(el.closest('article'));
    }
    exports.getClosestID = getClosestID;
    function makeFrag(DOMString) {
        const el = document.createElement("template");
        el.innerHTML = DOMString;
        return el.content;
    }
    exports.makeFrag = makeFrag;
    function on(el, type, fn, opts) {
        if (opts && opts.selector) {
            const oldFn = fn;
            fn = event => {
                const t = event.target;
                if (t instanceof Element && t.matches(opts.selector)) {
                    oldFn(event);
                }
            };
        }
        el.addEventListener(type, fn, opts);
    }
    exports.on = on;
    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }
    exports.pad = pad;
    function HTML(base, ...args) {
        let output = base[0];
        for (let i = 1; i <= args.length; i++) {
            output += args[i - 1] + base[i];
        }
        return output.replace(/[\t\n]+/g, '');
    }
    exports.HTML = HTML;
    function makeAttrs(attrs) {
        let html = '';
        for (let key in attrs) {
            html += ' ' + key;
            const val = attrs[key];
            if (val) {
                html += `="${val}"`;
            }
        }
        return html;
    }
    exports.makeAttrs = makeAttrs;
    function setAttrs(el, attrs) {
        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
    exports.setAttrs = setAttrs;
    function extend(dest, source) {
        for (let key in source) {
            const val = source[key];
            if (typeof val === "object" && val !== null) {
                const d = dest[key];
                if (d) {
                    extend(d, val);
                }
                else {
                    dest[key] = val;
                }
            }
            else {
                dest[key] = val;
            }
        }
    }
    exports.extend = extend;
    function load(loader) {
        return new Promise((resolve, reject) => {
            loader.onload = resolve;
            loader.onerror = reject;
        });
    }
    exports.load = load;
    const escapeMap = {
        "&": "&amp;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&#34;",
    };
    function escape(str) {
        return str.replace(/[&'<>"]/g, char => escapeMap[char]);
    }
    exports.escape = escape;
    function pluralize(num, word) {
        return `${num} ${word[num === 1 || num === -1 ? 0 : 1]}`;
    }
    exports.pluralize = pluralize;
    function firstChild(el, check) {
        for (let i = 0; i < el.children.length; i++) {
            const ch = el.children[i];
            if (check(ch)) {
                return ch;
            }
        }
        return null;
    }
    exports.firstChild = firstChild;
    function inputElement(parent, name) {
        return parent.querySelector(`input[name="${name}"]`);
    }
    exports.inputElement = inputElement;
    function setCookie(key, val, days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${key}=${val}; expires=${date.toUTCString()}; path=/;`;
    }
    exports.setCookie = setCookie;
    function getCookie(id) {
        const kv = document.cookie
            .split(";")
            .map(s => s.trim())
            .filter(s => s.startsWith(id));
        if (!kv.length) {
            return "";
        }
        return kv[0].split("=")[1];
    }
    exports.getCookie = getCookie;
    function deleteCookie(id) {
        document.cookie = `${id}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }
    exports.deleteCookie = deleteCookie;
    function extractJSON(id) {
        const el = document.getElementById(id);
        if (!el) {
            return null;
        }
        return JSON.parse(el.textContent);
    }
    exports.extractJSON = extractJSON;
    function modPaste(old, sel, pos) {
        let s = '', b = false;
        if (!sel) {
            return;
        }
        if (sel.startsWith('>')) {
            switch (old.charAt(pos - 1)) {
                case '':
                case '\n':
                    break;
                default:
                    s = '\n';
            }
            if (sel.includes('\n')) {
                for (let line of sel.split('\n')) {
                    s += line == '' ? '\n' : normalizePostQuote(line);
                }
            }
            else {
                s += normalizePostQuote(sel);
            }
            switch (old.charAt(pos)) {
                case '':
                case '\n':
                    break;
                default:
                    b = true;
                    s += '\n';
            }
        }
        else {
            if (!sel.endsWith('\n') && sel.includes("\n>")) {
                s += `${sel}\n`;
            }
            else {
                s += sel;
            }
        }
        return { body: s, pos: b ? pos + s.length - 1 : pos + s.length };
    }
    exports.modPaste = modPaste;
    function normalizePostQuote(s) {
        if (s.startsWith(">>") && !isNaN(+s.charAt(2))) {
            return `${s}\n`;
        }
        return `>${s}\n`;
    }
});
define("connection/messages", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handlers = {};
});
define("connection/ui", ["require", "exports", "lang", "connection/messages"], function (require, exports, lang_19, messages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const syncEl = document.getElementById('sync'), syncedCount = document.getElementById("sync-counter");
    function renderStatus(status) {
        syncEl.textContent = lang_19.default.sync[status];
    }
    exports.renderStatus = renderStatus;
    function renderSyncCount(sync) {
        syncedCount.textContent = sync ?
            `${sync.active.toString()} / ${sync.total.toString()}` : '';
    }
    exports.renderSyncCount = renderSyncCount;
    messages_1.handlers[35] = renderSyncCount;
});
define("connection/synchronization", ["require", "exports", "connection/messages", "connection/state", "posts/index", "state", "util/index", "client"], function (require, exports, messages_2, state_34, posts_12, state_35, util_45, client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function synchronise() {
        state_34.send(30, {
            board: state_35.page.board,
            thread: state_35.page.thread,
        });
        if (state_35.page.thread && posts_12.postSM.state === 2) {
            const m = util_45.trigger("getPostModel");
            if (m.time > (Date.now() / 1000 - 15 * 60)) {
                state_34.send(31, {
                    id: m.id,
                    password: posts_12.identity.postPassword,
                });
            }
            else {
                posts_12.postSM.feed(9);
            }
        }
    }
    exports.synchronise = synchronise;
    async function syncRecentPost(id, p) {
        let model = state_35.posts.get(id);
        if (!model) {
            await fetchMissingPost(id);
            model = state_35.posts.get(id);
        }
        else if (model instanceof posts_12.FormModel) {
            model.inputBody = model.body = p.body;
            model.view.onInput();
            return;
        }
        if (p.hash_image && !model.image) {
            if (model.image = (await fetchPost(id)).image) {
                model.view.renderImage(false);
            }
        }
        if (p.spoilered && model.image && !model.image.spoiler) {
            model.image.spoiler = true;
            model.view.renderImage(false);
        }
        if (p.body) {
            model.body = p.body;
        }
        model.view.reparseBody();
    }
    async function fetchMissingPost(id) {
        client_1.insertPost(await fetchPost(id));
        state_35.posts.get(id).view.reposition();
    }
    async function fetchUnclosed(post) {
        util_45.extend(post, await fetchPost(post.id));
        post.propagateLinks();
        post.view.render();
    }
    async function fetchPost(id) {
        const r = await fetch(`/json/post/${id}`);
        if (r.status !== 200) {
            throw await r.text();
        }
        return r.json();
    }
    messages_2.handlers[31] = (code) => {
        switch (code) {
            case 0:
                posts_12.postSM.feed(8);
                break;
            case 1:
                posts_12.postSM.feed(9);
                break;
        }
    };
    messages_2.handlers[30] = async (data) => {
        if (!state_35.page.thread) {
            return;
        }
        let minID = 0;
        if (state_35.page.lastN) {
            minID = Infinity;
            for (let { id } of state_35.posts) {
                if (id < minID && id !== state_35.page.thread) {
                    minID = id;
                }
            }
            if (minID === Infinity) {
                minID = state_35.page.thread;
            }
        }
        const { recent, moderation } = data, proms = [];
        for (let post of state_35.posts) {
            if (post.editing && !(post.id in recent)) {
                proms.push(fetchUnclosed(post));
            }
        }
        for (let key in recent) {
            const id = parseInt(key);
            if (id >= minID) {
                proms.push(syncRecentPost(id, recent[key]));
            }
        }
        for (let id in moderation) {
            const p = state_35.posts.get(parseInt(id));
            if (!p) {
                continue;
            }
            if (!p.moderation || p.moderation.length !== moderation[id].length) {
                p.moderation = [];
                for (let e of moderation[id]) {
                    p.applyModeration(e);
                }
            }
        }
        if (proms.length) {
            await Promise.all(proms).catch(console.error);
        }
        state_35.displayLoading(false);
        state_34.connSM.feed(5);
    };
});
define("connection/state", ["require", "exports", "util/index", "state", "connection/messages", "connection/ui", "connection/synchronization"], function (require, exports, util_46, state_36, messages_3, ui_7, synchronization_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path = (location.protocol === 'https:' ? 'wss' : 'ws')
        + `://${location.host}/api/socket`;
    let socket, attempts, attemptTimer;
    exports.connSM = new util_46.FSM(0);
    function connect() {
        close_socket();
        if (window.location.protocol == 'file:') {
            console.error("Page downloaded locally. Refusing to sync.");
            return;
        }
        socket = new WebSocket(path);
        socket.onopen = exports.connSM.feeder(1);
        socket.onclose = exports.connSM.feeder(2);
        socket.onerror = exports.connSM.feeder(2);
        socket.onmessage = ({ data }) => onMessage(data, false);
        if (state_36.debug) {
            window.socket = socket;
        }
    }
    function close_socket() {
        if (socket) {
            socket.close();
            socket = null;
        }
    }
    function send(type, msg) {
        if (socket.readyState !== 1) {
            console.warn("Attempting to send while socket closed");
            return;
        }
        let str = leftPad(type);
        if (msg !== null) {
            str += JSON.stringify(msg);
        }
        if (state_36.debug) {
            console.log('<', str);
        }
        socket.send(str);
    }
    exports.send = send;
    function leftPad(type) {
        let str = type.toString();
        if (str.length === 1) {
            str = '0' + str;
        }
        return str;
    }
    function onMessage(data, extracted) {
        const type = parseInt(data.slice(0, 2));
        if (state_36.debug) {
            console.log(extracted ? "\t>" : ">", data);
        }
        data = data.slice(2);
        if (type === 33) {
            for (let msg of JSON.parse(data)) {
                onMessage(msg, true);
            }
            return;
        }
        const handler = messages_3.handlers[type];
        if (handler) {
            handler(JSON.parse(data));
        }
    }
    function prepareToSync() {
        ui_7.renderStatus(1);
        synchronization_1.synchronise();
        attemptTimer = setTimeout(resetAttempts, 10000);
        return 2;
    }
    function clearModuleState() {
        close_socket();
        if (attemptTimer) {
            clearTimeout(attemptTimer);
            attemptTimer = 0;
        }
    }
    function onWindowFocus() {
        if (!navigator.onLine) {
            return;
        }
        switch (exports.connSM.state) {
            case 3:
                send(34, null);
                break;
            case 6:
                break;
            default:
                exports.connSM.feed(3);
        }
    }
    function resetAttempts() {
        if (attemptTimer) {
            clearTimeout(attemptTimer);
            attemptTimer = 0;
        }
        attempts = 0;
    }
    function start() {
        exports.connSM.feed(0);
    }
    exports.start = start;
    exports.connSM.act(0, 0, () => {
        ui_7.renderStatus(1);
        attempts = 0;
        connect();
        return 1;
    });
    for (let state of [1, 4]) {
        exports.connSM.act(state, 1, prepareToSync);
    }
    exports.connSM.act(2, 5, () => {
        ui_7.renderStatus(3);
        return 3;
    });
    exports.connSM.wildAct(2, event => {
        clearModuleState();
        if (state_36.debug) {
            console.error(event);
        }
        if (state_36.page.thread) {
            ui_7.renderStatus(0);
        }
        const wait = 500 * Math.pow(1.5, Math.min(Math.floor(++attempts / 2), 12));
        setTimeout(exports.connSM.feeder(3), wait);
        return exports.connSM.state === 6
            ? 6
            : 5;
    });
    exports.connSM.act(5, 3, () => {
        if (!navigator.onLine || !state_36.page.thread) {
            return 5;
        }
        connect();
        setTimeout(() => {
            if (exports.connSM.state === 4) {
                ui_7.renderStatus(1);
            }
        }, 100);
        return 4;
    });
    exports.connSM.wildAct(4, () => {
        ui_7.renderStatus(4);
        clearModuleState();
        return 6;
    });
    document.addEventListener('visibilitychange', event => {
        if (!event.target.hidden) {
            onWindowFocus();
        }
    });
    window.addEventListener('online', () => {
        resetAttempts();
        exports.connSM.feed(3);
    });
    window.addEventListener('offline', exports.connSM.feeder(2));
});
define("connection/index", ["require", "exports", "connection/state", "connection/messages", "connection/synchronization", "connection/ui"], function (require, exports, state_37, messages_4, synchronization_2, ui_8) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(state_37);
    __export(messages_4);
    __export(synchronization_2);
    __export(ui_8);
});
define("client", ["require", "exports", "connection/index", "state", "posts/index", "ui/index", "page/index", "options/index", "ui/index", "util/index"], function (require, exports, connection_7, state_38, posts_13, ui_9, page_1, options_13, ui_10, util_47) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function handle(id, fn) {
        const model = state_38.posts.get(id);
        if (model) {
            fn(model);
        }
    }
    function insertPost(data) {
        if (options_13.posterName()) {
            data.name = options_13.posterName();
        }
        const existing = state_38.posts.get(data.id);
        if (existing) {
            if (existing instanceof posts_13.FormModel) {
                existing.onAllocation(data);
                page_1.incrementPostCount(true, !!data["image"]);
            }
            return;
        }
        const model = new posts_13.Post(data);
        model.op = state_38.page.thread;
        model.board = state_38.page.board;
        state_38.posts.add(model);
        const view = new posts_13.PostView(model, null);
        if (!model.editing) {
            model.propagateLinks();
        }
        const last = document
            .getElementById("thread-container")
            .lastElementChild;
        if (last.id === "p0") {
            last.before(view.el);
        }
        else {
            last.after(view.el);
        }
        ui_9.postAdded(model);
        page_1.incrementPostCount(true, !!data["image"]);
        posts_13.lightenThread();
    }
    exports.insertPost = insertPost;
    exports.default = () => {
        connection_7.handlers[0] = (msg) => {
            alert(msg);
            connection_7.connSM.feed(4);
            throw msg;
        };
        connection_7.handlers[1] = insertPost;
        connection_7.handlers[6] = (msg) => handle(msg.id, m => {
            delete msg.id;
            if (!m.image) {
                page_1.incrementPostCount(false, true);
            }
            m.insertImage(msg);
        });
        connection_7.handlers[7] = (id) => handle(id, m => m.spoilerImage());
        connection_7.handlers[2] = ([id, char]) => handle(id, m => m.append(char));
        connection_7.handlers[3] = (id) => handle(id, m => m.backspace());
        connection_7.handlers[4] = (msg) => handle(msg.id, m => m.splice(msg));
        connection_7.handlers[5] = ({ id, links, commands }) => handle(id, m => {
            if (links) {
                m.links = links;
                m.propagateLinks();
            }
            if (commands) {
                m.commands = commands;
            }
            m.closePost();
        });
        connection_7.handlers[8] = (msg) => handle(msg.id, m => m.applyModeration(msg));
        connection_7.handlers[37] = (url) => location.href = url.replace(/shamik\.ooo|megu\.ca/, location.hostname) || url;
        connection_7.handlers[38] = (text) => new ui_10.OverlayNotification(text);
        connection_7.handlers[42] = ({ key, value }) => util_47.setCookie(key, value, 30);
    };
});
define("main", ["require", "exports", "state", "connection/index", "db", "options/index", "posts/index", "posts/index", "page/index", "page/thread", "ui/index", "util/index", "client", "mod/index", "options/index", "page/thread_watcher"], function (require, exports, state_39, connection_8, db_5, options_14, posts_14, posts_15, page_2, thread, ui_11, util_48, client_2, mod_3, options_15, thread_watcher_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    async function start() {
        page_2.extractConfigs();
        await db_5.open();
        if (state_39.page.thread) {
            await state_39.loadFromDB(state_39.page.thread);
        }
        const oldNowPlaying = localStorage.getItem("nowPlaying");
        if (oldNowPlaying === "true") {
            localStorage.setItem("nowPlaying", "r/a/dio");
        }
        else if (oldNowPlaying === "false") {
            localStorage.setItem("nowPlaying", "none");
        }
        options_14.initOptions();
        if (state_39.page.thread) {
            page_2.renderThread();
            connection_8.connSM.once(3, () => {
                setTimeout(() => {
                    const data = localStorage.getItem("openQuote");
                    if (!data) {
                        return;
                    }
                    const i = data.indexOf(":"), id = parseInt(data.slice(0, i)), sel = data.slice(i + 1);
                    localStorage.removeItem("openQuote");
                    if (state_39.posts.get(id)) {
                        posts_15.postSM.feed(4);
                        util_48.trigger("getPostModel")
                            .addReference(id, sel);
                        requestAnimationFrame(util_48.scrollToBottom);
                    }
                }, 100);
            });
            options_15.persistMessages();
            connection_8.start();
            util_48.checkBottom();
            client_2.default();
            const addMine = util_48.getCookie("addMine");
            if (addMine) {
                const id = parseInt(addMine);
                state_39.storeMine(id, id);
                state_39.storeSeenPost(id, id);
                thread_watcher_2.watchThread(id, 1, thread.subject);
                util_48.deleteCookie("addMine");
            }
        }
        else {
            await page_2.renderBoard();
        }
        page_2.init();
        posts_14.default();
        ui_11.default();
        mod_3.default();
    }
    start().catch(err => {
        alert(err.message);
        throw err;
    });
});

//# sourceMappingURL=maps/main.js.map
