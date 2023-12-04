import { Column, Entity } from "typeorm";

@Entity("id_sequence", { schema: "zz_tour" })
export class IdSequence {
  @Column("varchar", {
    primary: true,
    name: "id",
    comment: "시퀀스 id",
    length: 6,
  })
  id: string;

  @Column("int", { name: "no", comment: "시퀀스 no" })
  no: number;
}
