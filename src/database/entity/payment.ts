import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable } from "typeorm";
import { User } from './user';

@Entity({ name: 'payment' })
export class Payment extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  cardNumber: string;

  @Column()
  cvv: string;

  @Column()
  placeHolderName: string;

  @Column()
  receiver: string;

  @Column()
  expirationDate: string;

  @ManyToOne(() => User, (user: User) => user.payments, { onDelete: 'CASCADE' })
  user: User | undefined;


}