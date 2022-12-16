import {Logger} from '../types/common.types';
import chalk from 'chalk';
class itLogger implements Logger {
    info = (module: string, message: string, params?: Object ) => {
        params? params = `with params : ${JSON.stringify(params)}` : params = '';
        console.log(`${chalk.magenta(module)} ${chalk.cyan(message)} ${chalk.green(params)}`);
    }
    error = (module: string, message: string, err: any) => {
        console.log(`${chalk.red(module)} ${chalk.red(message)} ${chalk.yellow(JSON.stringify(err))}`);
    }
}

const logger = new itLogger();
export default logger;