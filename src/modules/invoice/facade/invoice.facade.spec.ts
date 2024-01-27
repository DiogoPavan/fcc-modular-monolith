import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoiceItems.entity";

describe("Invoice facade unit test", () => {

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
    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: "Invoice 1",
      document: "132465789",
      address: {
        street: "Rua A",
        number: "123",
        complement: "Apto",
        city: "Marmeleiro",
        state: "PR",
        zipCode: "85615000",
      },
      items: [{
        id: "1",
        name: "Item 1",
        price: 1,
      }, {
        id: "2",
        name: "Item 2",
        price: 2,
      }]
    }

    const invoiceGenerated = await facade.generate(input);

    expect(invoiceGenerated).toBeDefined();
    expect(invoiceGenerated).toEqual({
      ...input,
      id: expect.any(String),
      total: 3
    });
  });

  it('should find an invoice', async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "132465789",
      address: {
        street: "Rua A",
        number: "123",
        complement: "Apto",
        city: "Marmeleiro",
        state: "PR",
        zipCode: "85615000",
      },
      items: [{
        id: "1",
        name: "Item 1",
        price: 1,
      }, {
        id: "2",
        name: "Item 2",
        price: 2,
      }]
    }

    const invoiceGenerated = await facade.generate(input);

    const invoiceFound = await facade.find({ id: invoiceGenerated.id });

    expect(invoiceFound).toEqual({
      ...input,
      id: invoiceGenerated.id,
      total: 3,
      createdAt: expect.any(Object),
    });
  });
})