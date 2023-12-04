import { Column, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Index("user_id", ["userId", "tourDate"], { unique: true })
@Entity("tour_reservation", { schema: "zz_tour" })
export class TourReservation {
  @Column("varchar", { primary: true, name: "id", length: 12 })
  id: string;

  @Column("varchar", { name: "user_id", length: 12 })
  userId: string;

  @Column("date", { name: "tour_date" })
  tourDate: string;

  @Column("tinyint", { name: "approval", default: () => "'0'" })
  approval: number;

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

  @ManyToOne(() => User, (user) => user.tourReservations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
