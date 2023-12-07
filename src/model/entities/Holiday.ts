import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("holiday_type", ["holidayType", "holidayDate"], { unique: true })
@Entity("holiday", { schema: "zz_tour" })
export class Holiday {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "holiday_type",
    comment: "day(매주 휴일), except(특정일 제외), date(특정일 지정)",
    length: 10,
  })
  holidayType: string;

  @Column("varchar", { name: "holiday_date", length: 45 })
  holidayDate: string;
}
