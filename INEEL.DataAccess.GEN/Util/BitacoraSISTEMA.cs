using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GEN.Interfaces;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Util;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public static class BitacoraSISTEMA
    {
        //Inicializar el objeto que contendrá la BD de la bitácora
        static BitacoraSISTEMA_DB _objBitacoraDB;

    //Define el nombre de la Tabla (colección) utilizada por el proyecto
    const string _collectionName = "ColeccionDeMovimientos";

    //Define la variable que contendrá el conjunto de registros de la bitácora
    static IMongoCollection<BitacoraMovSISTEMA> Movimientos;

    //Bandera que indica si la bitacora está activa
    static private bool esActiva = false;

    //Catálogo de tipo de movimientos
    static ICatalogoServiceProvider _catalogoServiceProvider;
    //Variable para el el valor maximo de consulta sin filtros
    //static string maxFiltroInicial = ConfigurationManager.AppSettings["maxFiltroInicial"].ToString();

    public static bool EsActiva()
    {
        return esActiva;
    }

    public static void Inicializar(Boolean ActivarBitacora, String MongoDB)
    {
       // if (ConfigurationManager.AppSettings["ActivarBitacora"].ToString() == "true")
       if (ActivarBitacora)
        {
                //Inicializar el objeto que contendrá la BD de la bitácora y la variable que contendrá el conjunto de registros
                var conn = MongoDB;    //ConfigurationManager.ConnectionStrings["MongoDB"].ConnectionString;
                esActiva = true;
            _objBitacoraDB = new BitacoraSISTEMA_DB(conn);
            Movimientos = ObtenMovimientos();
            _catalogoServiceProvider = new CatalogoServiceProvider();
        }
    }

    //Devuelve la lista completa de tipos de movimento, cada elemento contiene Text: Etiqueta y Value: Valor
    public static List<SelectListItem> ObtenTiposMovimiento()
    {
        return (_catalogoServiceProvider.getOpcionesPorIdentificador("tipoMovimiento"));
    }

    //Devuelve un elemento contiene Text: Etiqueta y Value: Valor filtrado por el valor del elemento buscado
    public static SelectListItem ObtenTipoMovimientoPorValor(string valor)
    {
        return ObtenTiposMovimiento().Find(p => p.Value == valor);
    }

    //Devuelve un elemento contiene la etiqueta de un elemento buscado por el valor del mismo elemento
    static string ObtenEtiquetaTipoMovimiento(string valor)
    {
        try
        {
            return ObtenTipoMovimientoPorValor(valor).Text;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine("La etiqueta para el valor " + valor + " no está definida.");
            return valor;
        }
    }

    //Devulve el conjunto de registros
    public static IMongoCollection<BitacoraMovSISTEMA> ObtenMovimientos()
    {
        if (esActiva)
            return _objBitacoraDB.bitacoraDB.GetCollection<BitacoraMovSISTEMA>(_collectionName);
        else
            return null;
    }

    //Inserta un registro en la bitácora
    public static void InsertaMovimiento(BitacoraMovSISTEMA movimiento)
    {
        if (esActiva)
        {
            try
            {
                Movimientos.InsertOneAsync(movimiento);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }

    public static void InsertaMovimiento(string cveElemento, string elemento, List<string> cambios, string cveTipoMovimiento, string justificacion)
    {
        if (esActiva)
        {
            try
            {
                BitacoraMovSISTEMA movimiento = new BitacoraMovSISTEMA(cambios, justificacion);
                movimiento.cveElemento = cveElemento;
                movimiento.elemento = elemento;
                movimiento.cveTipoMovimiento = cveTipoMovimiento;
                movimiento.tipoMovimiento = ObtenEtiquetaTipoMovimiento(movimiento.cveTipoMovimiento);

                Movimientos.InsertOneAsync(movimiento);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }

    public static void InsertaMovCRUD(string cveElemento, string elemento, List<string> cambios, string justificacion, Movimiento action)
    {
        if (esActiva)
        {
            try
            {
                //string accion = action; // HttpContext.Current.Request.RequestContext.RouteData.GetRequiredString("action");
                string cambioInicial = "";
                string cveTipoMov = "";
                switch (action)
                {
                    case Movimiento.create:
                        cambioInicial = "Registró";
                        cveTipoMov = "alta";
                        break;
                    case Movimiento.details:
                        cambioInicial = "Consultó";
                        cveTipoMov = "consulta";
                        break;
                    case Movimiento.edit:
                    case Movimiento.cargado:
                    case Movimiento.validado:
                    case Movimiento.aprobado:
                        cambioInicial = "Editó";
                        cveTipoMov = "edicion";
                        break;
                    case Movimiento.gestionperfil:
                        cambioInicial = "Editó su propia";
                        cveTipoMov = "edicion";
                        break;
                    case Movimiento.delete:
                        cambioInicial = "Eliminó";
                        cveTipoMov = "eliminacion";
                        break;
                    default:
                        Console.WriteLine("No existe definición de bitácora para la acción " + action);
                        return;
                }

                cambioInicial = cambioInicial + " [" + elemento + "]";
                if (cambios != null)
                    cambios.Insert(0, cambioInicial);
                else {
                    cambios = new List<string> { cambioInicial };
                }

                InsertaMovimiento(cveElemento, elemento, cambios, cveTipoMov, justificacion);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }

        //Crea e Inserta un registro en la bitácora
        /// <summary>Se requiere ClavePersona y Nombre en usuario
        /// </summary>
        public static void InsertaLogin(Personas usuario, bool loginExitoso, DatosCliente cliente)
    {
        if (esActiva)
        {
            try
            {
                BitacoraMovSISTEMA movimiento;
                if (loginExitoso)
                {
                    List<string> cambios = ObtenUbicacionCliente(cliente);
                    cambios.Insert(0, "Inició sesión");
                    movimiento = new BitacoraMovSISTEMA(cambios, usuario);
                    movimiento.cveTipoMovimiento = "inicio_sesion";
                }
                else {

                    List<string> cambios = ObtenUbicacionCliente(cliente);
                    cambios.Insert(0, "Se intentó iniciar sesión con credenciales incorrectas");
                        
                    movimiento = new BitacoraMovSISTEMA(cambios);
                    movimiento.cveAutor = "anonimo";
                    movimiento.nombreAutor = "Anónimo";
                    movimiento.cveTipoMovimiento = "acceso_fallido";
                }
                movimiento.cveElemento = "sistema";
                movimiento.elemento = "Sistema";
                movimiento.tipoMovimiento = ObtenEtiquetaTipoMovimiento(movimiento.cveTipoMovimiento);
                Movimientos.InsertOneAsync(movimiento);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }

    public static void InsertaLogOff(DatosCliente cliente)
    {
        if (esActiva)
        {
            try
            {
                BitacoraMovSISTEMA movimiento;
                List<string> cambios = ObtenUbicacionCliente(cliente);
                cambios.Insert(0, "Terminó sesión");
                movimiento = new BitacoraMovSISTEMA(cambios);
                movimiento.cveTipoMovimiento = "inicio_sesion";
                movimiento.cveElemento = "sistema";
                movimiento.elemento = "Sistema";
                movimiento.tipoMovimiento = ObtenEtiquetaTipoMovimiento(movimiento.cveTipoMovimiento);
                Movimientos.InsertOneAsync(movimiento);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }

    public static void InsertaImportacion(string cveElemento, string elemento, List<string> cambios)
    {
        if (esActiva)
        {
            try
            {
                InsertaMovimiento(cveElemento, elemento, cambios, "importacion", "");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }

        public static void InsActivaDesactiva(string cveElemento, string elemento, string tipoCambio, string justificacion)
        {
            if (esActiva)
            {
                string cambioInicial;
                switch (tipoCambio)
                {
                    case "activacion":
                        cambioInicial = "Activó";
                        break;
                    case "desactivacion":
                        cambioInicial = "Desactivó";
                        break;
                    case "habilitacion":
                        cambioInicial = "Habilitó";
                        break;
                    case "deshabilitacion":
                        cambioInicial = "Deshabilitó";
                        break;
                    default:
                        cambioInicial = "tipoCambio";
                        break;

                }
                List<string> cambios = new List<string> { cambioInicial + " [" + cveElemento + " - " + elemento + "]" };
                InsertaMovimiento(cveElemento, elemento, cambios, tipoCambio, "");
            }
        }

        public static void InsertaRecuperaPass(string cveElemento, DatosCliente datos)
    {
        try
        {

            List<string> cambios = ObtenUbicacionCliente(datos);
            cambios.Insert(0, "Se solicitó recuperar la contraseña del usuario con RPE: " + cveElemento);



            BitacoraMovSISTEMA movimiento = new BitacoraMovSISTEMA(cambios);
            movimiento.cveElemento = cveElemento;
            movimiento.elemento = "Contraseña, de usuario :" + cveElemento;
            movimiento.cveAutor = "anomimo";
            movimiento.nombreAutor = "Anónimo";
            movimiento.cveTipoMovimiento = "cambio_password";
            movimiento.tipoMovimiento = ObtenEtiquetaTipoMovimiento(movimiento.cveTipoMovimiento);
            Movimientos.InsertOneAsync(movimiento);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    //Devuelve una lista de registros de la bitácora
    public static List<BitacoraMovSISTEMA> VerTodo()
    {
        if (esActiva)
        {
            try
            {
                SortDefinition<BitacoraMovSISTEMA> sort = new BsonDocument("fechaMovimiento", -1);
                ConfiguracionServiceProvider configuracionService = new ConfiguracionServiceProvider();

                var query = Movimientos.Find(new BsonDocument()).Sort(sort).Limit(int.Parse(configuracionService.getValorDeVariable("maxInicialBitacoraMovs"))).ToListAsync();

                return query.Result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<BitacoraMovSISTEMA>();
            }
        }
        else
        {
            return new List<BitacoraMovSISTEMA>(); ;
        }
    }

    public static List<BitacoraMovSISTEMA> consultaFiltrada(String tipoMovimiento, String cveAutor, DateTime? fechaInicio, DateTime? fechaFin)
    {
        if (esActiva)
        {
            try
            {
                SortDefinition<BitacoraMovSISTEMA> sort = new BsonDocument("fechaMovimiento", -1);
                System.Threading.Tasks.Task<List<BitacoraMovSISTEMA>> query = null;
                Dictionary<String, object> filtro1 = new Dictionary<string, object>();
                Dictionary<String, object> filtro2 = new Dictionary<string, object>();
                List<BitacoraMovSISTEMA> listaFiltrada = new List<BitacoraMovSISTEMA>();
                var filter = new BsonDocument();
                if (!tipoMovimiento.Equals("Todos") && !tipoMovimiento.Equals(""))
                {
                    filtro1.Add("cveTipoMovimiento", tipoMovimiento);
                    filter.AddRange(filtro1);
                }
                if (!cveAutor.Equals("Todos") && !cveAutor.Equals(""))
                {
                    filtro2.Add("cveAutor", cveAutor);
                    filter.AddRange(filtro2);

                }
                query = Movimientos.Find(filter).Sort(sort).ToListAsync();
                var lstMovimientos = query.Result;
                if (fechaInicio != null && fechaFin != null)
                {
                    listaFiltrada = lstMovimientos.Where(x => x.fechaMovimiento >= fechaInicio.Value && x.fechaMovimiento <= fechaFin.Value.AddDays(1)).ToList();
                    return listaFiltrada.OrderByDescending(x => x.fechaMovimiento).ToList();
                }
                if (tipoMovimiento.Equals("Todos") && cveAutor.Equals("Todos"))
                {
                    ConfiguracionServiceProvider configuracionService = new ConfiguracionServiceProvider();
                    return lstMovimientos.Take(int.Parse(configuracionService.getValorDeVariable("maxInicialBitacoraMovs"))).OrderByDescending(x => x.fechaMovimiento).ToList();
                }
                else
                    return lstMovimientos.OrderByDescending(x => x.fechaMovimiento).ToList();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<BitacoraMovSISTEMA>();
            }
        }
        else
            return new List<BitacoraMovSISTEMA>();
    }

    public static List<BitacoraMovSISTEMA> consultaFiltradaPorElemento(String cveElemento)
    {
        if (esActiva)
        {
            SortDefinition<BitacoraMovSISTEMA> sort = new BsonDocument("fechaMovimiento", -1);
            System.Threading.Tasks.Task<List<BitacoraMovSISTEMA>> query = null;
            Dictionary<String, object> filtro1 = new Dictionary<string, object>();
            List<BitacoraMovSISTEMA> listaFiltrada = new List<BitacoraMovSISTEMA>();
            var filter = new BsonDocument();
            filtro1.Add("cveElemento", cveElemento);
            filter.AddRange(filtro1);

            query = Movimientos.Find(filter).Sort(sort).ToListAsync();
            var lstMovimientos = query.Result;
            return lstMovimientos.OrderByDescending(x => x.fechaMovimiento).ToList();
        }
        else
            return new List<BitacoraMovSISTEMA>();
    }

    //Devuelve un registro de la bitácora
    public static BitacoraMovSISTEMA ObtenMovimiento(string id)
    {
        if (esActiva)
        {

            return Movimientos.Find(new BsonDocument("_id", id)).FirstAsync().Result;
        }
        else { return null; }
    }

    //Elimina un registro de la bitácora
    public static void EliminaMovimiento(string id)
    {
        if (esActiva)
        {
            var filter = Builders<BitacoraMovSISTEMA>.Filter.Eq(s => s._id, id);
            Movimientos.DeleteOneAsync(filter);
        }
    }


    public static List<String> rastreaCambios(Object modeloEditado, DbPropertyValues valoresAnteriores)
    {
        List<String> listaCambios = new List<string>();

        var atributosObjetoEditado = modeloEditado.GetType().GetProperties().ToList();

        //Recorre los atributos del objeto editado
        foreach (var itemObjetoEditado in atributosObjetoEditado)
        {
            var valorActual = itemObjetoEditado.GetValue(modeloEditado, null);//valor del atributo
            if (valorActual == null)
                valorActual = "";
            if (valoresAnteriores.PropertyNames.ToArray().Contains(itemObjetoEditado.Name))
            {
                var valorAnterior = valoresAnteriores[itemObjetoEditado.Name];
                if (valorAnterior == null)
                    valorAnterior = "";

                if (valorAnterior.ToString() != valorActual.ToString())
                {
                    String displayNameAtributo = "";
                    try
                    {
                        displayNameAtributo = itemObjetoEditado.GetCustomAttribute<System.ComponentModel.DisplayNameAttribute>().DisplayName;//nombre del atributo
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                        displayNameAtributo = "";
                    }
                    if (displayNameAtributo == null || displayNameAtributo.ToString().Trim() == "")
                        displayNameAtributo = itemObjetoEditado.Name;

                    if (valorAnterior == null || valorAnterior.ToString() == "")
                        valorAnterior = "[Vacío]";
                    if (valorActual == null || valorActual.ToString() == "")
                        valorActual = "[Vacío]";
                    listaCambios.Add("- " + displayNameAtributo);
                    listaCambios.Add("  Anterior: " + valorAnterior);
                    listaCambios.Add("  Nuevo: " + valorActual);
                }
            }
        }
        if (listaCambios.Count > 0)
            listaCambios.Insert(0, "Atributos modificados:");
        return listaCambios;
    }

    static List<string> ObtenUbicacionCliente(DatosCliente datos)
    {
        List<string> cambios = new List<string>();
            string ubicacionHostAddr = datos.HostAddr;  //"hostx"; //HttpUtility.HtmlEncode(HttpContext.Current.Request.UserHostAddress);
            string ubicacionClientIP = datos.ClientIP;// "ipx"; //HttpContext.Current.Request.ServerVariables["HTTP_CLIENT_IP"];
            string ubicacionRemoteAddr = datos.RemoteAddr; // "addrx"; //HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];

        if (ubicacionHostAddr != null && ubicacionHostAddr != "")
        {
            cambios.Add("- Dirección del host:   " + ubicacionHostAddr);
        }

        if (ubicacionClientIP != null && ubicacionClientIP != "" && ubicacionClientIP != ubicacionHostAddr)
        {
            cambios.Add("- Dirección IP del cliente:   " + ubicacionClientIP);
        }

        if (ubicacionRemoteAddr != null && ubicacionRemoteAddr != "" && ubicacionRemoteAddr != ubicacionClientIP && ubicacionRemoteAddr != ubicacionHostAddr)
        {
            cambios.Add("- Dirección remota:   " + ubicacionRemoteAddr);
        }

        if (cambios.Count > 0)
            cambios.Insert(0, "Acción realizada desde: ");

        return cambios;
    }
}
}

