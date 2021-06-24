<?php

namespace App\Http\Controllers;

use App\Models\usuario;
use App\Models\estudiante;
use App\Models\docente;
use App\Models\diastutoria;
use App\Models\reserva;
use App\Models\materia;
use App\Models\menu;
use App\Models\smt;
use App\Models\materiaDocente;
use App\Models\periodoAcademico;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{

    private $estado = 400;
    private $datos = [];

    //REGISTRO DE USUARIO
    public function RegistrarUsuario(Request $request)
    {
          global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data = $request->json()->all();

            $usuario = usuario::where("correo", $data["correo"])->first();
            if (!$usuario) {
                $usuario = new usuario();
                $usuario->correo = $data["correo"];
                $clave = sha1($data["clave"] . "unl.");
                $usuario->clave = $clave;
                $usuario->tipoUsuario = $data["tipo"];  //1 docente 2 estudiante
                $usuario->estado = 1;
                $usuario->external_us = "UuA" . Utilidades\UUID::v4();

                $usuario->save();


                self::estadoJson(200, true, '');
            }else{
                self::estadoJson(400, false, 'Correo ya existente');

            }

        } else {
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
    }

    //REGISTRO DE ESTUDIANTE

    public function RegistrarEstudiante(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $usuario = usuario::where("external_us", $external_id)->first();

            if ($usuario->tipoUsuario == 2) {
                $estudiante = estudiante::where("id_usuario", $usuario->id)->first();
                if ($estudiante) {
                    $estudianteObj = estudiante::find($estudiante->id);
                    $estudianteObj->nombres = $data['nombres'];
                    $estudianteObj->apellidos = $data['apellidos'];
                    $estudianteObj->ciclo = $data['ciclo'];
                    $estudianteObj->paralelo =strtoupper($data['paralelo']);
                    $estudianteObj->save();
                    self::estadoJson(200, true, '');
                }else{
                    $persona = new estudiante();
                    $persona->nombres = $data["nombres"];
                    $persona->apellidos = $data["apellidos"];
                    $persona->ciclo = $data["ciclo"];
                    $persona->paralelo =strtoupper($data["paralelo"]) ;
                    $persona->estado = 1;
                    $persona->id_usuario = $usuario->id;
                    $persona->external_es = "Es" . Utilidades\UUID::v4();
                    $persona->save();
                    $datos['data'] = [
                        "externalEstudiante" => $persona->external_es
                        ];
                    self::estadoJson(200, true, '');
                }

            }
        } else {
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);

    }

    //REGISTRO DE DOCENTE
    //1 docente, 2 gestor
    public function RegistrarDocente(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data = $request->json()->all();
            $usuario = usuario::where("external_us", $external_id)->first();
            if ($usuario->tipoUsuario == 1) {
                $docente = docente::where("id_usuario", $usuario->id)->first();
                if ($docente) {
                    $docenteObj = docente::find($docente->id);
                    $docenteObj->nombres = $data['nombres'];
                    $docenteObj->apellidos = $data['apellidos'];
                    $docenteObj->save();
                    self::estadoJson(200, true, '');
                }else{
                    $docente = new docente();
                    $docente->nombres = $data["nombres"];
                    $docente->apellidos = $data["apellidos"];
                    $docente->tipo_docente = 1;
                    $docente->estado = 1;
                    $docente->id_usuario = $usuario->id;
                    $docente->external_do = "Es" . Utilidades\UUID::v4();
                    $docente->save();
                    $datos['data'] = [
                        "externalDocente" =>  $docente->external_do
                        ];
                    self::estadoJson(200, true, '');
                }
            }
        } else {
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
    }



    //REGISTRO DE LOGIN
    public function login(Request $request)
    {
        global $estado, $datos;
        $datos['data'] = null;
        $datos['sucess'] = 'false';
        $datos['mensaje'] = '';
        if ($request->json()) {
            try {
                $data = $request->json()->all();
                $clave = sha1($data["clave"] . "unl.");
                $usuario = usuario::where("correo", "=", $data["correo"])
                    ->where("clave", "=", $clave)

                    ->where("estado", 1)->first();

                if ($usuario) {
                    if ($usuario->tipoUsuario == 2)
                    {
                        $estudiante = estudiante::where("id_usuario", "=", $usuario->id)->first();
                        $periodo = periodoAcademico::where("estado", 1)->first();
                        $datos['data'] = [
                            "correo" => $usuario->correo,
                            "tipoUsuario" => $usuario->tipoUsuario,
                            "externalUsuario" => $usuario->external_us,
                             "nombreUsuario" => $estudiante?  $estudiante->nombres ." ". $estudiante->apellidos : '',
                            "externalEstudiante" =>$estudiante? $estudiante->external_es: '',
                            "externalPeriodo" => $periodo->external_periodo,
                            "menu" => self::getMenu($usuario->tipoUsuario)
                        ];
                    }
                    if ($usuario->tipoUsuario == 1)
                    {
                        $docente = docente::where("id_usuario", "=", $usuario->id)->first();
                        $datos['data'] = [
                            "correo" => $usuario->correo,
                            "tipoUsuario" => $usuario->tipoUsuario,
                            "externalUsuario" => $usuario->external_us,
                            "externalDocente" =>$docente? $docente->external_do: '',
                            "nombreUsuario" => $docente?  $docente->nombres ." ". $docente->apellidos : '',
                            "tipoDocente" => $docente? $docente->tipo_docente : '',
                            "menu" => self::getMenu($usuario->tipoUsuario)

                            //'materiasDocente' =>$materiaobj

                        ];
                    }
                    self::estadoJson(200, true, '');
                } else {
                    self::estadoJson(400, false, 'Datos Incorrectos');
                }
            } catch (\Exception $e) {
                self::estadoJson(400, false, 'Datos Incorrectos');
            }
            return response()->json($datos, $estado);
        }
    }

    private function getMenu($tipo)
    {
        $r = menu::where('tipo_usuario', $tipo)->get();

        //$data = array();
        foreach ($r as $item) {
            $data[] = [
                "menu"=>$item->nombre_menu,
                "label" => $item->label,
                "icono" => $item->icono
            ];
        }
        return $data;
    }
    
    //DATOS PERFIL ESTUDIANTE
    public function datosEstudiante($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $estudianteObj = usuario::where("external_us", $external_id)->first();

        if ($estudianteObj) {
            $estudiante = estudiante::where("id_usuario", "=", $estudianteObj->id)->first();

            if ($estudiante) {

                $datos['data'] = [
                    "nombres" => $estudiante->nombres,
                    "apellidos" => $estudiante->apellidos,
                    "ciclo" => $estudiante->ciclo,
                    "paralelo" => $estudiante->paralelo,
                    "externalEstudiante" => $estudiante->external_es,
                    //"external_usuario" => $estudianteObj->external_us
                ];
                self::estadoJson(200, true, '');
            } else {
                self::estadoJson(200, true, 'Estudiante no existente');
            }
        }else{
                self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);

    }

    public function datosDocente($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $docenteObj = usuario::where("external_us", $external_id)->first();
        if ($docenteObj) {
            $docente = docente::where("id_usuario", "=", $docenteObj->id)->first();

            if ($docente) {
                $datos['data'] = [
                "nombres" => $docente->nombres,
                "apellidos" => $docente->apellidos,
                "tipo_docente" => $docente->tipo_docente,  //1 docente, 2 gestor
                "externalDocente" => $docente->external_do,
                "externalUsuario" => $docente->usuario->external_us
            ];
            self::estadoJson(200, true, '');
            }{
                self::estadoJson(200, true, 'Estudiante no existente');
            }
        } else {
            self::estadoJson(200, true, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
    }
    
    //listar usuario - estudiante
    public function listaUsuarioEstudiante()
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $listas = usuario::where("tipoUsuario", 2)
                            ->where("estado", "<", 2)

                            ->get();

        foreach ($listas as $lista) {
            $datos['data'][] = [
                "Correo" => $lista->correo,
                //"Nombres" => self::nombreEstudiante($lista->id),
                "Nombres" => self::verificarEstado($lista->id, 1) ? self::nombreEstudiante($lista->id): 'Estudiante',

                "estado" => $lista->estado,
                "externalUsuario" =>$lista->external_us
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }


    private function nombreEstudiante($id){

        $estudiante = estudiante::where("id_usuario", $id)->first();
        $nombre =$estudiante->nombres . " " . $estudiante->apellidos;

        return  $nombre;
    }
    //listar usuario - docente
    public function listaUsuarioDocente(){
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $listas = usuario::where("tipoUsuario", 1)
                            ->where("estado", "<", 2)

                            ->get();
        
        foreach ($listas as $lista) {
            $datos['data'][] = [
                "Correo" => $lista->correo,
                //"Nombres" => self::nombredocente($lista->id),
                "Nombres" => self::verificarEstado($lista->id,2) ? self::nombredocente($lista->id): 'docente',
                "estado" => $lista->estado,
                "externalUsuario" =>$lista->external_us
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }
    private function verificarEstado($id, $tipo){
        if ($tipo ==1) {
            $estudiante = estudiante::where("id_usuario", $id)->first();
             if ($estudiante) {
                  return true;
                }else{
                    return false;
                }   
        }else{
            $docente = docente::where("id_usuario", $id)->first();
            if ($docente) {
                return true;
            }else{
                return false;
            }
        }
        
    }

    private function nombredocente($id)
    {
        $docente = docente::where("id_usuario", $id)->first();
        $nombre =$docente->nombres . " " . $docente->apellidos;

        return  $nombre;
    }
    //modificar estado activo - desactivo
    public function modificarEstadoUsuario($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $usuario = usuario::where("external_us", $external_id)->first();
        if ($usuario->estado ==0) {
            $usuarioObj = usuario::find($usuario->id);
            $usuarioObj->estado = 1;
            $usuarioObj->save();
            self::estadoJson(200, true, '');
        }else{
            $usuarioObj = usuario::find($usuario->id);
            $usuarioObj->estado = 0;
            $usuarioObj->save();
            self::estadoJson(200, true, '');
        }
        return response()->json($datos, $estado);

    }

     public function editarPassword(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();
        $usuario = usuario::where("external_us", $data['externalUsuario'])->first();
        $usuarioObj = usuario::find($usuario->id);
        $clave = sha1($data["clave"] . "unl.");

        $usuarioObj->clave = $clave;
        $usuarioObj->save();
        self::estadoJson(200, true, '');

        return response()->json($datos, $estado);

    }
    
    public function listarDocentes()
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        $listas = docente::where("estado", 1)->get();

        foreach ($listas as $lista) {
            $datos['data'][] = [
                "nombres" => $lista->nombres,
                "apellidos" => $lista->apellidos,
                "tipoDocente" => $lista->tipo_docente,  //1 docente, 2 gestor
                "externalDocente" => $lista->external_do,
                "externalUsuario" => $lista->usuario->external_us
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);

    }
   
    //listar compañeros de un curso
     public function listarEstudiantesCurso($external_id)
     {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $estudianteobj = estudiante::where("external_es",  $external_id)->first();

        if ($estudianteobj) 
        {
            $estudiante = estudiante::where("ciclo", $estudianteobj->ciclo)
                                    ->where("paralelo", $estudianteobj->paralelo)->get();
            
            foreach ($estudiante as $est) {
                $datos['data'][] = [
                "nombres" => $est->nombres,
                "apellidos" => $est->apellidos,
                "externalEstudiante" => $est->external_es
                ];
            }
            self::estadoJson(200, true, '');
        }else{
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
     }   


    public function registrarSmt(Request  $request)
     {
        global $estado, $datos;
        self::iniciarObjetoJSon();

        if ($request->json()) {
            $data = $request->json()->all();
            $smt = new smt();

            $smt->correo = $data["correo"];
            $clave = sha1($data["clave"] . "unl.");
            $smt->clave = $clave;
            $smt->estado=1;
            $smt->external_smt = "Smt". Utilidades\UUID::v4();
            $smt->save();
            self::estadoJson(200, true, '');
        }else{
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
     }

     public function listarSmt()
     {
        global $estado, $datos;
        self::iniciarObjetoJSon();

         $smt = smt::where("estado", 1)->first();
         $datos['data'] = [
             "correo" => $smt->correo,
             "puerto" => $smt->puerto,
             "externalSmt" => $smt->external_smt
         ];
         self::estadoJson(200, true, '');
         return response()->json($datos, $estado);
     }

     public function editarSmt(Request $request)
     {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();
        $editar = smt::where("external_smt", $data['externalSmt'])->first();
        $editarSmt = smt::find($editar->id);
        $clave = sha1($data["clave"] . "unl.");
        $editarSmt->correo = $data['correo'] ? $data['correo']: $editar->correo;
        $editarSmt->clave = $data["clave"]? $clave: $editar->clave;
        $editarSmt->puerto = $data["puerto"];
        $editarSmt->save();
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);

     }



    private static function estadoJson($estadoPeticion, $satisfactorio, $mensaje)
    {
        global $estado, $datos;
        $estado = $estadoPeticion;
        $datos['sucess'] = $satisfactorio;
        $datos['mensaje'] = $mensaje;
    }

    private static function iniciarObjetoJSon(){
        global $estado, $datos;
        $datos['data'] = null;
        $datos['sucess'] = 'false';
        $datos['mensaje'] = '';
    }
}