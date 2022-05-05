import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, JoinTable } from "typeorm";
import { Payment } from './payment';

export type UserType = "admin" | "user";


@Entity({ name: 'user' })
export class User extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column(
//     {
//     type: "enum",
//     enum: ["admin", "user"],
//     default:  "user"
// }
)
  type: "admin" | "user"

  @Column()
  phoneNumber: string;

  @Column()
  location: string;

  @OneToMany(() => Payment, (payment: Payment) => payment.user, { onDelete: 'CASCADE' })
  payments: Payment[] ;

}