import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
      name: "Invoice 1",
      document: "132465789",
      street: "Rua A",
      number: "123",
      complement: "Apto",
      city: "Marmeleiro",
      state: "PR",
      zipCode: "85615000",
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

    const result =  await usecase.execute(input)

    expect(repository.generate).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result).toEqual({
      ...input,
      id: expect.any(String),
      total: 3
    })
  })
})