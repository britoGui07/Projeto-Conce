import {Router, Request, Response} from 'express'
import {CarroController} from '../controllers/carroController'
import {EstoqueController} from '../controllers/estoqueController'
import {NotaFiscalController} from '../controllers/notaFiscalController'
import * as clienteController from '../controllers/clienteController'
import * as vendedorController from '../controllers/vendedorController'

const router = Router()

const carroController = new CarroController()
const estoqueController = new EstoqueController()
const notaFiscalController = new NotaFiscalController()

router.get('/clientes/notas/:id', (req: Request, res: Response) => {clienteController.listarNotasPorCliente(req, res)})
router.get('/clientes/:id', (req: Request, res: Response) => {clienteController.buscarCliente(req, res)})
router.get('/clientes', (req: Request, res: Response) => {clienteController.listarTodosClientes(req, res)})
router.post('/clientes', (req: Request, res: Response) => {clienteController.criarCliente(req, res)})
router.put('/clientes/:id', (req: Request, res: Response) => {clienteController.atualizarCliente(req, res)})
router.delete('/clientes/:id', (req: Request, res: Response) => {clienteController.removerCliente(req, res)})

router.get('/vendedores/notas/:id', (req: Request, res: Response) => {vendedorController.listarNotasDoVendedor(req, res)})
router.get('/vendedores/:id', (req: Request, res: Response) => {vendedorController.buscarVendedor(req, res)})
router.get('/vendedores', (req: Request, res: Response) => {vendedorController.listarTodosVendedores(req, res)})
router.post('/vendedores', (req: Request, res: Response) => {vendedorController.criarVendedor(req, res)})
router.put('/vendedores/:id', (req: Request, res: Response) => {vendedorController.atualizarVendedor(req, res)})
router.delete('/vendedores/:id', (req: Request, res: Response) => {vendedorController.removerVendedor(req, res)})

router.get('/carros/disponiveis', (req: Request, res: Response) => {carroController.listarDisponiveis(req, res)})
router.get('/carros/:id', (req: Request, res: Response) => {carroController.buscarPorId(req, res)})
router.get('/carros', (req: Request, res: Response) => {carroController.listarTodos(req, res)})
router.post('/carros', (req: Request, res: Response) => {carroController.criarCarro(req, res)})
router.put('/carros/:id', (req: Request, res: Response) => {carroController.atualizarCarro(req, res)})
router.delete('/carros/:id', (req: Request, res: Response) => {carroController.removerCarro(req, res)})

router.get('/estoque/carro/:id', (req: Request, res: Response) => {estoqueController.buscarPorIdCarro(req, res)})
router.get('/estoque/:id', (req: Request, res: Response) => {estoqueController.buscarPorId(req, res)})
router.get('/estoque', (req: Request, res: Response) => {estoqueController.listarTodos(req, res)})
router.post('/estoque', (req: Request, res: Response) => {estoqueController.criarEstoque(req, res)})
router.put('/estoque/:id', (req: Request, res: Response) => {estoqueController.atualizarEstoque(req, res)})
router.delete('/estoque/:id', (req: Request, res: Response) => {estoqueController.removerEstoque(req, res)})

router.get('/notas/:id', (req: Request, res: Response) => {notaFiscalController.buscarPorId(req, res)})
router.get('/notas', (req: Request, res: Response) => {notaFiscalController.listarTodos(req, res)})
router.post('/notas', (req: Request, res: Response) => {notaFiscalController.emitirNota(req, res)})

export default router