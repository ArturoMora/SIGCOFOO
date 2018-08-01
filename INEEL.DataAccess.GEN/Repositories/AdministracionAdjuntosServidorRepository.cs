using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class AdministracionAdjuntosServidorRepository : IDisposable
    {
        GEN_Context _db;
        
        public AdministracionAdjuntosServidorRepository()
        {
            _db = new GEN_Context();
        }


        public async Task DepuraAdjuntos()
        {
            try
            {
                var raizCarpetaAdjuntos = ConfigurationManager.AppSettings["pathAdjunto"];  //El path es diferente por servidor
                List<String> listaNombresAdjuntosServidor = new List<string>();   //Contiene los nombres de los adjuntos en el servidor
                List<string> listaAdjuntosBD = new List<string>();  //Contiene los nombres de los adjuntos en la base de datos
                if (Directory.GetFiles(raizCarpetaAdjuntos).Length != 0)
                {
                    var nombresArchivos = Directory.GetFileSystemEntries(raizCarpetaAdjuntos);  //Nombres de carpetas y adjuntos que estan en la url consultada
                    listaNombresAdjuntosServidor.AddRange(nombresArchivos);

                    var subcarpetas = Directory.GetDirectories(raizCarpetaAdjuntos);  //En caso de que se agreguen mas carpetas en el futuro
                    listaNombresAdjuntosServidor.RemoveAll(x => subcarpetas.Contains(x));  //Eliminamos los nombres de las subcarpetas, ya que por default vienen en la lista
                    if (subcarpetas.Length>0) //Contiene subcarpetas
                    {
                        //Obtenemos los nombres de los adjuntos por cada directorio
                        foreach(var carpeta in subcarpetas)
                        {
                            var nombres = Directory.GetFileSystemEntries(carpeta+"/");
                            if (nombres.Count() >0)
                            {
                                listaNombresAdjuntosServidor.AddRange(nombres);
                            }
                        }
                    }
                    else  //En caso de que no existan subcarpetas
                    {
                        var nombres = Directory.GetFileSystemEntries(raizCarpetaAdjuntos);
                        listaNombresAdjuntosServidor.AddRange(nombres);
                        listaNombresAdjuntosServidor.RemoveAll(x => subcarpetas.Contains(x));  //Eliminamos los nombres de las subcarpetas, ya que por default vienen en la lista
                    }

                    listaNombresAdjuntosServidor.RemoveAll(x => x.Contains("log_Adjuntos_Eliminados.txt") || x.Contains("log_Error.txt"));  //Removemos los archivos de logs

                    var consultaAdjuntosBD = await _db.dbSetAdjuntos.AsNoTracking().Select(x=> x.RutaCompleta).Distinct().ToListAsync();  //Lista de adjuntos registrados en la bd

                    
                    foreach(var adjunto in listaNombresAdjuntosServidor.Distinct()) //Iteramos la lista de adjuntos que esta en el servidor, usamos un distinct en caso de que existan adjuntos repetidos (no deberian de existir)
                    {
                        var coincidencia = consultaAdjuntosBD.Where(x => x.Equals(adjunto)).Count();  //Buscamos cada adjunto en los registros de la base de datos
                        if (coincidencia > 0)  
                        {
                            consultaAdjuntosBD.RemoveAll(x => x.Equals(adjunto));  //Removemos las coincidencias para disminuir la lista en general y que la consulta se mas rapida
                        }
                        else
                        {
                            while (File.Exists(adjunto))  //Para casos en donde existan multiples adjuntos con el mismo nombre, que en teoria no deberian de existir
                            {
                                File.Delete(adjunto);
                                var url = ConfigurationManager.AppSettings["pathAdjunto"] + "log_Adjuntos_Eliminados.txt";
                                File.AppendAllText(url, DateTime.Now+ "   " + adjunto + Environment.NewLine);
                            }
                            
                        }
                    }

                }
                else
                {
                    var url = ConfigurationManager.AppSettings["pathAdjunto"] + "log_Adjuntos_Eliminados.txt";
                    File.AppendAllText(url, DateTime.Now + "   No se encontraron archivos adjuntos a eliminar" + Environment.NewLine);
                }
            }
            catch(Exception e)
            {
                var url = ConfigurationManager.AppSettings["pathAdjunto"] + "log_Error.txt";
                File.AppendAllText(url, DateTime.Now+" "+ e.Message + Environment.NewLine);
                throw new Exception(e.Message, e);
                
            }
        }

        public void Dispose()
        {
            _db.Dispose();
        }
    }
}
