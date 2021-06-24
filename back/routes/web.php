<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

/***rutas generales***/
$router->post('/usuario/registro', 'UsuarioController@RegistrarUsuario');
$router->post('/persona/registro/{external_id}', 'UsuarioController@RegistrarEstudiante');
$router->post('/docente/registro/{external_id}', 'UsuarioController@RegistrarDocente');
$router->get('/general', 'ActividadController@devolverHoraFecha');
$router->post('/materia','MateriaController@registrarMateria');
$router->post('/periodo', 'DiatutoriaController@registrarPeriodo');
$router->get('/periodo/lista', 'DiatutoriaController@listarPeriodo');
$router->post('/periodo/eliminar/{external_id}', 'DiatutoriaController@eliminarPeriodo');
$router->post('/periodo/editar/{external_id}', 'DiatutoriaController@editarPeriodo');
$router->get('/materia/lista','MateriaController@listarMaterias');
$router->get('/periodo-actual','DiatutoriaController@getPeriodo');
$router->post('/mail','MailController@enviarMail');
$router->get('/estudiantes-titulacion-periodo/{external_id}/{external_periodo}/{tipo}','ReservaController@getParticipantesTitulacion');
$router->post('/smt','UsuarioController@registrarSmt');
$router->get('/smt-lista','UsuarioController@listarSmt');
$router->post('/smt-editar','UsuarioController@editarSmt');

$router->post('/usuario-editar','UsuarioController@editarPassword');
$router->get('/lista-estudiante','UsuarioController@listaUsuarioEstudiante');
$router->get('/lista-docente','UsuarioController@listaUsuarioDocente');
$router->post('/banear-usuario/{external_id}','UsuarioController@modificarEstadoUsuario');

/*login*/
$router->post('/usuario/login', 'UsuarioController@login');


/*rutas de acceso por el estudiante*/
$router->get('/estudiante/perfil/{external_id}', 'UsuarioController@datosEstudiante');
$router->get('/estudiante/curso/{external_id}', 'UsuarioController@listarEstudiantesCurso');
$router->get('/docente/lista', 'UsuarioController@listarDocentes');
$router->get('/docente/listadiasreservados/{external_id}', 'DiatutoriaController@listarTutoriasDocentes');
$router->post('/estudiante/cancelar/{exnternal_reserva}', 'ReservaController@cancelarReserva');
$router->post('reservatutorias', 'ReservaController@RegistroTutoria');
$router->get('reserva/listar/{external_es}', 'ReservaController@listaReservasEstudiantes');
$router->post('/estudiante/actividad', 'ActividadController@registrarEncuesta');
$router->get('/estudiante/citas-reagendada/{external_id}', 'ReagendarController@citasreagendada');
$router->post('/estudiante/citas-ac/{external_id}', 'ReagendarController@accitas');
$router->get('/estudiante/encuestas-pendientes/{external_id}', 'ActividadController@encuestaspendientes');



/*rutas de acceso por el docente*/
$router->get('/docente/perfil/{external_id}', 'UsuarioController@datosDocente');
$router->get('/docente/reservas/{external_id}', 'ReservaController@reservasDocentes');
$router->post('/docente/cancelar/{exnternal_reserva}', 'ReservaController@cancelarReservaDocente');
$router->post('/docente/tutoriasdadas/{external_id}', 'ReservaController@listarTutoriasDadas');
$router->post('/docente/tutoriasdadas-titulacion/{external_id}', 'ReservaController@tutoriasDadasTitulacion');
$router->post('/docente/canceladasest/{external_id}', 'ReservaController@listartutoriasCanceladasEstudiantes');
$router->post('/docente/canceladasdoc/{external_id}', 'ReservaController@listartutoriasCanceladasDocente');
$router->post('/docente/actividad', 'ActividadController@registrarActividad');
$router->post('/docente/encuesta/{external_id}', 'ActividadController@listarEncuestas');
$router->get('/docente/reserva-asistencia-estudiante/{external_id}', 'ActividadController@listarEstudiantesReserva');
$router->post('/docente/reagendar', 'ReagendarController@reagendar');
$router->post('/docente/dias/{external_id}', 'DiatutoriaController@registroDiaHoraTutoria');
$router->post('/docente/actualizar-hora', 'DiatutoriaController@actualizarHora');
$router->post('/docente/eliminar-hora', 'DiatutoriaController@eliminarHora');
$router->post('/docente/eliminar-dia-hora', 'DiatutoriaController@eliminarDiaHora');
$router->get('/docente/lista-dia-hora/{external_id}', 'DiatutoriaController@listarDiaHoraDocente');
$router->post('/docente/registro-materia', 'MateriaController@registroMateriaDocente');
$router->get('/docente/lista-materia/{external_id}', 'MateriaController@listarMateriaDocente');
$router->post('/docente/eliminar-materia/{external_id}', 'MateriaController@eliminarMateriaDocente');
$router->post('/docente/modificar-materia', 'MateriaController@ModificarMateriaDocente');
$router->post('/docente/materias-periodo', 'MateriaController@listaMateriaPeriodo');













