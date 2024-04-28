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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const form_data_1 = __importDefault(require("form-data"));
const safe_1 = __importDefault(require("colors/safe"));
const parse_1 = require("./lib/parse");
dotenv_1.default.config();
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    emit(event, ...args) {
        const listeners = this.events[event];
        if (listeners) {
            for (const listener of listeners) {
                listener(...args);
            }
        }
    }
    off(event, listener) {
        const listeners = this.events[event];
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }
}
class CubedCraft {
    constructor() {
        this.cookie = null;
        this.token = null;
        this.user = {};
        this.verbose = false;
        this.event = new EventEmitter();
    }
    /**
     *
     * @param url The URL to request
     * @param method The request method
     * @param headers The request headers
     * @param body The request body
     * @returns
     */
    request(url, method, headers, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                method: method,
                body: body,
                headers: Object.assign(Object.assign({}, headers), { "User-Agent": "Mozilla/5.0 (Windows NT 10.2; Win64; x64) Gecko/20130401 Firefox/46.7", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" }),
            };
            if (this.cookie && options.headers) {
                options.headers['Cookie'] = (0, parse_1.stringifyCookie)({
                    PHPSESSID: this.cookie
                });
            }
            return yield (0, node_fetch_1.default)(url, options);
        });
    }
    verboseLog(text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose === true) {
                console.log(`${safe_1.default.magenta("[Verbose]")} ${safe_1.default.magenta(text)}`);
            }
        });
    }
    /**
     * @param username The username to log in with
     * @param password The password to log in with
     * @param verbose Whether to log verbose messages
     * @returns Returns user data if successful, throws an error if not
     */
    login({ username, password, verbose = false, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.verbose = verbose;
            if (this.cookie)
                return this.user;
            const initialRequest = yield this.request(this.getEndpoint('login'), 'GET', {});
            const $ = cheerio_1.default.load(yield initialRequest.text());
            const token = $('input[name="token"]').val();
            const cookie = (0, parse_1.parseCookie)(initialRequest.headers.get('set-cookie') || '');
            this.cookie = cookie.PHPSESSID;
            this.token = token === null || token === void 0 ? void 0 : token.toString();
            const formdata = new URLSearchParams();
            formdata.append('username', username);
            formdata.append('password', password);
            formdata.append('token', this.token || '');
            const loginRequest = yield this.request(this.getEndpoint("login"), "POST", { "Content-Type": "application/x-www-form-urlencoded" }, formdata.toString());
            const loginResponse = yield loginRequest.text();
            const $2 = cheerio_1.default.load(loginResponse);
            const $user = $2("#navbar .right.menu :nth-child(1)")
                .text()
                .split(" ")[0]
                .replace(" ", "")
                .trim();
            let $uuid = (_a = $2("#navbar .right.menu :nth-child(1) img.ui.avatar.image").attr("src")) === null || _a === void 0 ? void 0 : _a.split("/")[4];
            $uuid = (0, parse_1.parseUUID)($uuid || '');
            if (!$user)
                throw new Error('Failed to login');
            this.user.username = $user;
            this.user.uuid = $uuid;
            this.verboseLog("Logged in as " + $user);
            this.event.emit("login", this.user);
            return this.user;
        });
    }
    /**
     * Returns your CubedCraft user data if logged in,
     * if not logged in, throws an error
     *
     * A "resource intensive" task depending on your internet speed
     * and the CubedCraft API response time
     * overall, not recommended to run occasionally
     */
    getUserData(uuid = this.user.uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            const userAPI = (yield this.request("https://api.znotchill.me/api/cubed/user/" + uuid, "GET", {}));
            const warzone = yield this.request("https://api.znotchill.me/api/cubed/user/" + uuid + "/warzone", "GET", {});
            const tntwars = yield this.request("https://api.znotchill.me/api/cubed/user/" + uuid + "/tntwars", "GET", {});
            const xrun = yield this.request("https://api.znotchill.me/api/cubed/user/" + uuid + "/xrun", "GET", {});
            const bedwars = yield this.request("https://api.znotchill.me/api/cubed/user/" + uuid + "/bedwars", "GET", {});
            const arcade = yield this.request("https://api.znotchill.me/api/cubed/user/" + uuid + "/arcade", "GET", {});
            const kitpvp = yield this.request("https://api.znotchill.me/api/cubed/user/" + uuid + "/kitpvp", "GET", {});
            let user = yield userAPI.json();
            let wzJson = yield warzone.json();
            let twJson = yield tntwars.json();
            let xrJson = yield xrun.json();
            let bwJson = yield bedwars.json();
            let acJson = yield arcade.json();
            let kpJson = yield kitpvp.json();
            if (user.error ||
                wzJson.error ||
                twJson.error ||
                xrJson.error ||
                bwJson.error ||
                acJson.error ||
                kpJson.error)
                throw new Error('Failed to get user data');
            this.verboseLog("Got user data, parsing");
            this.user = Object.assign(Object.assign({}, this.user), { user, minigames: {
                    warzone: wzJson,
                    tntwars: twJson,
                    xrun: xrJson,
                    bedwars: bwJson,
                    arcade: acJson,
                    kitpvp: kpJson,
                } });
            return this.user;
        });
    }
    /**
     * Returns your CubedCraft servers if logged in,
     * if not logged in, throws an error
     */
    getServers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            const accountRequest = yield this.request(this.getEndpoint('account'), 'GET', {});
            const body = yield accountRequest.text();
            const $ = cheerio_1.default.load(body);
            const servers = [];
            $(".table-responsive table.table").each((i, el) => {
                const table = $(el);
                const rows = table.find("tbody tr");
                rows.each((ind, el) => {
                    var _a;
                    const row = $(el);
                    const name = row.find("td:nth-child(1)").text().trim();
                    const plan = row.find("td:nth-child(2)").text().trim().replace(" (Change)", "");
                    const id = (_a = row.find("td:nth-child(4)")
                        .find("td a")
                        .attr("href")) === null || _a === void 0 ? void 0 : _a.split("/")[4].replace("?s=", "");
                    servers.push({
                        name,
                        id: parseInt(id),
                        port: 25565,
                        isOwner: i === 0 ? true : false,
                    });
                });
                this.user.servers = servers;
            });
            this.verboseLog("Got servers, parsing");
            return this.user.servers;
        });
    }
    /**
     * Selects a CubedCraft server so you can interact with it
     *
     * Automatically gets your servers if you have not already
     *
     * If not logged in, throws an error
     *
     * If you do not have access to the server, throws an error
     * @param id The server ID to select
     */
    selectServer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            let server;
            const servers = yield this.getServers();
            if (!servers)
                throw new Error('No servers found');
            if (parseInt(id))
                server = servers.find((s) => s.id === parseInt(id));
            else
                server = servers.find((s) => s.name === id);
            if (!server)
                throw new Error('Invalid server ID');
            const request = yield this.request(this.getEndpoint('dashboard') + `?s=${server.id}`, 'GET', {});
            const body = yield request.text();
            const $ = cheerio_1.default.load(body);
            let serverData = {
                name: '',
                id: 0,
                port: 25565,
                motd: '',
                version: '',
                icon: "NONE",
                visible: false,
                isOwner: false,
            };
            const motd = $(".card-body form:nth-child(1) input[name='server-motd']").val();
            const version = $(".card-body form:nth-child(2) select[name='server-version']").val();
            const icon = $(".card-body form:nth-child(3) select[name='server-icon']").val();
            const visibility = $(".card-body form:nth-child(4) select[name='server-visibility']").val();
            serverData.name = server.name;
            serverData.id = server.id;
            serverData.motd = motd === null || motd === void 0 ? void 0 : motd.toString();
            serverData.version = version === null || version === void 0 ? void 0 : version.toString();
            serverData.icon = icon === null || icon === void 0 ? void 0 : icon.toString();
            serverData.visible = (visibility === null || visibility === void 0 ? void 0 : visibility.toString()) === "1" ? true : false;
            serverData.isOwner = true;
            this.user.selected_server = serverData;
            this.verboseLog("Selected server, parsing: " + serverData.name);
            return serverData;
        });
    }
    setServerAttribute(attribute, value) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            const post = new URLSearchParams();
            post.append("token", this.token || "");
            post.append("edit-file-sub", "Save");
            post.append("action", attribute);
            switch (attribute) {
                case "motd":
                    post.append("server-motd", value);
                    break;
                case "version":
                    post.append("server-version", value);
                    break;
                case "icon":
                    post.append("server-icon", value);
                    break;
                case "visibility":
                    post.append("server-visibility", value);
                    break;
                case "stop":
                    post.set("action", "stop");
                    break;
                case "who-can-start":
                    post.append("who-can-start", value);
                    break;
            }
            const request = yield this.request(this.getEndpoint('dashboard'), 'POST', { "Content-Type": "application/x-www-form-urlencoded" }, post);
            return {
                attribute,
                value,
            };
        });
    }
    /**
     * Sets the MOTD of the selected server
     * @param motd The MOTD to set
     * @returns
     */
    setMOTD(motd) {
        return __awaiter(this, void 0, void 0, function* () {
            this.verboseLog("Setting MOTD to " + motd);
            this.event.emit("motd", motd);
            return yield this.setServerAttribute('motd', motd);
        });
    }
    /**
     * Sets the version of the selected server
     * @param version The version to set
     * @returns
     */
    setVersion(version) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.setServerAttribute('version', version);
        });
    }
    /**
     * Sets the icon of the selected server
     * @param icon The icon to set
     * @returns
     */
    setIcon(icon) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.setServerAttribute('icon', icon);
        });
    }
    /**
     * Sets the visibility of the selected server
     * @param visible The visibility to set
     * @returns
     */
    setVisible(visible) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.setServerAttribute('visibility', visible ? 1 : 0);
        });
    }
    setPermission(whoCanStart) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.setServerAttribute('who-can-start', whoCanStart);
        });
    }
    /**
     * Stops the selected server
     * @returns
     */
    stopServer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.event.emit("stop");
            return yield this.setServerAttribute("stop");
        });
    }
    /**
     * Executes a command on the selected server
     * @param command The command to execute
     * @returns The command executed
     */
    executeCommand(command, silent) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            const post = new URLSearchParams();
            post.append("sendcmd", command);
            const request = yield this.request(this.getEndpoint('console'), 'POST', { "Content-Type": "application/x-www-form-urlencoded" }, post);
            if (!silent)
                this.event.emit("command", command);
            return {
                command,
            };
        });
    }
    getFiles(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `/filemanager?dir=${path}`, 'GET', {});
            const request = yield this.request(this.getEndpoint('queries') + `/list_files/?dir=${path}`, 'GET', {});
            const body = yield request.text();
            return JSON.parse(body);
        });
    }
    downloadFile(path, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const request = yield this.request(this.getEndpoint('dashboard') + `/filemanager/&action=download&type=file&name=${name}&download=/${path}/${name}&dir=${path}`, 'GET', {});
            const body = yield request.buffer();
            return body;
        });
    }
    downloadFolder(path, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const request = yield this.request(this.getEndpoint('dashboard') + `/filemanager/&action=download&type=folder&name=${name}&download=/${path}/${name}&dir=${path}`, 'GET', {});
            const body = yield request.buffer();
            return body;
        });
    }
    /**
     * Creates a file to the selected server
     * @param path The path to the file to create
     * @param content The content to create
     * @param name The name of the file to create
     * @returns
     */
    createFile(path, name, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `/filemanager/?action=new&dir=${path}`, 'GET', {});
            const existingFile = yield this.request(this.getEndpoint('dashboard') + `/filemanager/?action=edit&medit=${path}/${name}&dir=${path}`, 'GET', {});
            const $ = cheerio_1.default.load(yield refresh.text());
            let editToken = $('input[name="token"]').val();
            const $2 = cheerio_1.default.load(yield existingFile.text());
            let existingName = $2("input#edit-file-name").val();
            if (existingName)
                return this.editFile(path, name, file);
            const post = new form_data_1.default();
            post.append("edit-file-name", name.split(".")[0]);
            post.append("ext", name.split(".")[1]);
            post.append("edit-file-content", file);
            post.append("token", editToken || "");
            post.append("edit-file-sub", "Submit");
            const request = yield this.request(this.getEndpoint('dashboard') + `/filemanager/?action=new&dir=${path}`, 'POST', {
                "Content-Type": "multipart/form-data; boundary=" + post.getBoundary(),
            }, post);
            this.event.emit("file", {
                path,
                file,
                name
            });
            return {
                path,
                file
            };
        });
    }
    editFile(path, name, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `/filemanager/?action=edit&medit=${path}/${name}&dir=${path}`, 'GET', {});
            const $ = cheerio_1.default.load(yield refresh.text());
            let editToken = $('input[name="token"]').val();
            const post = new form_data_1.default();
            post.append("edit-file-name", name);
            post.append("edit-file-content", file);
            post.append("token", editToken || "");
            post.append("edit-file-sub", "Submit");
            console.log(post);
            const request = yield this.request(this.getEndpoint('dashboard') + `/filemanager/?action=edit&medit=${path}/${name}&dir=${path}`, 'POST', {
                "Content-Type": "multipart/form-data; boundary=" + post.getBoundary(),
            }, post);
            this.event.emit("file", {
                path,
                file,
                name
            });
            return {
                path,
                file
            };
        });
    }
    // TODO: Finish
    createServer(name, version) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            const post = new form_data_1.default();
            post.append("token", this.token || "");
            post.append("name", name);
            post.append("version", version);
            const request = yield this.request(this.getEndpoint('account') + "/new", 'POST', {}, post);
            const body = yield request.text();
            const $ = cheerio_1.default.load(body);
            if (name.length < 3)
                throw new Error('Server name must be at least 3-16 characters long and can only contain letters and numbers');
            if (body.includes("Another server already has this name!"))
                throw new Error('Server name already taken');
            if (body.includes("Invalid server name"))
                throw new Error('Invalid server name (must be 3-16 characters long and can only contain letters and numbers)');
            return {
                name,
                version,
            };
        });
    }
    /**
     * Installs a plugin to the selected server
     * @param name The name of the plugin to install
     * @returns The name of the plugin installed, throws an error if it fails
     */
    installPlugin(name) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            // no post request??? thank you cubedcraft
            const request = yield this.request(this.getEndpoint('dashboard') + `/plugins/?install=${name}`, 'GET', {});
            const body = yield request.text();
            if (body === "OK") {
                this.event.emit("plugin", {
                    action: "install",
                    name,
                });
                return {
                    name,
                };
            }
            else {
                return {
                    name,
                    error: "Failed to install plugin, is it already installed?"
                };
            }
        });
    }
    /**
     * Installs multiple plugins to the selected server
     * @param names The names of the plugins to install
     */
    installPlugins(names) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            names.forEach((plugin) => {
                this.installPlugin(plugin);
            });
        });
    }
    /**
     * Uninstalls a plugin from the selected server
     * @param name The name of the plugin to uninstall
     * @returns The name of the plugin uninstalled, throws an error if it fails
     */
    uninstallPlugin(name) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            // no post request??? thank you cubedcraft
            const request = yield this.request(this.getEndpoint('dashboard') + `/plugins/?remove=${name}`, 'GET', {});
            const body = yield request.text();
            if (body === "OK") {
                this.event.emit("plugin", {
                    action: "uninstall",
                    name,
                });
                return {
                    name,
                };
            }
            else {
                return {
                    name,
                    error: "Failed to uninstall plugin, is it installed?"
                };
            }
        });
    }
    /**
     * Uninstalls multiple plugins from the selected server
     * @param names The names of the plugins to uninstall
     */
    uninstallPlugins(names) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            names.forEach((plugin) => {
                this.uninstallPlugin(plugin);
            });
        });
    }
    setServerProperties(properties) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                throw new Error('Not logged in');
            if (!this.user.selected_server)
                throw new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            const post = new form_data_1.default();
            post.append("token", this.token || "");
            post.append("action", "properties");
            for (const key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                }
            }
            console.log(post);
            /// gibbiemonster was here
            const request = yield this.request(this.getEndpoint('properties'), 'POST', {}, post);
            return {
                properties,
            };
        });
    }
    getCommands() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                return new Error('Not logged in');
            if (!this.user.selected_server)
                return new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'GET', {});
            const body = yield request.text();
            const $ = cheerio_1.default.load(body);
            const commands = [];
            $(".input-group.mb-3").each((i, el) => {
                var _a, _b;
                const row = $(el);
                const command = (_a = row.find("input#inputCommand").val()) === null || _a === void 0 ? void 0 : _a.toString();
                const id = (_b = row.find("input#id").attr("id")) === null || _b === void 0 ? void 0 : _b.toString();
            });
            return commands;
        });
    }
    addBoostCommand(command) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                return new Error('Not logged in');
            if (!this.user.selected_server)
                return new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            const post = new form_data_1.default();
            post.append("token", this.token || "");
            post.append("action", "new_boost_command");
            post.append("new_command", command);
            const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'POST', {}, post);
            this.event.emit("boostCommand", {
                action: "add",
                command,
            });
            return {
                command,
            };
        });
    }
    removeBoostCommand(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                return new Error('Not logged in');
            if (!this.user.selected_server)
                return new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            if (parseInt(id)) {
                const post = new form_data_1.default();
                post.append("token", this.token || "");
                post.append("action", "delete_boost_command");
                post.append("id", id);
                const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'POST', {}, post);
                this.event.emit("boostCommand", {
                    action: "remove",
                    id,
                });
                return {
                    id,
                };
            }
            const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'GET', {});
            const $ = cheerio_1.default.load(yield request.text());
            $("#inputCommand").each((i, el) => {
                var _a, _b, _c;
                const parent = $(el).parent();
                const commandId = (_a = parent.find("input[name=id]").val()) === null || _a === void 0 ? void 0 : _a.toString();
                const command = (_b = parent.find("input#inputCommand").val()) === null || _b === void 0 ? void 0 : _b.toString();
                const action = (_c = parent.find("input[value=delete_boost_command]").val()) === null || _c === void 0 ? void 0 : _c.toString();
                if (command === id && action === "delete_boost_command") {
                    const post = new form_data_1.default();
                    post.append("token", this.token || "");
                    post.append("action", "delete_boost_command");
                    post.append("id", commandId);
                    (() => __awaiter(this, void 0, void 0, function* () {
                        const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'POST', {}, post);
                        this.event.emit("boostCommand", {
                            action: "remove",
                            id,
                        });
                        return {
                            id,
                        };
                    }))();
                }
            });
        });
    }
    addVoteCommand(command) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                return new Error('Not logged in');
            if (!this.user.selected_server)
                return new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            const post = new form_data_1.default();
            post.append("token", this.token || "");
            post.append("action", "new_vote_command");
            post.append("new_command", command);
            const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'POST', {}, post);
            this.event.emit("voteCommand", {
                action: "add",
                command,
            });
            return {
                command,
            };
        });
    }
    removeVoteCommand(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cookie)
                return new Error('Not logged in');
            if (!this.user.selected_server)
                return new Error('No server selected');
            const refresh = yield this.request(this.getEndpoint('dashboard') + `?s=${(_a = this.user.selected_server) === null || _a === void 0 ? void 0 : _a.id}`, 'GET', {});
            if (parseInt(id)) {
                const post = new form_data_1.default();
                post.append("token", this.token || "");
                post.append("action", "delete_vote_command");
                post.append("id", id);
                const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'POST', {}, post);
                this.event.emit("voteCommand", {
                    action: "remove",
                    id,
                });
                return {
                    id,
                };
            }
            const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'GET', {});
            const $ = cheerio_1.default.load(yield request.text());
            $("#inputCommand").each((i, el) => {
                var _a, _b, _c;
                const parent = $(el).parent();
                const commandId = (_a = parent.find("input[name=id]").val()) === null || _a === void 0 ? void 0 : _a.toString();
                const command = (_b = parent.find("input#inputCommand").val()) === null || _b === void 0 ? void 0 : _b.toString();
                const action = (_c = parent.find("input[value=delete_vote_command]").val()) === null || _c === void 0 ? void 0 : _c.toString();
                if (command === id && action === "delete_vote_command") {
                    const post = new form_data_1.default();
                    post.append("token", this.token || "");
                    post.append("action", "delete_vote_command");
                    post.append("id", commandId);
                    (() => __awaiter(this, void 0, void 0, function* () {
                        const request = yield this.request(this.getEndpoint('dashboard') + "/settings", 'POST', {}, post);
                        this.event.emit("voteCommand", {
                            action: "remove",
                            id,
                        });
                        return {
                            id,
                        };
                    }))();
                }
            });
        });
    }
    getEndpoint(endpoint) {
        const endpoints = {
            login: 'https://playerservers.com/login',
            dashboard: 'https://playerservers.com/dashboard',
            account: 'https://playerservers.com/account',
            console: 'https://playerservers.com/queries/console_backend',
            properties: 'https://playerservers.com/dashboard/properties',
            queries: 'https://playerservers.com/queries',
        };
        return endpoints[endpoint];
    }
}
exports.CubedCraft = CubedCraft;
