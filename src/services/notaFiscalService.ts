import {NotaFiscalRepository} from "../repositories/notaFiscalRepository"
import {ClienteRepository} from "../repositories/clienteRepository"
import {VendedorRepository} from "../repositories/vendedorRepository"
import {CarroRepository} from "../repositories/carroRepository"
import {EstoqueRepository} from "../repositories/estoqueRepository"
import {NotaFiscal} from "../models/notaFiscal"

export class NotaFiscalService{
    private notaFiscalRepository = NotaFiscalRepository.getInstance()
    private clienteRepository = ClienteRepository.getInstance()
    private vendedorRepository = VendedorRepository.getInstance()
    private carroRepository = CarroRepository.getInstance()
    private estoqueRepository = EstoqueRepository.getInstance()

    async emitirNota(data: any): Promise<NotaFiscal>{
        if(!data.numero_nota || !data.data_emissao || !data.valor_total || !data.id_cliente || !data.id_vendedor || !data.id_carro) throw new Error("Campos obrigatórios ausentes!")

        const cliente = await this.clienteRepository.buscarPorId(data.id_cliente)
        if(!cliente) throw new Error("Cliente não encontrado!")

        const vendedor = await this.vendedorRepository.buscarPorId(data.id_vendedor)
        if(!vendedor) throw new Error("Vendedor não encontrado!")

        const carro = await this.carroRepository.buscarPorId(data.id_carro)
        if(!carro) throw new Error("Carro não encontrado!")

        const notaExistente = await this.notaFiscalRepository.buscarPeloNumero(data.numero_nota)
        if(notaExistente) throw new Error("Número de nota já cadastrado!")

        const emEstoque = await this.estoqueRepository.buscarPorIdCarro(data.id_carro)
        if(!emEstoque) throw new Error("Carro não possui registro em estoque!")
        if(emEstoque.quantidade <= 0) throw new Error("Estoque do carro não disponível!")

        const dataEmissao = new Date(data.data_emissao)
        if(isNaN(dataEmissao.getTime())) throw new Error("Data de emissão inválida!")
        if(dataEmissao > new Date()) throw new Error("Data de emissão não pode ser no futuro!")

        if(data.valor_total <= 0) throw new Error("Valor total deve ser maior que zero!")

        await this.estoqueRepository.atualizarEstoque(emEstoque.id_estoque!, emEstoque.quantidade - 1, emEstoque.localizacao_patio)

        const novaNota = new NotaFiscal(null, data.numero_nota, data.data_emissao, data.valor_total, data.id_cliente, data.id_vendedor, data.id_carro)
        return this.notaFiscalRepository.inserirNota(novaNota)
    }

    async mostrarTodos(): Promise<NotaFiscal[]>{
        return this.notaFiscalRepository.mostrarTodos()
    }

    async buscarPorId(id: number): Promise<NotaFiscal>{
        const nota = await this.notaFiscalRepository.buscarPorId(id)
        if(!nota) throw new Error("Nota fiscal não encontrada!")
        return nota
    }

    async buscarPorIdCliente(id: number): Promise<NotaFiscal[]>{
        const cliente = await this.clienteRepository.buscarPorId(id)
        if(!cliente) throw new Error("Cliente não encontrado!")
        return this.notaFiscalRepository.buscarPorIdCliente(id)
    }

    async buscarPorIdVendedor(id: number): Promise<NotaFiscal[]>{
        const vendedor = await this.vendedorRepository.buscarPorId(id)
        if(!vendedor) throw new Error("Vendedor não encontrado!")
        return this.notaFiscalRepository.buscarPorIdVendedor(id)
    }
}