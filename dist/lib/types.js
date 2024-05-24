"use strict";
// Request Attributes
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAPI = exports.ServerManagerPermissions = exports.getPermissionValues = void 0;
function getPermissionValues(permissions) {
    return permissions.map(permission => ServerManagerPermissions[permission]);
}
exports.getPermissionValues = getPermissionValues;
var ServerManagerPermissions;
(function (ServerManagerPermissions) {
    ServerManagerPermissions["ADMIN"] = "administrator";
    ServerManagerPermissions["EDIT_MANAGERS"] = "managers.edit";
    ServerManagerPermissions["VIEW_FTP"] = "ftp.view";
    ServerManagerPermissions["STOP_SERVER"] = "server.stop";
    ServerManagerPermissions["VIEW_FILEMANAGER"] = "filemanager.view";
    ServerManagerPermissions["EDIT_FILEMANAGER"] = "filemanager.edit";
    ServerManagerPermissions["EDIT_PLUGINS"] = "plugins.edit";
    ServerManagerPermissions["VIEW_CONSOLE"] = "console.view";
    ServerManagerPermissions["SEND_CONSOLE_COMMANDS"] = "console.commands";
    ServerManagerPermissions["VIEW_PROPERTIES"] = "properties.view";
    ServerManagerPermissions["EDIT_PROPERTIES"] = "properties.edit";
    ServerManagerPermissions["VIEW_SETTINGS"] = "settings.view";
    ServerManagerPermissions["EDIT_SETTINGS"] = "settings.edit";
    ServerManagerPermissions["EDIT_MOTD"] = "settings.edit.motd";
    ServerManagerPermissions["EDIT_VERSION"] = "settings.edit.version";
    ServerManagerPermissions["VIEW_BOOSTERS"] = "boosters.view";
    ServerManagerPermissions["EDIT_BOOSTERS"] = "boosters.edit";
    ServerManagerPermissions["VIEW_LOGS"] = "log.view";
    ServerManagerPermissions["VIEW_PLAYERS"] = "players.view";
    ServerManagerPermissions["EDIT_WEBSITE"] = "website.edit";
})(ServerManagerPermissions || (exports.ServerManagerPermissions = ServerManagerPermissions = {}));
class CustomAPI {
}
exports.CustomAPI = CustomAPI;
CustomAPI.CubedCraft = {
    baseURI: "https://api.playerservers.com",
    userEndpoint: "player",
};
CustomAPI.zNotChill = {
    baseURI: "https://api.znotchill.me",
    userEndpoint: "api/cubed/user",
};
