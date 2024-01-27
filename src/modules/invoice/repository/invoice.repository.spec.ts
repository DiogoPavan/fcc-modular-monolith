import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "./invoice.model"
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoiceItems.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Invoice repository unit test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel])
    await sequelize.sync()
  });

  afterEach(async () => {
    await sequelize.close()
  });

  it("should generate an invoice", async () => {
    const invoiceItems = [
      new InvoiceItems({
        id: new Id("1"),
        name: "Invoice Item 1",
        price: 2,
      }),
      new InvoiceItems({
        id: new Id("2"),
        name: "Invoice Item 2",
        price: 2,
      })
    ]
    
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "12334556",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      ),
      items: invoiceItems,
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceGenerated = await InvoiceModel.findOne({ where: { id: "1" } })

    expect(invoiceGenerated).toBeDefined();
    expect(invoiceGenerated).toMatchObject({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipcode: invoice.address.zipCode,
      items: [{
        id: "1",
        name: "Invoice Item 1",
        price: 2,
      }, {
        id: "2",
        name: "Invoice Item 2",
        price: 2,
      }],
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    })
  });

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create({
      id: '1',
      name: 'Lucian',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",  
      items: [{
        id: "1",
        name: "Invoice Item 1",
        price: 2,
      }, {
        id: "2",
        name: "Invoice Item 2",
        price: 2,
      }],   
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id);

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipcode)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
  });
})