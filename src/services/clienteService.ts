import {Cliente} from "../models/cliente"
import {ClienteRepository} from "../repositories/clienteRepository"

export class ClienteService{
    private repository: ClienteRepository

    constructor(){
        this.repository = ClienteRepository.getInstance()
    }

    async cadastrarCliente(dados: any): Promise<{status: number, body: any}> {
        if(!dados.nome || !dados.cpf || !dados.telefone){
            return {status: 400, body: {erro: "Campos obrigatórios: nome, cpf e telefone"}}
        }

        const cpfExistente = await this.repository.buscarPorCPF(dados.cpf)
        if(cpfExistente){
            return { status : 409, body: {erro: "CPF já cadastrado no sistema"}}
        }

        const novoCliente = new Cliente(null, dados.nome, dados.cpf, dados.telefone, dados.email, dados.cidade)
        const resultado = await this.repository.inserirCliente(novoCliente)
        return { status: 201, body: resultado}
    }

    async listarCliente(): Promise<{ status: number, body: any}> {
        const clientes = await this.repository.mostrarTodos()
        return {status: 200, body: clientes}
    }

    async buscarClientePorId(id:number): Promise<{ status: number, body: any}> {
        const cliente = await this.repository.buscarPorId(id)
        if(!cliente){
            return { status: 404, body: { erro: "Cliente não encontrado"}}
        }
        return { status: 200, body: cliente}
    }

    async atualizarCliente(id:number, dados:any): Promise<{ status: number, body: any}> {
       const clienteExistente = await this.repository.buscarPorId(id)
       if(!clienteExistente){
        return {status : 404, body: {erro: "Cliente não encontrado"}}
       } 
       if (dados.cpf && dados.cpf!==clienteExistente.cpf){
        const cpfExistente= await this.repository.buscarPorCPF(dados.cpf)
        if(cpfExistente){
            return { status: 409, body: {erro: "CPF já cadastrado no sistema"}}
        }
    }

    const clienteAtualizado = new Cliente(
        id,
        dados.nome ?? clienteExistente.nome,
        dados.cpf ?? clienteExistente.cpf,
        dados.telefone ?? clienteExistente.telefone,
        dados.email ?? clienteExistente.email,
        dados.cidade ?? clienteExistente.cidade)
        
        const resultado = await this.repository.atualizarCliente(id, clienteAtualizado)
        return { status: 200, body: resultado}
    }
    
    async removerCliente(id:number): Promise<{status: number, body: any}> {
        const cliente = await this.repository.buscarPorId(id)
        if(!cliente){
            return { status: 404, body: {erro: "Cliente não encontrado"}}
    }
    
    const possuiNotas = await this.repository.clientePossuiNotas(id)
    if(possuiNotas) {
        return { status: 422, body: {erro: "Cliente possui notas fiscais vinculadas e não pode ser removido"}}
    }
    
  await this.repository.removerCliente(id)
        return { status: 200, body: cliente }
    }

    async listarNotasDoCliente(id: number): Promise<{ status: number, body: any }>{
        // verifica se cliente existe
        const cliente = await this.repository.buscarPorId(id)
        if (!cliente) {
            return { status: 404, body: { erro: "Cliente não encontrado"}}
        }

        const notas = await this.repository.listarNotasPorCliente(id)
        return { status: 200, body: notas }
    }
}