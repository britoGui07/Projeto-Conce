import {CarroRepository} from "../repositories/carroRepository"
import {EstoqueRepository} from "../repositories/estoqueRepository"
import {NotaFiscalRepository} from "../repositories/notaFiscalRepository"
import {Carro} from "../models/carro"

export class CarroService{
    private carroRepository = CarroRepository.getInstance()
    private estoqueRepository = EstoqueRepository.getInstance()
    private notaFiscalRepository = NotaFiscalRepository.getInstance()

    async cadastrarCarro(data: any): Promise<Carro>{
        if(!data.marca || !data.modelo || !data.ano || !data.placa || !data.preco || !data.cor) throw new Error ("Campos obrigatórios ausentes!")
        
        if(data.ano < 1950 || data.ano > new Date().getFullYear()+1) throw new Error("Ano inválido!")
        if(data.preco <= 0) throw new Error("Preço deve ser um valor maior que zero!")
        

        const placaExistente = await this.carroRepository.buscarPelaPlaca(data.placa)
        if(placaExistente) throw new Error("Placa já cadastrada! Não é permitido cadastrar dois carros com a mesma placa")
        
        const carro = new Carro(null, data.marca, data.modelo, data.ano, data.placa, data.preco, data.cor)
        return this.carroRepository.inserirCarro(carro)
    }

    async mostrarTodos(): Promise<Carro[]>{
        return this.carroRepository.mostrarTodos()
    }

    async buscarPorId(id: number): Promise<Carro> {
        const carro = await this.carroRepository.buscarPorId(id)
        if (!carro) throw new Error("Carro não encontrado!")
        return carro
    }

    async listarDisponiveis(): Promise<Carro[]> {
        const ids = await this.estoqueRepository.buscarCarrosDisponiveis()
        const carros = await Promise.all(ids.map((id: number) => this.carroRepository.buscarPorId(id)))
        return carros.filter((c: Carro | null) => c !== null) as Carro[]
    }

    async atualizarCarro(id: number, data: any): Promise<Carro> {
        const carro = await this.carroRepository.buscarPorId(id)
        if (!carro) throw new Error("Carro não encontrado!")

        if (!data.marca || !data.modelo || !data.placa || !data.cor) throw new Error("Campos obrigatórios ausentes!")
        if (!data.ano || !data.preco) throw new Error("Campos obrigatórios ausentes!")

        if (data.ano < 1950 || data.ano > new Date().getFullYear() + 1) throw new Error("Ano inválido!")
        if (data.preco <= 0) throw new Error("Preço deve ser maior que zero!")

        const placaExistente = await this.carroRepository.buscarPelaPlaca(data.placa)
        if (placaExistente && placaExistente.id_carro !== id) throw new Error("Placa já cadastrada!")

        const carroAtualizado = new Carro(id, data.marca, data.modelo, data.ano, data.placa, data.preco, data.cor)
        const resultado = await this.carroRepository.atualizarCarro(id, carroAtualizado)
        if (!resultado) throw new Error("Carro não encontrado!")
        return resultado
    }

    async removerCarro(id: number): Promise<Carro> {
        const carro = await this.carroRepository.buscarPorId(id)
        if (!carro) throw new Error("Carro não encontrado!")

        const estoque = await this.estoqueRepository.buscarPorIdCarro(id)
        if (estoque) throw new Error("Não é possível remover um carro que possui registro em estoque!")

        const nota = await this.notaFiscalRepository.buscarPorIdCarro(id)
        if (nota) throw new Error("Não é possível remover um carro que possui nota fiscal vinculada!")

        await this.carroRepository.removerCarro(id)
        return carro
    }
}