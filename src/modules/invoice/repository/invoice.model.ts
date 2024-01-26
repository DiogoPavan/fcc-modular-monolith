import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

type InvoiceItemsProps = {
  id: string;
  name: string;
  price: number;
}

@Table({
  tableName: "invoices",
  timestamps: true,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false, type: DataType.JSON })
  items: InvoiceItemsProps[];

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: true })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipcode: string;
}
