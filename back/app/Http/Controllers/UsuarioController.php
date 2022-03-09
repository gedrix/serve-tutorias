<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\Diastutoria;
use App\Models\Reserva;
use App\Models\Materia;
use App\Models\Menu;
use App\Models\Smt;
use App\Models\MateriaDocente;
use App\Models\PeriodoAcademico;
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
            $validar_clave = strlen(trim($data["clave"]));

                $count_num = 0;
                $count_abc = 0;
                $patron1 = "/^[A-Z]+$/i";

                if (preg_match('`[A-Z]`',$data["clave"])){
                     $count_abc =1;
                }

                
                if (preg_match('`[0-9]`',$validar_clave)){
                     $count_num = 1;
                }

            if ($validar_clave < 8  ||  $count_num == 0 || $count_abc == 0) {
                     self::estadoJson(400, false, 'Mínimo de caracteres permitido 8, un número y una Letra en mayúscula');
                     
                }else{
                    $validar_email = self::valdiaremail($data['correo']);
                    if ($validar_email) {
                       $usuario = usuario::where("correo", $data["correo"])->first(); //verifico que si hay un campo con ese correo
                        if (!$usuario) {
                            $usuario = new usuario();
                            $usuario->correo = $data["correo"];

                            $clave = sha1($data["clave"] . "unl.");
                            $usuario->clave = $clave;
                            $usuario->tipoUsuario = $data["tipo"];  //1 docente 2 estudiante
                            $usuario->estado =  $data["tipo"] ==1? 0 : 1 ;
                            $usuario->external_us = "UuA" . Utilidades\UUID::v4();

                            $usuario->save();

                            if ($usuario->tipoUsuario ==1) {
                                $cabecera = "Docente";
                                 $correo = "alfonso.rm1193@gmail.com";
                                //$correo = $docenteMail->correo;
                                 $asunto="Nuevo registro docente";

                                $mensaje= "El docente con correo institucional ". $usuario->correo . " se ha registrado en el módulo. En caso de ser un docente correcto por favor de activar";
                                $mensajeaux = "<p>Por favor, revise su perfil en el módulo de tutorías</p>";

                                 $enviar = new MailController();
                                 $enviar->enviarMail($correo,  $asunto,  $mensaje ,$mensajeaux,  $cabecera);
                                self::estadoJson(200, true, '');
                            }else{
                                self::estadoJson(200, true, '');
                            }
                        }else{
                            self::estadoJson(400, false, 'Correo ya existente');

                        }
                    }else{
                            self::estadoJson(400, false, 'Ingrese correo valido');

                    }
                }

        } else {
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
    }

    public function valdiaremail($email)
    {
        $email = trim($email);
        $dominio = explode("@", $email);
        if ($dominio[1] === 'unl.edu.ec') {
            return true;
        }else{
            return false;
        }
    }

    //REGISTRO DE ESTUDIANTE

    public function RegistrarEstudiante(Request $request, $external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        if ($request->json()) {
            $data = $request->json()->all();
            $usuario = usuario::where("external_us", $external_id)->first();

            $verificar_tamanio_cedula = strlen($data['cedula']);
            $validar_cedula = self::digitos_permitidos($data['cedula']);

            if ($verificar_tamanio_cedula == 10 && $validar_cedula ) {
                $validarNombre = strlen(trim($data['nombres']));
                $validarApellido = strlen(trim($data['apellidos']));
                if ($validarNombre == 0 && $validarApellido == 0) {
                    self::estadoJson(400, false, 'Por favor ingrese nombres y apellidos');
                }else{
                        if ($usuario->tipoUsuario == 2) {
                        $estudiante = estudiante::where("id_usuario", $usuario->id)->first();
                        if ($estudiante) {
                            $estudianteObj = estudiante::find($estudiante->id);
                            $estudianteObj->nombres = $data['nombres'];
                            $estudianteObj->apellidos = $data['apellidos'];
                            $estudianteObj->ciclo = $data['ciclo'];
                            $estudianteObj->cedula = $data['cedula'];
                            $estudianteObj->paralelo =$data['paralelo'];
                            $estudianteObj->save();
                            self::estadoJson(200, true, '');
                        }else{
                            $persona = new estudiante();
                            $persona->nombres = $data["nombres"];
                            $persona->apellidos = $data["apellidos"];
                            $persona->ciclo = $data["ciclo"];
                            $persona->cedula = $data['cedula'];
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
                }
                
            }else{
                self::estadoJson(400, false, 'La cedula debe de tener 10 dígitos o ingrese cedula valida');
            }
            
        } else {
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);

    }
    public function digitos_permitidos($cedula){
        $permitidos = "0123456789";
        $numero = $cedula;
        for ($i=0; $i<strlen($cedula); $i++){
            if (strpos($permitidos, substr($cedula,$i,1))===false){
                return false;
            }
        }

        //valido cedula
        //codigo de provincia de los 2 primeros digitos
         

        if ( (substr($cedula, 0, 2) < 0) || (substr($cedula, 0, 2) >24) ) {
            return false;
        }

        //valida tercer digito
        if ($numero[2] < 0 || $numero[2] > 5) {
            return false;
        }

        $validarAlgoritmo10 = self::algoritmoModulo10(substr($numero, 0, 9), $numero[9]);

         if (! $validarAlgoritmo10) {
            return false;
         }

        return true;
    }


    public function algoritmoModulo10($digitosIniciales, $digitoVerificador)
    {
        $arrayCoeficientes = array(2,1,2,1,2,1,2,1,2);

        $digitoVerificador = (int)$digitoVerificador;
        $digitosIniciales = str_split($digitosIniciales);

        $total = 0;
        foreach ($digitosIniciales as $key => $value) {

            $valorPosicion = ( (int)$value * $arrayCoeficientes[$key] );

            if ($valorPosicion >= 10) {
                $valorPosicion = str_split($valorPosicion);
                $valorPosicion = array_sum($valorPosicion);
                $valorPosicion = (int)$valorPosicion;
            }

            $total = $total + $valorPosicion;
        }

        $residuo =  $total % 10;

        if ($residuo == 0) {
            $resultado = 0;
        } else {
            $resultado = 10 - $residuo;
        }

        if ($resultado != $digitoVerificador) {
            return false;
        }

        return true;
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
            $validarNombre = strlen(trim($data['nombres']));
            $validarApellido = strlen(trim($data['apellidos']));
            if ($validarNombre == 0 && $validarApellido == 0) {
                 self::estadoJson(400, false, 'Por favor ingrese nombres y apellidos');
            }else{
                if ($usuario->tipoUsuario == 1) {
                    $docente = docente::where("id_usuario", $usuario->id)->first();
                    if ($docente) {
                        $docenteObj = docente::find($docente->id);
                        $docenteObj->nombres = $data['nombres'];
                        $docenteObj->apellidos = $data['apellidos'];
                        $docenteObj->relacion_laboral = $data['relacion_laboral'];
                        $docenteObj->save();
                        self::estadoJson(200, true, '');
                    }else{
                        $docente = new docente();
                        $docente->nombres = $data["nombres"];
                        $docente->apellidos = $data["apellidos"];
                        $docente->relacion_laboral = $data['relacion_laboral'];
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

                $usuario = Usuario::where("correo", "=", $data["correo"])
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
                            //"cedula" => $estudiante?  $estudiante->cedula : '',
                            "externalEstudiante" =>$estudiante? $estudiante->external_es: '',
                            "externalPeriodo" =>$periodo ? $periodo->external_periodo : '',
                            // "ciclo" => $estudiante ? $estudiante->ciclo : '',
                            // "paralelo" => $estudiante? $estudiante->paralelo: '',
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
                            // "relacion_laboral" => $docente? $docente->relacion_laboral : '',
                            "menu" => self::getMenu($usuario->tipoUsuario)

                            //'materiasDocente' =>$materiaobj

                        ];
                    }
                    //self::estadoJson(200, true, '');
                    self::estadoJson(200, true, '');

                } else {
                    /*if ($usuario->tipoUsuario = 1 && $usuario->estado = 0) {
                        self::estadoJson(400, false, 'Gestione la activación de su cuenta con el gestor de la carrera');
                    }else{
                        self::estadoJson(400, false, 'Datos Incorrectos');
                    }*/
                    $usuario = Usuario::where("correo", "=", $data["correo"])
                    ->where("clave", "=", $clave)
                    ->where("estado", 0)
                    ->where("tipoUsuario", 1)
                    ->first();
                    if($usuario){
                        self::estadoJson(300, false, 'Gestione la activación de su cuenta con el gestor de la carrera');
                    }else{
                        self::estadoJson(400, false, 'Datos Incorrectos');
                    }
                }
            } catch (\Exception $e) {
                self::estadoJson(400, false, $e);
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
                    "cedula" => $estudiante->cedula,
                    "externalEstudiante" => $estudiante->external_es,
                    //"external_usuario" => $estudianteObj->external_us
                ];
                self::estadoJson(200, true, '');
            } else {
                self::estadoJson(200, true, '');
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
                "relacion_laboral" => $docente->relacion_laboral,
                "externalDocente" => $docente->external_do,
                "externalUsuario" => $docente->usuario->external_us
            ];
            self::estadoJson(200, true, '');
            }{
                self::estadoJson(200, true, '');
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
        $varAux;
        $usuario = usuario::where("external_us", $external_id)->first();
        if ($usuario->estado ==0) {
            $usuarioObj = usuario::find($usuario->id);
            $usuarioObj->estado = 1;
            $usuarioObj->save();
            $varAux = 'Activado';
            self::estadoJson(200, true, '');
        }else{
            $usuarioObj = usuario::find($usuario->id);
            $usuarioObj->estado = 0;
            $usuarioObj->save();
            $varAux = 'Desactivado';

            self::estadoJson(200, true, '');
        }

        $cabecera = "Usuario";
                $correo = "alfonso.rm1193@gmail.com";
                //$correo = $usuario->correo;
                $asunto="Usuario ". $varAux;
                $mensaje= "Su usuario a sido: ". $varAux ."<br>";
                $mensajeaux = "<p>Muchas gracias por la atención </p>";

                $enviar = new MailController();

                $enviar->enviarMail($correo,  $asunto,  $mensaje, $mensajeaux, $cabecera);


        return response()->json($datos, $estado);

    }

     public function editarPassword(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();
        $validar_clave = strlen(trim($data["clave"]));

        $count_num =0;
        $count_abc =0;
        $patron1 = "/^[A-Z]+$/i";

        if (preg_match('`[A-Z]`',$data["clave"])){
             $count_abc =1;
        }

        
        if (preg_match('`[0-9]`',$validar_clave)){
             $count_num = 1;
        }

        if ($validar_clave < 8  ||  $count_num == 0 || $count_abc == 0) {
                self::estadoJson(400, false, 'Mínimo de caracteres permitido 8, un número y una letra en mayúscula ' );
                
        }else{
            $usuario = usuario::where("external_us", $data['externalUsuario'])->first();
            $usuarioObj = usuario::find($usuario->id);
            $clave = sha1($data["clave"] . "unl.");

            $usuarioObj->clave = $clave;
            $usuarioObj->save();
            self::estadoJson(200, true, '');
        }
        return response()->json($datos, $estado);
    }

    public function recuperarClave(Request $request)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $Strings = '0123456789abcdefghijklmnopqrstuvwxyz';
        
        $data = $request->json()->all();
        $validar_email = self::valdiaremail($data['correo']);

        if (!$validar_email ) {
           self::estadoJson(400, true, 'Formato de correo correo invalido');
            return response()->json($datos, $estado);
        }
        $usuario = usuario::where("correo", $data['correo'])->first();
        if ($usuario) {
            $usuarioObj = usuario::find($usuario->id);
            $auxClave = random_int(2, 5). 'unl.'.substr(str_shuffle($Strings),0, 5);
            $clave = sha1($auxClave . "unl.") ;
            $usuarioObj->clave = $clave;
            $usuarioObj->save();

            // $datos['data'] = [
            //     "clave aux" => $auxClave
            // ];
                 $cabecera = "Usuario";
                $correo = "alfonso.rm1193@gmail.com";
                 //$correo = $data['correo'];
                 $asunto="Recuperar clave";
                 $mensaje= "su nueva clave es: ".$auxClave;
                 $mensajeaux = "<p>su clave se cambió con exito, se recomienda cambiar la clave </p>";
                 $enviar = new MailController();
                 $enviar->enviarMail($correo,  $asunto,  $mensaje,$mensajeaux,  $cabecera);
            self::estadoJson(200, true, 'revise su correo');
            return response()->json($datos, $estado);
        }else{

            self::estadoJson(400, true, 'El correo no existe');
            return response()->json($datos, $estado);
        }
        
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
            //$clave = sha1($data["clave"] . "unl.");
            $smt->clave = $data["clave"];
            $smt->estado=1;
            $smt->external_smt = "Smt". Utilidades\UUID::v4();
            $smt->save();
            self::estadoJson(200, true, 'exitoso');
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

     public function editarSmt(Request $request){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data = $request->json()->all();
        $editar = smt::where("external_smt", $data['externalSmt'])->first();
        $editarSmt = smt::find($editar->id);
       $clave = $data["clave"] ;
        $editarSmt->correo = $data['correo'] ? $data['correo']: $editar->correo;
        $editarSmt->clave = $data["clave"]? $clave: $editar->clave;
        $editarSmt->puerto = $data["puerto"];
        $editarSmt->save();
        self::estadoJson(200, true, 'Modificación exitosa');
        return response()->json($datos, $estado);
     }

     public function relacionLaboral($externalDocente){
        global $estado, $datos;
        self::iniciarObjetoJSon();

            $docente = docente::where("external_do", "=", $externalDocente)->first();

            if ($docente->relacion_laboral == 0) {
                $datos['data'][] = ["relacion_laboral" => "tiempo completo"];
            }
            if ($docente->relacion_laboral == 1) {
                    $datos['data'][] = ["relacion_laboral" => "Medio completo"];
            }
            if ($docente->relacion_laboral == 2) {
                 $datos['data'][] = ["relacion_laboral" => "tiempo parcial"];
            }

        self::estadoJson(200, true, '');
        return response()->json( $datos, $estado);
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
