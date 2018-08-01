using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GI;


namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class IndicadoresGIRepository : IDisposable
    {

        private GI_Context _db;
        
        public IndicadoresGIRepository()
        {
            _db = new GI_Context();
          
        }


        public async Task<string> propuestasentreideas(string id) {
            try
            {
                double indicador = 0;

                DateTime fechaInicio;
                DateTime fechaTermino;

                fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);

                var propuesta = await _db.DbSetPropuesta.Where(e => (e.FechaValidacion > fechaInicio && e.FechaValidacion < fechaTermino) && (e.EstadoFlujoId == 10) && (e.Vigente == true)).CountAsync();

                var ideas     = await _db.DbSetIdeaInnovadora.Where(e => (e.FechaValidacion > fechaInicio && e.FechaValidacion < fechaTermino) && (e.EstadoFlujoId == 10)).CountAsync();


                string cant1 = propuesta.ToString();
                string cant2 = ideas.ToString();


                double porcentaje = double.Parse(cant1) / double.Parse(cant2);

                if (porcentaje > 0)
                    indicador = porcentaje * 100;


                return indicador.ToString();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<string> ideasentreideas(string id)
        {
            try
            {
                double indicador = 0;

                DateTime fechaInicio;
                DateTime fechaTermino;

                fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);

               var ideasaprobadas = await _db.DbSetIdeaInnovadora.Where(e => (e.FechaValidacion > fechaInicio && e.FechaValidacion < fechaTermino) && (e.EstadoFlujoId == 10)).CountAsync();

                var totalideas = await _db.DbSetIdeaInnovadora.Where(e => (e.FechaValidacion > fechaInicio && e.FechaValidacion < fechaTermino) ).CountAsync();


                string cant1 = ideasaprobadas.ToString();
                string cant2 = totalideas.ToString();


                double porcentaje = double.Parse(cant1) / double.Parse(cant2);

                if (porcentaje > 0)
                    indicador = porcentaje * 100;


                return indicador.ToString();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public void Dispose()
        {
            _db.Dispose();
        }

    }
}
