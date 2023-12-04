import { Column, Entity, Index, OneToMany, UpdateDateColumn } from "typeorm";
import { TourReservation } from "./TourReservation";

@Index("email_UNIQUE", ["email"], { unique: true })
@Index("name_UNIQUE", ["username"], { unique: true })
@Entity("user", { schema: "zz_tour" })
export class User {
  @Column("varchar", { primary: true, name: "id", length: 12 })
  id: string;

  @Column("varchar", { name: "username", unique: true, length: 20 })
  username: string;

  @Column("varchar", { name: "email", unique: true, length: 45 })
  email: string;

  @Column("varchar", { name: "pwd_hash", length: 45 })
  pwdHash: string;

  @Column("datetime", {
    name: "created_dt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDt: Date | null;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_dt",
    default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"
  })
  updatedDt: Date | null;

  @OneToMany(() => TourReservation, (tourReservation) => tourReservation.user)
  tourReservations: TourReservation[];
}
