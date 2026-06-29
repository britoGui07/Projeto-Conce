import {Request, Response} from "express"
import {CarroService} from "../services/carroService"

export class CarroController{
    private carroService = new CarroService()

    async criarCarro(req: Request, res: Response){
        try{
            let data = req.body
            const carro = await this.carroService.cadastrarCarro(data)
            return res.status(201).json(carro)
        }catch (e: unknown){
            const msg = (e as Error).message
            if(msg.includes("já cadastrada")) return res.status(409).json({status: "error", message: msg})
            return res.status(400).json({status: "error", message: msg})
        }
    }

    async listarTodos(req: Request, res: Response){
        try{
            const carros = await this.carroService.mostrarTodos()
            return res.status(200).json(carros)
        }catch (e: unknown){
            return res.status(500).json({status: "error", message: (e as Error).message})
        }
    }

    async buscarPorId(req: Request, res: Response){
        try{
            let id = req.params.id
            const carro = await this.carroService.buscarPorId(Number(id))
            return res.status(200).json(carro)
        }catch (e: unknown){
            return res.status(404).json({status: "error", message: (e as Error).message})
        }
    }

    async listarDisponiveis(req: Request, res: Response){
        try{
            const carros = await this.carroService.listarDisponiveis()
            return res.status(200).json(carros)
        }catch (e: unknown){
            return res.status(500).json({status: "error", message: (e as Error).message})
        }
    }

    async atualizarCarro(req: Request, res: Response){
        try{
            const carro = await this.carroService.atualizarCarro(Number(req.params.id), req.body)
            return res.status(200).json(carro)
        }catch (e: unknown) {
            const msg = (e as Error).message
            if (msg.includes("não encontrado")) return res.status(404).json({ status: "error", message: msg })
            if (msg.includes("já cadastrada")) return res.status(409).json({ status: "error", message: msg })
            return res.status(400).json({ status: "error", message: msg })
        }
    }

    async removerCarro(req: Request, res: Response){
        try{
            let id = req.params.id
            const carro = await this.carroService.removerCarro(Number(id))
            return res.status(200).json(carro)
        }catch (e: unknown){
            const msg = (e as Error).message
            if (msg.includes("não encontrado")) return res.status(404).json({status: "error", message: msg})
            return res.status(422).json({status: "error", message: msg})
        }
    }
}