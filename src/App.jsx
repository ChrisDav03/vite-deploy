import { useEffect, useState } from "react";
import axios from "axios";
import show_alert from "./functions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


export default function App() {
    const url = import.meta.env.VITE_SOME_KEY;
    const [books, setBooks] = useState([]);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [date, setDate] = useState('');
    const [operation, setOperation] = useState(1);
    const [func, setFunct] = useState('')



    const getBooks = async () => {
        const answer = await axios.get(url);
        setBooks(answer.data.books)
    }

    useEffect(() => {
        getBooks();
    }, []);

    const openModal = (op, id, title, author, genre, date) => {
        setId('');
        setTitle('');
        setAuthor('');
        setGenre('');
        setDate('')
        setOperation(op)
        if (op === 1) {
            setFunct('Registrar Libro')
        } else if (op === 2) {
            setFunct('Editar Libro')
            setId(id);
            setTitle(title);
            setAuthor(author);
            setGenre(genre);
            setDate(date)
        }
        window.setTimeout(function () {
            document.getElementById('title').focus();
        }, 500)
    }

    const validate = () => {
        var parameter;
        var method;
        console.log(date.length)
        if (title.trim() === '') {
            show_alert('Escribe el titulo del libro', 'warning')
        } else if (author.trim() === '') {
            show_alert('Escribe el autor del libro', 'warning')

        } else if (genre.trim() === '') {
            show_alert('Escribe el genero del libro', 'warning')

        } else if (date.length != 4) {
            show_alert('Escribe un año valido para el libro', 'warning')

        } else {
            if (operation === 1) {
                parameter = { id: id, title: title.trim(), author: author.trim(), genre: genre.trim(), date: date.trim() }
                console.log(date.length)
                console.log(parameter)
                method = 'POST'
            } else {
                parameter = { id: id, title: title.trim(), author: author.trim(), genre: genre.trim(), date: date.trim() }
                console.log(parameter)
                method = 'PUT'
            }
            sendApplication(method, parameter);
        }
    }
    const sendApplication = async (method, parameter) => {
        await axios({ method: method, url: url, data: parameter }).then((answer) => {

            var type = answer.data.message ? "success" : "error";
            var msj = answer.data.message;
            show_alert(msj, type);
            if (type === 'success') {
                document.getElementById('btnClose').click();
                getBooks();
            }
        })
            .catch((err) => {
                show_alert('Error en la solicitud', 'error')
                console.log(err)
            })
    }
    const deleteBook = (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: `Quieres eliminar el libro? ${name}`,
            icon: 'question', text: 'No se podra recuperar',
            showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                sendApplication('DELETE', { id: id })

            } else {
                show_alert('El libro no fue eliminado', 'info')
            }
        })

    }
    const filterBook = async (date, genre) => {
        const parameters = { date: date.trim(), genre: genre.trim() };
        console.log(parameters)
    
        try {
            const answer = await axios({ method: "POST", url: url + 'filter', data: parameters });
            if (answer.data.books) {
                setBooks(answer.data.books);
                
            } else{
                show_alert('No hay libros con ese filtro', 'info')
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    return (
        <div className="App">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-...." crossOrigin="anonymous" />
            <div>
                <header className='p-4 d-flex justify-content-between'>
                    <a href="" className="d-flex align-items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                        </svg>
                        <span className='font-weight-bold fs-4'>Libreria Junior</span>
                    </a>
                    <div className='d-flex border border-secondary rounded-full py-2 px-4 shadow-md shadow-gray-300'>
                        <input type="number" placeholder="YYYY" min="0" max="2050" id="date" className="form-control" onChange={(e) => setDate(e.target.value)}/>
                        <select name="genres" id="genres" onChange={(e) => setGenre(e.target.value)}>
                                <option disabled selected value> Selecciona </option>
                                <option value="Fantasia">Fantasia</option>
                                <option value="Ciencia Ficcion">Ciencia Ficcion</option>
                                <option value="Aventura">Aventura</option>
                        </select>
                        <button onClick={() => filterBook(date, genre)} className='btn btn-primary p-1 rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                    <div className='d-flex border border-secondary rounded-full py-2 px-4'>
                        <div>Iniciar Sesión</div>
                    </div>
                </header>
            </div>


            <div className="container-fluid">
                <div className="row mt-3 ">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle='modal' data-bs-target='#modalBooks'>
                                <i className="fa-solid fa-circle-plus"></i>Anadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row-mt-3">
                <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr><th>#</th><th>NOMBRE DEL LIBRO</th><th>AUTOR</th><th>GENERO</th><th>FECHA LANZAMIENTO</th><th>OPCIONES</th></tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {books.map((books) => (
                                    <tr key={books._id}>
                                        <td>{books._id}</td>
                                        <td>{books.title}</td>
                                        <td>{books.author}</td>
                                        <td>{books.genre}</td>
                                        <td>{(books.date).substring(0, 4)}</td>
                                        <td><button onClick={() => openModal(2, books._id, books.title, books.author, books.genre, books.date)} className="btn btn-warning" data-bs-toggle='modal' data-bs-target='#modalBooks'>
                                            <i className="fa-solid fa-edit"></i>
                                        </button>
                                            &nbsp;
                                            <button onClick={() => deleteBook(books._id, books.title)} className="btn btn-danger">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

            <div id='modalBooks' className="modal fade" aria-hidden='true'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{func}</label>
                            <button type="button" id="btnClose" className="btn-close" data-bs-dismiss='modal' aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id"></input>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="text" id="title" className="form-control" placeholder="Titulo" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="text" id="author" className="form-control" placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <select id="genre" className="form-control" placeholder="Genero" value={genre} onChange={(e) => setGenre(e.target.value)} >
                                    <option value="Fantasia">Fantasia</option>
                                    <option value="Ciencia Ficcion">Ciencia Ficcion</option>
                                    <option value="Aventura">Aventura</option>
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="number" placeholder="YYYY" min="0" max="2050" id="date" className="form-control" value={(date).substring(0, 4)} onChange={(e) => setDate(e.target.value)} />
                            </div>
                            <div className="d-grid col-6 mx-auto">
                                <button onClick={() => validate()} className="btn btn-success">
                                    <i className="fa-solid"></i>Guardar
                                </button>
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" id='btnClose' className="btn btn-secondary" data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

