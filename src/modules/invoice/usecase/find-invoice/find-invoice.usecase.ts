import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const result = await this._invoiceRepository.find(input.id);

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      address: {
        street: result.address._street,        
        number: result.address._number,
        complement: result.address._complement,
        city: result.address._city,
        state: result.address._state,
        zipCode: result.address._zipCode,        
      },
      items: result.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: result.totalPrice(),
      createdAt: result.createdAt,
    }
  }

}