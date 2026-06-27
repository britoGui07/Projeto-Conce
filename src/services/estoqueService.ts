import * as estoqueRepository from "../repositories/estoqueRepository"
import * as carroRepository from "../repositories/carroRepository"
import {estoqueData} from "../models/estoque"

export function novoRegistroEstoque(data: estoqueData){
    const carro = carroRepository.buscarPorID(data.id_carro)
    if(!carro) throw new Error("Carro não encontrado!")
    const emEstoque = estoqueRepository.buscarPorIdCarro(data.id_carro)
    if(emEstoque) throw new Error("Carro já registrado em estoque! Para atualizar a quantidade, utilize a função de atualização de estoque.")
    if(data.quantidade < 0) throw new Error("Quantidade deve ser um valor inteiro positivo!(Incluindo o zero)")
    const dataEntrada = new Date(data.data_entrada)
    if(isNaN(dataEntrada.getTime())) throw new Error("Data de entrada inválida!")
    if(dataEntrada > new Date()) throw new Error("Data de entrada não pode ser no futuro!")
    return estoqueRepository.novoRegistroEstoque(data)
}

export function atualizarEstoque(id: number, data: Partial<estoqueData>){
    const estoque = estoqueRepository.buscarPorID(id)
    if(!estoque) throw new Error("Registro de estoque não encontrado!")
    if(data.quantidade !== undefined && data.quantidade < 0) throw new Error("Quantidade deve ser um valor inteiro positivo!(Incluindo o zero)")
    if(data.data_entrada && data.data_entrada > new Date()) throw new Error("Data de entrada não pode ser no futuro!")
    
    return estoqueRepository.atualizarEstoque(id, data)
}

export function removerRegistroEstoque(id: number){
    const estoque = estoqueRepository.buscarPorID(id)
    if(!estoque) throw new Error("Registro de estoque não encontrado!")
    return estoqueRepository.removerRegistroEstoque(id)
}

export function mostrarTodos(){
    return estoqueRepository.mostrarTodos()
}

export function mostrarCarrosDisponiveis(){
    return estoqueRepository.mostrarCarrosDisponiveis()
}

export function buscarPorID(id: number){
    const estoque = estoqueRepository.buscarPorID(id)
    if(!estoque) throw new Error("Registro de estoque não encontrado!")
    return estoque
}

export function buscarPorIdCarro(id: number){
    const estoque = estoqueRepository.buscarPorIdCarro(id)
    if(!estoque) throw new Error("Registro de estoque não encontrado para o carro informado!")
    return estoque
}