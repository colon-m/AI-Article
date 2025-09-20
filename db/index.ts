import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserAuth,User,Article,Comment,UserGitMapper, Tag, Record,RecordArticle } from "./entities";

const database = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "junheng7023",
    database: "blog",
    entities: [UserAuth,User,Article,Comment,UserGitMapper,Tag,Record,RecordArticle],
    synchronize: false,
    logging: false,
});

export default async function  getDatabaseConnection() {
    if (!database.isInitialized) {
        await database.initialize();
    }
    return database;
}