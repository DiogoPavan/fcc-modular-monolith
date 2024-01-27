import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoiceItems.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

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
  items: invoiceItems,
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888",
  ),
  createdAt: new Date(),
  updatedAt: new Date(),
})

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe('Find Invoice use case unit test', () => {
  it("should find an invoice", async () => {
    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result).toEqual({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address._street,        
        number: invoice.address._number,
        complement: invoice.address._complement,
        city: invoice.address._city,
        state: invoice.address._state,
        zipCode: invoice.address._zipCode,     
      },
      items: [{
        id: "1",
        name: "Invoice Item 1",
        price: 2,
      }, {
        id: "2",
        name: "Invoice Item 2",
        price: 2,
      }],
      total: 4,
      createdAt: invoice.createdAt,
    })
  })
});