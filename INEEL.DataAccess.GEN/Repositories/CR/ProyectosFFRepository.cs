using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProyectosFFRepository : IDisposable { public void Dispose(){ _dbGen.Dispose(); _db.Dispose(); }
        GEN_Context _dbGen;
        CR_Context _db;
        public ProyectosFFRepository()
        {
            _dbGen = new GEN_Context();
            _db = new CR_Context();
           
        }


        /// <summary>
        /// lista de investigadores y su formacion academica (estadistico)
        /// </summary>
        /// <param name="param">fecha y clave de unidad</param>
        /// <returns>lista de investigadores y su formacion academica (estadistico)</returns>
        public async Task<List<ProyectosFF>> GetProyectosByFF(ParametrosFF param)
        {
            List<ProyectosFF> ProyectosFFSelect = new List<ProyectosFF>();
            int opc=0;

            //Identifica Parametros
            if (param.ConvocatoriaId != 0)
            {
                opc = 4;
            } else if (param.FondoProgramaId!=0)
            {
                opc = 3;
            } else if (param.FuenteFinanciamientoId != 0)
            {
                opc = 2;
            }
            else if (param.TipoFuenteFinanciamientoId != 0)
            {
                opc = 1;
            }

            switch (opc) {
                case 1: //Dio el tipo de fuente;

                    ProyectosFFSelect = await GetTipoFuente(param.TipoFuenteFinanciamientoId, param.Claveunidad, ProyectosFFSelect);
                    break;

                case 2: //Dio la fuente;

                    ProyectosFFSelect = await GetFuente(param.FuenteFinanciamientoId, param.Claveunidad, ProyectosFFSelect);
                    break;

                case 3: //Dio el fondo;
                     
                    ProyectosFFSelect = await GetFondo(param.FondoProgramaId, param.Claveunidad, ProyectosFFSelect);
                    break;

                case 4: //Dio la convocatoria;

                    ProyectosFFSelect= await GetConvocatoria(param.ConvocatoriaId, param.Claveunidad, ProyectosFFSelect);

                   break;

                default: //Todas las fuentes;

                    ProyectosFFSelect = await GetTodasTipoFuente(param.Claveunidad, ProyectosFFSelect);
                    break;
            }
              return ProyectosFFSelect;
        }

        public async Task<List<ProyectosFF>> GetTodasTipoFuente( string ClaveUnidad, List<ProyectosFF> ProyectosFF)
        {
            var tipoFuente = new List<TipoFuenteFinanciamiento>();
            tipoFuente = await (from tfuen in _db.TipoFuenteFinanciamiento
                                select tfuen)
                          .AsNoTracking()
                          .ToListAsync();

            List<int> Tfuentes = new List<int>(tipoFuente.Select(x => x.TipoFuenteFinanciamientoId));

            for (int i = 0; i < Tfuentes.Count; i++)
            {

                int tfuenteId = Tfuentes[i];
                ProyectosFF = await GetTipoFuente(tfuenteId, ClaveUnidad, ProyectosFF);
            }

            return ProyectosFF;
        }

        public async Task<List<ProyectosFF>> GetTipoFuente(int TipoFuenteFinanciamientoId, string ClaveUnidad, List<ProyectosFF> ProyectosFF)
        {
            var fuente = new List<FuenteFinanciamiento>();
            fuente = await (from fuen in _db.FuenteFinanciamiento
                           //where fuen.TipoFuenteFinanciamientoId == TipoFuenteFinanciamientoId
                           select fuen)
                          .Include(e => e.FondoPrograma)
                          .AsNoTracking()
                          .ToListAsync();

            List<int> fuentes = new List<int>(fuente.Select(x => x.FuenteFinanciamientoId));

            for (int i = 0; i < fuentes.Count; i++)
            {

                int fuenteId = fuentes[i];
                ProyectosFF = await GetFuente(fuenteId, ClaveUnidad, ProyectosFF);
            }

            return ProyectosFF;
        }

        public async Task<List<ProyectosFF>> GetFuente(int FuenteFinanciamientoId, string ClaveUnidad, List<ProyectosFF> ProyectosFF)
        {
           var fond = new List<FondoPrograma>();
            fond = await (from nfond in _db.FondoPrograma
                          where nfond.FuenteFinanciamientoId == FuenteFinanciamientoId
                          select nfond)
                          .Include(e => e.Convocatoria)
                          .AsNoTracking()
                          .ToListAsync();

            foreach (FondoPrograma fp in fond)
            {
                ProyectosFF = await GetFondo(fp.FondoProgramaId, ClaveUnidad, ProyectosFF);

            }
            return ProyectosFF;
        }

        public async Task<List<ProyectosFF>> GetFondo(int FondoProgramaId, string ClaveUnidad, List<ProyectosFF> ProyectosFF)
        {
            var fond = await (from nfond in _db.FondoPrograma
                              where nfond.FondoProgramaId == FondoProgramaId
                              select nfond).Include(e => e.Convocatoria).FirstOrDefaultAsync();

            List<int> convs = new List<int>(fond.Convocatoria.Select(x => x.ConvocatoriaId));


            for (int i = 0; i < convs.Count; i++)
            {

                int convId = convs[i];
                ProyectosFF = await GetConvocatoria(convId, ClaveUnidad, ProyectosFF);
            }

            return ProyectosFF;

        }

        public async Task<List<ProyectosFF>> GetConvocatoria(int ConvocatoriaId, string ClaveUnidad, List<ProyectosFF> ProyectosFF)
        {
           // List<ProyectosFF> ProyectosFFSelect = new List<ProyectosFF>();

            var ProyectoPC = new List<ProyectoPorConvocatoria>();
            ProyectoPC = await (from ppc in _db.ProyectoPorConvocatoria
                                where ppc.ConvocatoriaId == ConvocatoriaId
                                select ppc)
                                  .Include(e => e.Proyecto)
                                  .Include(e => e.Convocatoria)
                                  .AsNoTracking()
                                  .ToListAsync();

            //unidades organizacionales de los proyectos en la convocatoria
            List<String> uos1 = new List<string>(ProyectoPC.Select(x => x.Proyecto.UnidadOrganizacionalId.Trim()));

            //Unidades organizacionales de acuerdo a la UO seleccionada en el formulario
            UORepository uo = new UORepository(_dbGen);
            var unidades = await uo.GetByIdWithChildren(ClaveUnidad);
            var unidSel = await uo.UnidadActualWithoutStatus(ClaveUnidad);
            List<String> uos2 = null;

            if (ClaveUnidad == "")
            {
                uos2 = uos1;
            }
            else {
                uos2 = new List<string>(unidades.Children.Select(x => x.ClaveUnidad));
                uos2.Add(unidSel.ClaveUnidad.ToString());
            }


            var ProyectoPCSelect = new List<ProyectoPorConvocatoria>();

            foreach (ProyectoPorConvocatoria ppc in ProyectoPC)
            {
                var unidadId = ppc.Proyecto.UnidadOrganizacionalId.Trim();
                var vigencia = "Inactiva";
                if (uos2.Contains(unidadId))
                {

                    ProyectosFF obj = new ProyectosFF();
                    obj.NumProy = ppc.ProyectoId;
                    obj.NombreProy = ppc.Proyecto.Nombre;
                    obj.FInicioProy = ppc.Proyecto.FechaInicio;
                    obj.FTerminoProy = ppc.Proyecto.FechaFin;
                    obj.MontoProy = ppc.Proyecto.Costo;

                    var unid = await uo.UnidadActualWithoutStatus(unidadId);
                    obj.Claveunidad = unidadId;
                    obj.UnidadProy = unid.NombreUnidad;

                    obj.FondoProgramaId = ppc.Convocatoria.FondoProgramaId;
                    var fond = await (from nfond in _db.FondoPrograma
                                      where nfond.FondoProgramaId == ppc.Convocatoria.FondoProgramaId
                                      select nfond).FirstOrDefaultAsync();

                    obj.NombreF = fond.NombreFP;
                    obj.FuenteFinanciamientoId = fond.FuenteFinanciamientoId;

                    var fuent = await (from nfue in _db.FuenteFinanciamiento
                                       where nfue.FuenteFinanciamientoId == fond.FuenteFinanciamientoId
                                       select nfue).FirstOrDefaultAsync();

                    obj.NombreFF = fuent.NombreFF;
                    //obj.TipoFuenteFinanciamientoId = fuent.TipoFuenteFinanciamientoId;

                    obj.NombreTipoFF = await (from ntfue in _db.TipoFuenteFinanciamiento
                                              //where ntfue.TipoFuenteFinanciamientoId == fuent.TipoFuenteFinanciamientoId
                                              select ntfue.Nombre).FirstOrDefaultAsync();

                    obj.ConvocatoriaId = ppc.ConvocatoriaId;
                    obj.NombreC = ppc.Convocatoria.NombreConvocatoria;

                    if (ppc.Convocatoria.FechaTermino > DateTime.Now)
                    {
                        vigencia = "Activa";
                    }

                    obj.VigenciaC = vigencia;
                    ProyectosFF.Add(obj);
                }
            }

            return ProyectosFF;
        }
    }
}
