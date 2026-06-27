import {Request, Response} from "express"
import * as vendedorService from "../services/vendedorService"

export function criarVendedor(req: Request, res:Response){
    try{
        let data = req.body
        const vendedor = vendedorService.cadastrarNovoVendedor(data)
        res.status(201).json(vendedor)
    }catch(e:unknown){
        const msg = (e as Error).message
        if(msg.includes("já cadastrada")) return res.status(409).json({status:"error", message:msg})
        res.status(400).json({status:"error", message:msg})
    }
}

export function atualizarVendedor(req: Request, res: Response){
    try{
        let id = Number(req.params.id)
        let data = req.body
        const vendedor = vendedorService.atualizarVendedor(id, data)
        res.status(200).json(vendedor)
    }catch(e:unknown){
        const msg = (e as Error).message
        if(msg.includes("não encontrado")) return res.status(404).json({status:"error", message: msg})
        if(msg.includes("já cadastrado")) return res.status(409).json({status:"error", message: msg})
        res.status(400).json({status:"error", message:msg})
    }
}

export function listarTodosVendedores(req:Request, res:Response){
    try{
        const vendedores = vendedorService.mostrarTodos()
        res.status(200).json(vendedores)
    }catch(e:unknown){
        res.status(500).json({status:"error", message: (e as Error).message})
    }
}

export function buscarVendedor(req: Request, res:Response){
    try{
        let id = Number(req.params.id)
        const vendedor = vendedorService.buscarPorID(id)
        res.status(200).json(vendedor)
    }catch(e:unknown){
        res.status(404).json({status: "error", message: (e as Error).message})
    }
}

export function listarNotasDoVendedor(req:Request, res:Response){
    try{
        let id = Number(req.params.id)
        const notas = vendedorService.listarNotasDoVendedor(id)
        res.status(200).json(notas)
    }catch(e:unknown){
        const msg = (e as Error).message
        if(msg.includes("não encontrado")) return res.status(404).json({status:"error", message:msg})
        res.status(400).json({status:"error", message: msg})
    }
}

export function removerVendedor(req:Request, res:Response){
    try{
        let id = Number(req.params.id)
        vendedorService.removerVendedor(id)
        res.status(200).json({message: "Vendedor removido com sucesso!"})
    }catch(e:unknown){
        const msg = (e as Error).message
        if(msg.includes("não encontrado")) return res.status(404).json({status:"error", message:msg})
        if(msg.includes("nota fiscal vinculada")) return res.status(422).json({status:"error", message:msg})
        res.status(400).json({status:"error",message:msg})
    }
}