import {EstoqueRepository} from "../repositories/estoqueRepository"
import {CarroRepository} from "../repositories/carroRepository"
import {Estoque} from "../models/estoque"

export class EstoqueService{
    private estoqueRepository = EstoqueRepository.getInstance()
    private carroRepository = CarroRepository.getInstance()

    async novoRegistroEstoque(data: any): Promise<Estoque>{
        if(!data.id_carro || data.quantidade === undefined || !data.localizacao_patio || !data.data_entrada) throw new Error("Campos obrigatórios ausentes!")

        const carro = await this.carroRepository.buscarPorId(data.id_carro)
        if(!carro) throw new Error("Carro não encontrado!")

        const emEstoque = await this.estoqueRepository.buscarPorIdCarro(data.id_carro)
        if(emEstoque) throw new Error("Carro já registrado em estoque!")

        if(data.quantidade < 0) throw new Error("Quantidade deve ser maior ou igual a zero!")

        const dataEntrada = new Date(data.data_entrada)
        if(isNaN(dataEntrada.getTime())) throw new Error("Data de entrada inválida!")
        if(dataEntrada > new Date()) throw new Error("Data de entrada não pode ser no futuro!")

        const novoEstoque = new Estoque(null, data.id_carro, data.quantidade, data.localizacao_patio, data.data_entrada)
        return this.estoqueRepository.inserirEstoque(novoEstoque)
    }

    async mostrarTodos(): Promise<Estoque[]>{
        return this.estoqueRepository.mostrarTodos()
    }

    async buscarPorId(id: number): Promise<Estoque>{
        const estoque = await this.estoqueRepository.buscarPorId(id)
        if(!estoque) throw new Error("Registro de estoque não encontrado!")
        return estoque
    }

    async buscarPorIdCarro(id: number): Promise<Estoque>{
        const carro = await this.carroRepository.buscarPorId(id)
        if(!carro) throw new Error("Carro não encontrado!")

        const estoque = await this.estoqueRepository.buscarPorIdCarro(id)
        if(!estoque) throw new Error("Nenhum registro de estoque encontrado para esse carro!")
        return estoque
    }

    async atualizarEstoque(id: number, data: any): Promise<Estoque>{
        const estoque = await this.estoqueRepository.buscarPorId(id)
        if(!estoque) throw new Error("Registro de estoque não encontrado!")

        if(data.quantidade !== undefined && data.quantidade < 0) throw new Error("Quantidade deve ser maior ou igual a zero!")

        if(data.data_entrada){
            const dataEntrada = new Date(data.data_entrada)
            if(isNaN(dataEntrada.getTime())) throw new Error("Data de entrada inválida!")
            if(dataEntrada > new Date()) throw new Error("Data de entrada não pode ser no futuro!")
        }

        const resultado = await this.estoqueRepository.atualizarEstoque(id, data.quantidade, data.localizacao_patio)
        if(!resultado) throw new Error("Registro de estoque não encontrado!")
        return resultado
    }

    async removerRegistroEstoque(id: number): Promise<Estoque>{
        const estoque = await this.estoqueRepository.buscarPorId(id)
        if(!estoque) throw new Error("Registro de estoque não encontrado!")

        await this.estoqueRepository.removerEstoque(id)
        return estoque
    }
}