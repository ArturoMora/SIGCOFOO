using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.PI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class indicadoresPIRepository : IDisposable
    {
        PI_Context _pictx;

        public void Dispose()
        {
            _pictx.Dispose();
        }

        public indicadoresPIRepository()
        {
            _pictx = new PI_Context();
        }


        public async Task<string> piLicenciada(string id) {
            try
            {
                double indicador = 0;

                DateTime fechaInicio;
                DateTime fechaTermino;
                
                fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);

                var propiedadPorPeriodo  = await _pictx.PropiedadIndustrial.Where(e => (e.FechaExpedicion > fechaInicio && e.FechaExpedicion < fechaTermino) && e.EsPropiedadInstituto == true).CountAsync();

                var propiedadLicenciada = await _pictx.PropiedadIndustrial.Where(e => (e.FechaExpedicion > fechaInicio && e.FechaExpedicion < fechaTermino) && e.EsPropiedadInstituto == true  && e.Licenciado == true ).CountAsync();


                string cant1 = propiedadLicenciada.ToString();
                string cant2 = propiedadPorPeriodo.ToString();


                double porcentaje = double.Parse(cant1) / double.Parse(cant2);

                if(porcentaje > 0 )
                  indicador = porcentaje * 100;


                return indicador.ToString();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<string> piLicenciadaxInvestigador(string id)
        {
            try
            {
                double indicador = 0;

                DateTime fechaInicio;
                DateTime fechaTermino;

                fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);


                PersonasRepository rp = new PersonasRepository();
                int personas = await rp.ContabilizaNoEmpleados();

                var propiedadPorPeriodo = await _pictx.PropiedadIndustrial.Where(e => (e.FechaExpedicion > fechaInicio && e.FechaExpedicion < fechaTermino) && e.EsPropiedadInstituto == true).CountAsync();


                string cant1 = propiedadPorPeriodo.ToString();
                string cant2 = personas.ToString();


                double porcentaje = double.Parse(cant1) / double.Parse(cant2);

                if(porcentaje > 0)
                   indicador = porcentaje * 100;

               

                return indicador.ToString();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


    }
}
