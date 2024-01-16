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
    }, [getBooks]);

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
    return (
        <div className="App">
            
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-...." crossOrigin="anonymous" />
            
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
                                <input type="text" id="genre" className="form-control" placeholder="Genero" value={genre} onChange={(e) => setGenre(e.target.value)} />
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

