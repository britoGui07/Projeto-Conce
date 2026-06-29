import {Request, Response} from "express"
import {NotaFiscalService} from "../services/notaFiscalService"

export class NotaFiscalController{
    private notaFiscalService = new NotaFiscalService()

    async emitirNota(req: Request, res: Response){
        try{
            let data = req.body
            const nota = await this.notaFiscalService.emitirNota(data)
            return res.status(201).json(nota)
        }catch(e: unknown){
            const msg = (e as Error).message
            if(msg.includes("não encontrado") || msg.includes("não encontrada")) return res.status(404).json({status: "error", message: msg})
            if(msg.includes("já cadastrado")) return res.status(409).json({status: "error", message: msg})
            if(msg.includes("não disponível") || msg.includes("futura") || msg.includes("maior que zero")) return res.status(422).json({status: "error", message: msg})
            return res.status(400).json({status: "error", message: msg})
        }
    }

    async listarTodos(req: Request, res: Response){
        try{
            const notas = await this.notaFiscalService.mostrarTodos()
            return res.status(200).json(notas)
        }catch(e: unknown){
            return res.status(500).json({status: "error", message: (e as Error).message})
        }
    }

    async buscarPorId(req: Request, res: Response){
        try{
            let id = req.params.id
            const nota = await this.notaFiscalService.buscarPorId(Number(id))
            return res.status(200).json(nota)
        }catch(e: unknown){
            return res.status(404).json({status: "error", message: (e as Error).message})
        }
    }

    async listarNotasCliente(req: Request, res: Response){
        try{
            let id = req.params.id
            const notas = await this.notaFiscalService.buscarPorIdCliente(Number(id))
            return res.status(200).json(notas)
        }catch(e: unknown){
            return res.status(404).json({status: "error", message: (e as Error).message})
        }
    }

    async listarNotasVendedor(req: Request, res: Response){
        try{
            let id = req.params.id
            const notas = await this.notaFiscalService.buscarPorIdVendedor(Number(id))
            return res.status(200).json(notas)
        }catch(e: unknown){
            return res.status(404).json({status: "error", message: (e as Error).message})
        }
    }
}