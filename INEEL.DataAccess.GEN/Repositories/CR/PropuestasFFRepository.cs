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
    public class PropuestasFFRepository : IDisposable { public void Dispose(){ _dbGen.Dispose(); _db.Dispose(); }
        GEN_Context _dbGen;
        CR_Context _db;
        public PropuestasFFRepository()
        {
            _dbGen = new GEN_Context();
            _db = new CR_Context();
           
        }


        /// <summary>
        /// lista de investigadores y su formacion academica (estadistico)
        /// </summary>
        /// <param name="param">fecha y clave de unidad</param>
        /// <returns>lista de investigadores y su formacion academica (estadistico)</returns>
        public async Task<List<PropuestasFF>> GetPropuestasByFF(ParametrosFF param)
        {
            List<PropuestasFF> PropuestasFFSelect = new List<PropuestasFF>();
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

                    PropuestasFFSelect = await GetTipoFuente(param.TipoFuenteFinanciamientoId, param.Claveunidad, PropuestasFFSelect);
                    break;

                case 2: //Dio la fuente;

                    PropuestasFFSelect = await GetFuente(param.FuenteFinanciamientoId, param.Claveunidad, PropuestasFFSelect);
                    break;

                case 3: //Dio el fondo;

                    PropuestasFFSelect = await GetFondo(param.FondoProgramaId, param.Claveunidad, PropuestasFFSelect);
                    break;

                case 4: //Dio la convocatoria;

                    PropuestasFFSelect = await GetConvocatoria(param.ConvocatoriaId, param.Claveunidad, PropuestasFFSelect);

                   break;

                default: //Todas las fuentes;

                    PropuestasFFSelect = await GetTodasTipoFuente(param.Claveunidad, PropuestasFFSelect);
                    break;
            }
              return PropuestasFFSelect;
        }

        public async Task<List<PropuestasFF>> GetTodasTipoFuente( string ClaveUnidad, List<PropuestasFF> PropuestasFF)
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
                PropuestasFF = await GetTipoFuente(tfuenteId, ClaveUnidad, PropuestasFF);
            }

            return PropuestasFF;
        }

        public async Task<List<PropuestasFF>> GetTipoFuente(int TipoFuenteFinanciamientoId, string ClaveUnidad, List<PropuestasFF> PropuestasFF)
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
                PropuestasFF = await GetFuente(fuenteId, ClaveUnidad, PropuestasFF);
            }

            return PropuestasFF;
        }

        public async Task<List<PropuestasFF>> GetFuente(int FuenteFinanciamientoId, string ClaveUnidad, List<PropuestasFF> PropuestasFF)
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
                PropuestasFF = await GetFondo(fp.FondoProgramaId, ClaveUnidad, PropuestasFF);

            }
            return PropuestasFF;
        }

        public async Task<List<PropuestasFF>> GetFondo(int FondoProgramaId, string ClaveUnidad, List<PropuestasFF> PropuestasFF)
        {
            var fond = await (from nfond in _db.FondoPrograma
                              where nfond.FondoProgramaId == FondoProgramaId
                              select nfond).Include(e => e.Convocatoria).FirstOrDefaultAsync();

            List<int> convs = new List<int>(fond.Convocatoria.Select(x => x.ConvocatoriaId));


            for (int i = 0; i < convs.Count; i++)
            {

                int convId = convs[i];
                PropuestasFF = await GetConvocatoria(convId, ClaveUnidad, PropuestasFF);
            }

            return PropuestasFF;

        }

        public async Task<List<PropuestasFF>> GetConvocatoria(int ConvocatoriaId, string ClaveUnidad, List<PropuestasFF> PropuestasFF)
        {
           // List<ProyectosFF> ProyectosFFSelect = new List<ProyectosFF>();

            var PropuestaPC = new List<PropuestaPorConvocatoria>();
            PropuestaPC = await (from ppc in _db.PropuestaPorConvocatoria
                                 where ppc.ConvocatoriaId == ConvocatoriaId
                                select ppc)
                                  .Include(e => e.Propuestas)
                                  .Include(e => e.Convocatoria)
                                  .AsNoTracking()
                                  .ToListAsync();

            //unidades organizacionales de los proyectos en la convocatoria
            List<String> uos1 = new List<string>(PropuestaPC.Select(x => x.Propuestas.UnidadOrganizacionalId.Trim()));

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

            foreach (PropuestaPorConvocatoria ppc in PropuestaPC)
            {
                var unidadId = ppc.Propuestas.UnidadOrganizacionalId.Trim();
                var vigencia = "Inactiva";
                if (uos2.Contains(unidadId))
                {

                    PropuestasFF obj = new PropuestasFF();
                    obj.NumProp = ppc.PropuestaId;
                    obj.NombreProp = ppc.Propuestas.Titulo;
                    obj.EstadoProp = ppc.Propuestas.EstadoPropuesta;
                    obj.MontoProp = ppc.Propuestas.Costos;

                    var unid = await uo.UnidadActualWithoutStatus(unidadId);
                    obj.Claveunidad = unidadId;
                    obj.UnidadProp = unid.NombreUnidad;

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
                    PropuestasFF.Add(obj);
                }
            }

            return PropuestasFF;
        }
    }
}
