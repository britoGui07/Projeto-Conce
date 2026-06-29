import {Request, Response} from "express"
import {VendedorService} from "../services/vendedorService"

const service = new VendedorService()

export async function criarVendedor(req: Request, res: Response){
    const {status, body} = await service.cadastrarVendedor(req.body)
    res.status(status).json(body)
}

export async function listarTodosVendedores(req: Request, res: Response){
    const {status, body} = await service.listarVendedores()
    res.status(status).json(body)
}

export async function buscarVendedor(req: Request, res: Response){
    const id = Number(req.params.id)
    const {status, body} = await service.buscarVendedorPorId(id)
    res.status(status).json(body)
}

export async function atualizarVendedor(req: Request, res: Response){
    const id = Number(req.params.id)
    const {status, body} = await service.atualizarVendedor(id, req.body)
    res.status(status).json(body)
}

export async function removerVendedor(req: Request, res: Response){
    const id = Number(req.params.id)
    const {status, body} = await service.removerVendedor(id)
    res.status(status).json(body)
}

export async function listarNotasDoVendedor(req: Request, res: Response){
    const id = Number(req.params.id)
    const {status, body} = await service.listarNotasPorVendedor(id)
    res.status(status).json(body)
}