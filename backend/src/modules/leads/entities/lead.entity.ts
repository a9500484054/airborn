/**
 * Lead Entity
 * Represents a lead from the landing page contact form
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum LeadStatus {
  NEW = 'new',
  PROCESSED = 'processed',
  CLOSED = 'closed',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
