require("@babel/register");
require("@babel/polyfill/noConflict");
import { startServer } from '../../src/server';

module.exports = async () => {
    global.httpServer = await startServer();
}
