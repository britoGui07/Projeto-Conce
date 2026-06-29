import {Request, Response} from "express"
import {ClienteService} from "../services/clienteService"

const service = new ClienteService()

export async function criarCliente(req: Request, res: Response) {
    const {status, body} = await service.cadastrarCliente(req.body)
    res.status(status).json(body)
}

export async function listarTodosClientes(req: Request, res: Response) {
    const {status, body} = await service.listarCliente()
    res.status(status).json(body)
}

export async function buscarCliente(req: Request, res: Response){
    const id = Number(req.params.id)
    const { status, body} = await service.buscarClientePorId(id)
    res.status(status).json(body)
}

export async function atualizarCliente(req: Request, res: Response) {
    const id = Number(req.params.id)
    const {status, body} = await service.atualizarCliente(id, req.body)
    res.status(status).json(body)
}

export async function removerCliente(req: Request, res: Response) {
    const id = Number(req.params.id)
    const {status, body} = await service.removerCliente(id)
    res.status(status).json(body)
}

export async function listarNotasPorCliente(req: Request, res: Response){
    const id = Number  (req.params.id)
    const {status, body} = await service.listarNotasPorCliente(id)
    res.status(status).json(body)
}