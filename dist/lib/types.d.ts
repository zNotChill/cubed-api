export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
export interface Endpoints {
    "login": string;
    "dashboard": string;
    "account": string;
    "console": string;
    "properties": string;
    "queries": string;
}
export interface User {
    servers: Server[];
    selected_server: any;
    uuid: string;
    simple_uuid: string;
    uuid_array: number[];
    username: string;
    activity: {
        online: boolean;
        first_join: number;
        last_join: number;
        first_join_formatted: string;
        last_join_formatted: string;
        current_server: string;
    };
    points: number;
    exp: number;
    level: number;
    version: {
        protocol: number;
        name: string;
    };
    guild: string;
    ranks: {
        name: string;
        color: string;
        color_code: string;
        is_bold: boolean;
        group: string;
        visual: string;
    }[];
    minigames: {
        warzone: any;
        tntwars: any;
        xrun: any;
        bedwars: any;
        arcade: any;
        kitpvp: any;
    };
}
export type Plan = {
    "God": 12;
    "Royal": 11;
    "Noble": 10;
    "Level-6": 6;
    "Level-5": 5;
    "Level-4": 4;
    "Level-3": 3;
    "Level-2": 2;
    "Level-1": 1;
    "Free": 0;
};
export type ServerIcon = "DIAMOND" | "DIAMOND_SWORD" | "DIAMOND_CHESTPLATE" | "DIAMOND_PICKAXE" | "BOW" | "BED" | "CHEST" | "TNT" | "BEDROCK" | "MOB_SPAWNER" | "SLIME_BLOCK" | "ELYTRA" | "LADDER" | "APPLE" | "REDSTONE" | "WHEAT" | "HAY_BLOCK" | "NONE";
export interface Server {
    name: string;
    id: number;
    port: 25565;
    plan?: Plan;
    motd?: string;
    version?: string;
    icon?: ServerIcon;
    visible?: boolean;
    isOwner?: boolean;
}
export type ServerAttribute = "motd" | "version" | "icon" | "visibility" | "stop" | "who-can-start";
export type ServerVersion = "spigot-1.8" | "paper-1.8" | "spigot-1.12" | "paper-1.12" | "spigot-1.16" | "paper-1.16" | "spigot-1.17" | "paper-1.17" | "spigot-1.18" | "paper-1.18" | "spigot-1.19" | "paper-1.19" | "spigot-1.20" | "paper-1.20";
export type ServerStartPermissions = {
    "everyone": 1;
    "owner": 2;
    "friends": 3;
};
export type LevelType = "default" | "flat" | "largebiomes" | "amplified";
export type Gamemode = {
    "survival": 0;
    "creative": 1;
    "adventure": 2;
    "spectator": 3;
};
export type Difficulty = {
    "peaceful": 0;
    "easy": 1;
    "normal": 2;
    "hard": 3;
};
export type ServerManagerPermission = {
    "ADMIN": "administrator";
    "EDIT_MANAGERS": "managers.edit";
    "VIEW_FTP": "ftp.view";
    "STOP_SERVER": "server.stop";
    "VIEW_FILEMANAGER": "filemanager.view";
    "EDIT_FILEMANAGER": "filemanager.edit";
    "EDIT_PLUGINS": "plugins.edit";
    "VIEW_CONSOLE": "console.view";
    "SEND_CONSOLE_COMMANDS": "console.commands";
    "VIEW_PROPERTIES": "properties.view";
    "EDIT_PROPERTIES": "properties.edit";
    "VIEW_SETTINGS": "settings.view";
    "EDIT_SETTINGS": "settings.edit";
    "EDIT_MOTD": "settings.edit.motd";
    "EDIT_VERSION": "settings.edit.version";
    "VIEW_BOOSTERS": "boosters.view";
    "EDIT_BOOSTERS": "boosters.edit";
    "VIEW_LOGS": "log.view";
    "VIEW_PLAYERS": "players.view";
    "EDIT_WEBSITE": "website.edit";
};
export declare const ServerManagerPermissions: ServerManagerPermission;
export interface ServerProperty {
    commandBlocks: {
        name: "command_blocks";
        value: 0 | 1;
    };
    pvp: {
        name: "pvp";
        value: 0 | 1;
    };
    monsterSpawning: {
        name: "monster_spawning";
        value: 0 | 1;
    };
    animalSpawning: {
        name: "animal_spawning";
        value: 0 | 1;
    };
    allowNether: {
        name: "allow_nether";
        value: 0 | 1;
    };
    allowFlight: {
        name: "allow_flight";
        value: 0 | 1;
    };
    difficulty: {
        name: "difficulty";
        value: 0 | 1 | 2 | 3;
    };
    structures: {
        name: "structures";
        value: 0 | 1;
    };
    gamemode: {
        name: "gamemode";
        value: 0 | 1 | 2 | 3;
    };
    forceGamemode: {
        name: "force_gamemode";
        value: 0 | 1;
    };
    levelType: {
        name: "level_type";
        value: LevelType;
    };
    resourcePack: {
        name: "resource-pack";
        value: string;
    };
    generatorSettings: {
        name: "generator-settings";
        value: object;
    };
    spawnProtection: {
        name: "spawn-protection";
        value: number;
    };
    seed: {
        name: "level-seed";
        value: number;
    };
    broadcastConsoleToOps: {
        name: "broadcast-console-to-ops";
        value: boolean;
    };
    levelName: {
        name: "level-name";
        value: string;
    };
}
export type ServerPropertyValueMap = {
    [K in keyof ServerProperty]: ServerProperty[K]['value'];
};
export type Events = "login" | "motd" | "command" | "boostCommand" | "voteCommand" | "plugin" | "stop" | "file";
