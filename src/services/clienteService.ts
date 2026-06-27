import * as clienteRepository from "../repositories/clienteRepository"
import * as notaFiscalRepository from "../repositories/notaFiscalRepository"
import { clienteData } from "../models/cliente"

export function cadastrarNovoCliente (data: clienteData){
    if(!data.nome) throw new Error ("Nome é obrigatório")
    if(!data.cpf) throw new Error ("CPF é obrigatório")
    if(!data.telefone) throw new Error ("Telefone é obrigatório")

    const cpfExistente = clienteRepository.filtrarPorCPF(data.cpf)
    if(cpfExistente) throw new Error ("Já existe cliente cadastrado com esse CPF!")
    
    return clienteRepository.cadastrarNovoCliente(data)
}

export function atualizarCliente(id:number, data: clienteData){
    const cliente = clienteRepository.filtrarPorID(id)
    if(!cliente) throw new Error ("Cliente não encontrado.")

    if(!data.nome) throw new Error ("Nome é obrigatório!")
    if(!data.cpf) throw new Error ("CPF é obrigatório!")
    if(!data.telefone) throw new Error ("Telefone é obrigatório!")
    
    const cpfExistente = clienteRepository.filtrarPorCPF(data.cpf)
    if(cpfExistente && cpfExistente.id_cliente !== id) throw new Error ("CPF já cadastrado!")
        
    return clienteRepository.atualizarCliente(id, data)
}

export function removerCliente(id: number) {
    const cliente = clienteRepository.filtrarPorID(id)
    if(!cliente) throw new Error ("Cliente não encontrado!")

    const comNotaVinculada = notaFiscalRepository.buscarPorIdCliente(id)
    if(comNotaVinculada.length > 0) throw new Error ("Não é possível remover um cliente que possuí notas fiscais vinculadas!")
    return clienteRepository.removerCliente(id)
}

export function mostrarTodos(){
    return clienteRepository.mostrarTodos()
}

export function filtrarPorID(id:number){
    const cliente = clienteRepository.filtrarPorID(id)
    if(!cliente) throw new Error ("Cliente não encontrado!")
    return cliente
}

export function filtrarPorCPF(cpf: string){
    const cliente = clienteRepository.filtrarPorCPF(cpf)
    if(!cliente) throw new Error ("Cliente não encontrado!")
    return cliente
}

export function filtrarPorNome(nome:string){
    const cliente = clienteRepository.filtrarPorNome(nome)
    if(!cliente) throw new Error ("Cliente não encontrado!")
    return cliente
}

export function listarNotasDoCliente(id: number){
    const cliente = clienteRepository.filtrarPorID(id)
    if(!cliente) throw new Error ("Não encontrado")
    return notaFiscalRepository.buscarPorIdCliente(id)
}

    