import {Router, Request, Response} from 'express'
import {CarroController} from '../controllers/carroController'
import {EstoqueController} from '../controllers/estoqueController'
// import {ClienteController} from '../controllers/clienteController'
// import {VendedorController} from '../controllers/vendedorController'
// import {NotaFiscalController} from '../controllers/notaFiscalController'

const router = Router()

const carroController = new CarroController()
const estoqueController = new EstoqueController()
// const clienteController = new ClienteController()
// const vendedorController = new VendedorController()
// const notaFiscalController = new NotaFiscalController()

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

export default router