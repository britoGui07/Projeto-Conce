import {Request, Response} from "express"
import {EstoqueService} from "../services/estoqueService"

export class EstoqueController{
    private estoqueService = new EstoqueService

    async criarEstoque(req: Request, res: Response){
        try{
            let data = req.body
            const estoque = await this.estoqueService.novoRegistroEstoque(data)
            return res.status(201).json(estoque)
        }catch(e: unknown){
            const msg = (e as Error).message
            if(msg.includes("já registrado")) return res.status(409).json({status: "error", message: msg})
            if(msg.includes("não encontrado")) return res.status(404).json({status: "error", message: msg})
            return res.status(400).json({status: "error", message: msg})
        }
    }

    async listarTodos(req: Request, res: Response){
        try{
            const estoques = await this.estoqueService.mostrarTodos()
            return res.status(200).json(estoques)
        }catch(e: unknown){
            return res.status(500).json({status: "error", message: (e as Error).message})
        }
    }

    async buscarPorId(req: Request, res: Response){
        try{
            let id = req.params.id
            const estoque = await this.estoqueService.buscarPorId(Number(id))
            return res.status(200).json(estoque)
        }catch(e: unknown){
            return res.status(404).json({status: "error", message: (e as Error).message})
        }
    }

    async buscarPorIdCarro(req: Request, res: Response){
        try{
            let id = req.params.id
            const estoque = await this.estoqueService.buscarPorIdCarro(Number(id))
            return res.status(200).json(estoque)
        }catch(e: unknown){
            return res.status(404).json({status: "error", message: (e as Error).message})
        }
    }

    async atualizarEstoque(req: Request, res: Response){
        try{
            let id = req.params.id
            const estoque = await this.estoqueService.atualizarEstoque(Number(id), req.body)
            return res.status(200).json(estoque)
        }catch(e: unknown){
            const msg = (e as Error).message
            if(msg.includes("não encontrado")) return res.status(404).json({status: "error", message: msg})
            return res.status(400).json({status: "error", message: msg})
        }
    }

    async removerEstoque(req: Request, res: Response){
        try{
            let id = req.params.id
            const estoque = await this.estoqueService.removerRegistroEstoque(Number(id))
            return res.status(200).json(estoque)
        }catch(e: unknown){
            const msg = (e as Error).message
            if(msg.includes("não encontrado")) return res.status(404).json({status: "error", message: msg})
            return res.status(422).json({status: "error", message: msg})
        }
    }
}