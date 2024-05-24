/// <reference types="node" />
import { Events, User, RequestMethod, Server, ServerIcon, ServerAttribute, ServerVersion, ServerStartPermissions, CustomAPIInterface } from "./lib/types";
declare class EventEmitter {
    private events;
    on(event: Events, listener: Function): void;
    emit(event: string, ...args: any[]): void;
    off(event: string, listener: Function): void;
}
declare class CubedCraft {
    private cookie;
    private token;
    user: User;
    private verbose;
    event: EventEmitter;
    customAPI: CustomAPIInterface;
    constructor(customAPI?: CustomAPIInterface);
    /**
     *
     * @param url The URL to request
     * @param method The request method
     * @param headers The request headers
     * @param body The request body
     * @returns
     */
    request(url: string, method: RequestMethod, headers: Record<string, string>, body?: any): Promise<import("node-fetch").Response>;
    private verboseLog;
    /**
     * @param username The username to log in with
     * @param password The password to log in with
     * @param verbose Whether to log verbose messages
     * @returns Returns user data if successful, throws an error if not
     */
    login({ username, password, verbose, }: {
        username: any;
        password: any;
        verbose?: boolean | undefined;
    }): Promise<User>;
    /**
     * Returns your CubedCraft user data if logged in,
     * if not logged in, throws an error
     *
     * A "resource intensive" task depending on your internet speed
     * and the CubedCraft API response time
     * overall, not recommended to run occasionally
     *
     * Customizable however, and can be changed to whatever URL you want.
     */
    getUserData(uuid?: string): Promise<User>;
    /**
     * Returns your CubedCraft servers if logged in,
     * if not logged in, throws an error
     */
    getServers(): Promise<Server[]>;
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
    selectServer(id: any): Promise<Server>;
    private setServerAttribute;
    /**
     * Sets the MOTD of the selected server
     * @param motd The MOTD to set
     * @returns
     */
    setMOTD(motd: string): Promise<{
        attribute: ServerAttribute;
        value: any;
    }>;
    /**
     * Sets the version of the selected server
     * @param version The version to set
     * @returns
     */
    setVersion(version: ServerVersion): Promise<{
        attribute: ServerAttribute;
        value: any;
    }>;
    /**
     * Sets the icon of the selected server
     * @param icon The icon to set
     * @returns
     */
    setIcon(icon: ServerIcon): Promise<{
        attribute: ServerAttribute;
        value: any;
    }>;
    /**
     * Sets the visibility of the selected server
     * @param visible The visibility to set
     * @returns
     */
    setVisible(visible: boolean): Promise<{
        attribute: ServerAttribute;
        value: any;
    }>;
    setPermission(whoCanStart: ServerStartPermissions): Promise<{
        attribute: ServerAttribute;
        value: any;
    }>;
    /**
     * Stops the selected server
     * @returns
     */
    stopServer(): Promise<{
        attribute: ServerAttribute;
        value: any;
    }>;
    /**
     * Executes a command on the selected server
     * @param command The command to execute
     * @returns The command executed
     */
    executeCommand(command: string, silent?: boolean): Promise<{
        command: string;
    }>;
    getFiles(path: string): Promise<any>;
    downloadFile(path: string, name: string): Promise<Buffer>;
    downloadFolder(path: string, name: string): Promise<Buffer>;
    /**
     * Creates a file to the selected server
     * @param path The path to the file to create
     * @param content The content to create
     * @param name The name of the file to create
     * @returns
     */
    createFile(path: string, name: string, file: string): Promise<{
        path: string;
        file: string;
    }>;
    editFile(path: string, name: string, file: string): Promise<{
        path: string;
        file: string;
    }>;
    createServer(name: string, version: ServerVersion): Promise<{
        name: string;
        version: ServerVersion;
    }>;
    /**
     * Installs a plugin to the selected server
     * @param name The name of the plugin to install
     * @returns The name of the plugin installed, throws an error if it fails
     */
    installPlugin(name: string): Promise<{
        name: string;
        error?: undefined;
    } | {
        name: string;
        error: string;
    }>;
    /**
     * Installs multiple plugins to the selected server
     * @param names The names of the plugins to install
     */
    installPlugins(names: string[]): Promise<void>;
    /**
     * Uninstalls a plugin from the selected server
     * @param name The name of the plugin to uninstall
     * @returns The name of the plugin uninstalled, throws an error if it fails
     */
    uninstallPlugin(name: string): Promise<{
        name: string;
        error?: undefined;
    } | {
        name: string;
        error: string;
    }>;
    /**
     * Uninstalls multiple plugins from the selected server
     * @param names The names of the plugins to uninstall
     */
    uninstallPlugins(names: string[]): Promise<void>;
    getCommands(): Promise<string[] | Error>;
    addBoostCommand(command: string): Promise<Error | {
        command: string;
    }>;
    removeBoostCommand(id: any): Promise<Error | {
        id: any;
    } | undefined>;
    addVoteCommand(command: string): Promise<Error | {
        command: string;
    }>;
    removeVoteCommand(id: any): Promise<Error | {
        id: any;
    } | undefined>;
    generateFTPUser(): Promise<Error | {
        action: string;
        host: string | string[] | undefined;
        port: number;
        username: string;
        password: string;
    }>;
    addManager(user: string): Promise<Error | {
        user: string;
    }>;
    removeManager(id: any): Promise<Error | {
        id: any;
    }>;
    getManagers(): Promise<Error | {
        name: string;
        pid: number;
    }[]>;
    getManager(id: any): Promise<Error | {
        name: string;
        pid: number;
    }>;
    getMOTD(): Promise<string | string[] | Error | undefined>;
    getVersion(): Promise<string | string[] | Error | undefined>;
    getIcon(): Promise<string | string[] | Error | undefined>;
    getVisibility(): Promise<string | string[] | Error | undefined>;
    getPermissions(): Promise<string | string[] | Error | undefined>;
    private getEndpoint;
}
export default CubedCraft;
