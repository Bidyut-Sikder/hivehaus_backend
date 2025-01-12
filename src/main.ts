/* eslint-disable @typescript-eslint/no-unused-vars */
import {Server} from 'http'
import mongoose from 'mongoose';
import config from './app/config/config';
import app from './app';

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_url as string)

        server = app.listen(config.port, () => {
            console.log(`Workspace is listing on port ${config.port}`);
        })
        console.log('Mongodb is connected');
        
    } catch (error) {
        console.log(error);  
    } 
} 
     

main()      