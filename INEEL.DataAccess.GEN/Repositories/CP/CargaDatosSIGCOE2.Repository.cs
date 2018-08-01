using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;
using Newtonsoft.Json;

namespace INEEL.DataAccess.GEN.Repositories.CP
{  
    public class CargaDatosSIGCOE2
    {
        static string connectionString = null;
        private CP_Context _db;
        public CargaDatosSIGCOE2()
        {
            connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SIGCOE2PROD"].ConnectionString;
            _db = new CP_Context();
        }


        private static DataTable CreateCommandSIGCO2(String queryString)
        {

            using (SqlConnection connection = new SqlConnection(
                       connectionString))
            {
                try
                {
                    SqlCommand command = new SqlCommand();
                    command.Connection = connection;
                    command.CommandTimeout = 40;
                    command.CommandType = CommandType.Text;
                    command.CommandText = queryString;

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();
                    DataTable dt = new DataTable();
                    dt.Load(reader);
                    return dt;
                }
                catch (Exception e)
                {
                    //TODO: pendiente colocar el log
                    var ms = e.Message;
                }
            }
            return null;
        }

        public async Task<string> cargaDocumentos()
        {
            int n = 0;
            try
            {
                var sPath = ConfigurationManager.AppSettings["pathAdjunto"] + "DocumentosCPE2/";
                try
                {

                    if (!Directory.Exists(sPath))
                    {
                        Directory.CreateDirectory(sPath);
                    }
                }
                catch (Exception e)
                {
                    throw new Exception("No es posible crear el directorio en el servidor", e);
                }

                var queryDocumentos = "select * from [SIGCO].[CP].[tDocumentoCP]";
                var DTDocumentosE2 = await Task.Run(() => { return CreateCommandSIGCO2(queryDocumentos); });
                foreach (DataRow row in DTDocumentosE2.Rows)
                {
                 
                    var idMiembro = Convert.ToInt32(row[1]);
                    if (idMiembro != 0)
                    {
                        var datosMiembroE2 = await obtenClaveYComunidadE2(Convert.ToInt32(row[1]));
                        var comu = Convert.ToInt32(datosMiembroE2[0]);
                        var nombreCPE2 = await obtenNombreComunidadE2(comu);

                        var comunidadE3 =
                            await _db.DbSetComunidades.FirstOrDefaultAsync(e => e.Descripcion == nombreCPE2);
                        if (comunidadE3 != null)
                        {
                            Documento nuevoDoc = new Documento();
                            nuevoDoc.PalabraClave = Convert.ToString(row[3]);
                            nuevoDoc.FechaRegistro = Convert.ToDateTime(row[6]);
                            nuevoDoc.nombreDocumento = Convert.ToString(row[4]);

                            //Asignacion de estado del documento    
                            var estado = Convert.ToString(row[7]);
                            if (estado.Equals("Aprobado"))
                            {
                                nuevoDoc.Estado = "1";
                            }
                            else
                            {
                                nuevoDoc.Estado = "0";
                            }

                            //Asignacion de tipo de acceso [publico-privado]
                            var tipoAcceso = Convert.ToString(row[5]);
                            if (tipoAcceso.Equals("Público"))
                            {
                                nuevoDoc.TipoAcceso = true;
                            }
                            else
                            {
                                nuevoDoc.TipoAcceso = false;
                            }

                            //tipoDocumento
                            var tipoDocumento = await obtenNombreTipoDocumento(Convert.ToInt32(row[2]));
                            if (tipoDocumento != "")
                            {
                                var documentoE3 =
                                    await
                                        _db.DbSetTipoDocumentos.FirstOrDefaultAsync(e => e.Descripcion == tipoDocumento);
                                nuevoDoc.idTipoDocumento = documentoE3.TipoDocumentoId;
                            }
                            else
                            {
                                var tipoDocumentoE3 =await _db.DbSetTipoDocumentos.FirstOrDefaultAsync(e => e.Nombre == "Otros Documentos");
                                nuevoDoc.idTipoDocumento = tipoDocumentoE3.TipoDocumentoId;// TODO: Cambiar para productivo
                            }

                            nuevoDoc.idComunidadCP = comunidadE3.ComunidadId;

                            //datos de los miembros
                            var miembro = datosMiembroE2[1];
                            var miembroE3 = await _db.DbSetMiembros.FirstOrDefaultAsync(e => e.idPersonas == miembro && e.idCP == comunidadE3.ComunidadId);

                            if (miembroE3 != null)
                            {
                                nuevoDoc.idMiembroCP = miembroE3.MiembroId;
                            }


                            var queryString = "select *  FROM [SIGCO].[CP].[tArchivo] where idDocumentoCP=" + row[0];
                            var entities = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                            if (entities != null)
                            {
                                foreach (DataRow rowDocument in entities.Rows)
                                {
                                    try
                                    {
                                        var nombreArchivo = Convert.ToString(row[4]);
                                        File.WriteAllBytes(sPath + nombreArchivo, (byte[])rowDocument[2]);
                                        Adjunto archivo = new Adjunto();
                                        archivo.ModuloId = "CP";
                                        archivo.nombre = nombreArchivo;
                                        archivo.RutaCompleta = sPath + nombreArchivo;
                                        nuevoDoc.Adjunto = archivo;

                                    }
                                    catch (Exception e)
                                    {
                                        Console.WriteLine("No se ha registrado archivo");
                                        throw new Exception(e.Message, e);
                                    }
                                }
                            }
                            _db.DbSetDocumentos.Add(nuevoDoc);
                            await _db.SaveChangesAsync();
                        }
                    }


                    n++;
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

            return "";

        }

        public async Task<Object> obtenMiembros()
        {
            try
            {
                await cargaComunidades();

                var queryString = "select * from [SIGCO].[CP].[tMiembroCP]"; 
                var DTMiembros = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                foreach (DataRow row in DTMiembros.Rows)
                {
                    Miembros nuevoMiembro= new Miembros();
                    var foo = "";
                    var idCPE2 = row[1];
                    var numEmpE2 = row[2];
                    var rolE2 = row[3];
                    var fechaRegE2 = row[4];

                    

                    //Obtiene los datos de CPE3 para posteriormente utilizarlos
                    var nombreCPE2 = await obtenNombreComunidadE2(Convert.ToInt32(idCPE2));
                    if (nombreCPE2 != "")
                    {
                        var ComunidadE3 = await _db.DbSetComunidades.FirstOrDefaultAsync(e => e.Descripcion == nombreCPE2);
                        

                        //Obtiene el rol de los miembros
                        var rol = Convert.ToString(rolE2);
                        if (rol == "Lider")
                        {
                            nuevoMiembro.rolId = 3;
                        }
                        if (rol == "Secretario")
                        {
                            nuevoMiembro.rolId = 4;
                        }
                        if (rol == "Miembro")
                        {
                            nuevoMiembro.rolId = 2;
                        }

                        //Obtiene el nombre de la persona
                        PersonasRepository persona = new PersonasRepository();
                        var datosPersona = await persona.GetByClave(Convert.ToString(numEmpE2));
                        if (datosPersona != null)
                        {
                            //se procede a crear el nuevo miembro
                            nuevoMiembro.idCP = ComunidadE3.ComunidadId;
                            nuevoMiembro.FechaAlta = Convert.ToDateTime(fechaRegE2);
                            nuevoMiembro.Aceptacion = false;
                            nuevoMiembro.idPersonas = datosPersona.ClavePersona;
                            nuevoMiembro.nombrePersona = datosPersona.NombreCompleto;
                            nuevoMiembro.estado = true;

                            _db.DbSetMiembros.Add(nuevoMiembro);
                            await _db.SaveChangesAsync();
                        }

                        
                    }
                    


                }

                    return null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }

        public async Task<string> obtenNombreComunidadE2(int id)
        {
            try
            {
                var comunidad = "";
                var queryString = "select [descripcion] FROM [SIGCO].[CP].[tCP] where id="+id+" and estatus = 1";
                var DTComunidad = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                if (DTComunidad != null)
                {
                    foreach (DataRow row in DTComunidad.Rows)
                    {
                        var c =row[0];
                        comunidad = Convert.ToString(c);
                        return comunidad;

                    }
                }
                return comunidad;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }

        public async Task<string> obtenMiembroComunidadE2(int id)
        {
            try
            {
                var comunidad = "";
                var queryString = "select [numEmp] [SIGCO].[CP].[tMiembroCP] where id=" + id;
                var DTComunidad = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                if (DTComunidad != null)
                {
                    foreach (DataRow row in DTComunidad.Rows)
                    {
                        return Convert.ToString(row[0]);

                    }
                }
                return comunidad;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<string> obtenNombreTipoDocumento(int id)
        {
            try
            {
                var registro = "";
                var queryString = "select [tipoDocumento] FROM [SIGCO].[CP].[tTipoDocumento] where id=" + id ;
                var ResultSet = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                if (ResultSet != null)
                {
                    foreach (DataRow row in ResultSet.Rows)
                    {
                        //registro = Convert.ToString(row[0]);
                        return Convert.ToString(row[0]);

                    }
                }
                return registro;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<String>> obtenClaveYComunidadE2(int id)
        {
            try
            {
                List<string> lista = new List<string>();
                var queryString = "select * FROM [SIGCO].[CP].[tMiembroCP] where id=" + id;
                var ResultSet = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                if (ResultSet != null)
                {
                    foreach (DataRow row in ResultSet.Rows)
                    {
                        lista.Add(Convert.ToString(row[1]));
                        lista.Add(Convert.ToString(row[2]));
                        return lista;

                    }
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> cargaComunidades()
        {
            try
            {
                var queryString = "select id from [SIGCO].[CP].[tCP] where estatus=1"; //Obtiene los id de las comunidades
                var DTRootComunidades = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                foreach (DataRow rootRow in DTRootComunidades.Rows) //recorre los ids
                {
                    var idComunidad = rootRow[0];
                    queryString = "select * from [SIGCO].[CP].[tCP] where id="+idComunidad; //obtiene cada comunidad de etapa 2
                    var DTComunidades = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });


                    foreach (DataRow row in DTComunidades.Rows)
                    {
                        Comunidad nuevaComunidad = new Comunidad();
                        var foo = "";
                        var idCPE2 = row[0];
                        var idCatCPE2 = row[1];
                        var descE2 = row[2];
                        var misE2 = row[3];
                        var fechaRegE2 = row[6];
                        var imgE2 = row[5];

                        var cat= await obtenCategoriaCPE2(Convert.ToInt32(idCatCPE2));  //obtiene datos de la categoria de la CP etapa 2
                        var nombre = cat[1].ToString();
                        var categoriaE3 = await _db.DbSetCategorias.FirstOrDefaultAsync(e => e.Nombre == nombre);

                       
                        nuevaComunidad.Descripcion = descE2.ToString();
                        nuevaComunidad.Mision = misE2.ToString();
                        nuevaComunidad.FechaRegistro = Convert.ToDateTime(fechaRegE2);
                        nuevaComunidad.idCategoria = categoriaE3.CatCPId;
                        nuevaComunidad.Estado = true;

                        var entities = _db.DbSetComunidades.Add(nuevaComunidad);
                        await _db.SaveChangesAsync();
                    }
                }
       
                return null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }

        public async Task<List<Object>> obtenCategoriaCPE2(int id)
        {
            try
            {
                List<Object> result = new List<object>();
                var queryString = "select * from [SIGCO].[CP].[tCategoria] where id=" + id; //obtiene la categoria deseada
                var DTComunidades = await Task.Run(() => { return CreateCommandSIGCO2(queryString); });
                foreach (DataRow row in DTComunidades.Rows)
                {
                    result.Add(Convert.ToInt32(row[0]));
                    result.Add(Convert.ToString(row[2]));
                    result.Add(Convert.ToString(row[3]));
                    result.Add(Convert.ToDateTime(row[4]));
                    
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }
    }
}
