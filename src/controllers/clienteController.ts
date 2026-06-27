import {Request, Response} from "express"
import * as clienteService  from "../services/clienteService"

export function criarCliente(req: Request, res:Response){
    try{
        let data= req.body
        const cliente= clienteService.cadastrarNovoCliente(data)
        res.status(201).json(cliente)
    }catch (e:unknown){
        const msg = (e as Error).message
        if (msg.includes("Já existe")) 
            return res.status(409).json ({status: "error", message: msg})
        res.status(400).json({status: "error", message: msg})
    }
}

export function atualizarCliente(req:Request, res: Response){
    try{
        let id = Number(req.params.id)
        let data= req.body
        const cliente = clienteService.atualizarCliente(id, data)
        res.status(200).json(cliente)
    }catch (e: unknown){
        const msg = (e as Error).message
        if(msg.includes("não encontrado")) return res.status(404).json({status:"error", message: msg})
        if(msg.includes("já cadastrado")) return res.status(409).json({status:"error", message: msg})
        res.status(400).json({status:"error", message: msg})
    }
}
export function listarTodosClientes(req: Request, res:Response){
    try{
        const clientes = clienteService.mostrarTodos()
        res.status(200).json(clientes)
    }catch(e:unknown){
        res.status(500).json({status:"error",message:(e as Error).message})
    }
}
export function buscarCliente(req:Request, res:Response){
    try{
        let id = Number(req.params.id)
        const cliente = clienteService.filtrarPorID(id)
        res.status(200).json(cliente)
    }catch (e:unknown){
        res.status(404).json({status:"error", message: (e as Error). message})
    }
}
export function listarNotasDoCliente(req:Request, res:Response){
    try{
        let id = Number(req.params.id)
        const notas = clienteService.listarNotasDoCliente(id)
        res.status(200).json (notas)
    } catch (e:unknown){
        const msg = (e as Error).message
        if(msg.includes("não encontrado")) return res.status(404).json({status:"error", message: msg})
            res.status(400).json({status:"error", message: msg})
    }
}

export function removerCliente(req: Request, res:Response){
    try{
        let id= Number(req.params.id)
        clienteService.removerCliente(id)
        res.status(200).json({message: "Cliente removido com sucesso!"})
    }catch (e:unknown){
        const msg = (e as Error).message
        if(msg.includes("não encontrado")) return res.status(404).json({status:"error", message: msg})
        if(msg.includes("nota fiscal vinculada")) return res.status(422).json({status:"error", message: msg})
        res.status(400).json ({status:"error", message: msg})
    }
}

