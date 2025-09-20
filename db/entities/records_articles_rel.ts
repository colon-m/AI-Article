import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn  } from "typeorm";
import type { Record } from './record';
import type { Article } from "./article";

@Entity('records_articles_rel') // 与原来的关联表名保持一致
export class RecordArticle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'datetime' })
  visit_time!: Date; // 访问时间字段

  // 关联 Record
  @ManyToOne('Record', (record:Record) => record.recordArticles)
  @JoinColumn({ name: 'record_id',referencedColumnName: "id"  })
  record!: Record;

  // 关联 Article
  @ManyToOne('Article', (article:Article) => article.recordArticles)
  @JoinColumn({ name: 'article_id',referencedColumnName: "id" })
  article!: Article;
}