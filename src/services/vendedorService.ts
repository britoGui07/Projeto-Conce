import { Vendedor } from "../models/vendedor"
import { VendedorRepository } from "../repositories/vendedorRepository"

export class VendedorService {
    private repository: VendedorRepository

    constructor() {
        this.repository = VendedorRepository.getInstance()
    }

    async cadastrarVendedor(dados: any): Promise<{ status: number, body: any }> {

        if (!dados.nome || !dados.matricula || dados.comissao_percentual === undefined) {
            return { status: 400, body: { erro: "Campos obrigatórios: nome, matricula e comissao_percentual" }}
        }

        if (dados.comissao_percentual < 0 || dados.comissao_percentual > 30) {
            return { status: 400, body: { erro: "comissao_percentual deve ser um valor entre 0 e 30" }}
        }

        const matriculaExistente = await this.repository.buscarPorMatricula(dados.matricula)
        if (matriculaExistente) {
            return { status: 409, body: { erro: "Matrícula já cadastrada no sistema" }}
        }

        const novoVendedor = new Vendedor(null, dados.nome, dados.matricula, dados.comissao_percentual)
        const resultado = await this.repository.inserirVendedor(novoVendedor)
        return { status: 201, body: resultado }
    }
    async listarVendedores(): Promise<{ status: number, body: any}>{
        const vendedores = await this.repository.mostrarTodos()
        return {status: 200, body: vendedores}
    }
    async buscarVendedorPorId(id: number): Promise <{ status: number, body: any}> {
        const vendedor = await this.repository.buscarPorId(id)
        if(!vendedor){
            return { status: 404, body: {erro: "Vendedor não encontrado"}}
        }
        return { status: 200, body: vendedor}
    }
   async atualizarVendedor(id: number, dados: any): Promise<{ status: number, body: any }> {
        const vendedorExistente = await this.repository.buscarPorId(id)
        if (!vendedorExistente) {
            return { status: 404, body: { erro: "Vendedor não encontrado" } }
        }

        if (dados.matricula && dados.matricula !== vendedorExistente.matricula) {
            const matriculaExistente = await this.repository.buscarPorMatricula(dados.matricula)
            if (matriculaExistente) {
                return { status: 409, body: { erro: "Matrícula já cadastrada no sistema" } }
            }
        }
        if (dados.comissao_percentual !== undefined) {
            if (dados.comissao_percentual < 0 || dados.comissao_percentual > 30) {
                return { status: 400, body: { erro: "comissao_percentual deve ser um valor entre 0 e 30" } }
            }
        }

        const vendedorAtualizado = new Vendedor(
            id,
            dados.nome ?? vendedorExistente.nome,
            dados.matricula ?? vendedorExistente.matricula,
            dados.comissao_percentual ?? vendedorExistente.comissao_percentual
        )

        const resultado = await this.repository.atualizarVendedor(id, vendedorAtualizado)
        return { status: 200, body: resultado }
    }
    async removerVendedor(id: number): Promise<{ status: number, body: any}> {
        const vendedor = await this.repository.buscarPorId(id)
        if(!vendedor){
            return { status: 404, body: { erro: "Vendedor não encontrado"}}
        }

        const possuiNotas = await this.repository.vendedorPossuiNotas(id)
        if(possuiNotas){
            return { status: 422, body: { erro: "Vendedor possui notas fiscais vinculadas e não pode ser removido"}}
        }

        await this.repository.removerVendedor(id)
        return { status: 200, body: vendedor}
    }

    async listarNotasPorVendedor(id: number): Promise<{ status: number, body: any}> {
        const vendedor = await this.repository.buscarPorId(id)
        if(!vendedor){
            return { status: 404, body: { erro: "Vendedor não encontrado"}}
        }

        const notas = await this.repository.listarNotasPorVendedor(id)
        return {status: 200, body: notas}
    }

}