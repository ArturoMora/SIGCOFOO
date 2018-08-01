using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class indicadoresCHRepositoy : IDisposable
    {
        public void Dispose() { _ctx.Dispose(); }
        SIGCOCHContext _ctx;
       
        public indicadoresCHRepositoy()
        {
            _ctx = new SIGCOCHContext();
         
        }

             
        public async Task<string> actualizacionesPeriodo(string id)
        {
            try
            {

                double porcentaje = 0;
                double promedio = 0;

                PersonasRepository rp = new PersonasRepository();
                int personas = await rp.ContabilizaNoEmpleados();
                               

                DateTime fechaInicio  = new DateTime(int.Parse(id),1,1,12,0,0);
                DateTime fechaTermino = new DateTime(int.Parse(id),12, 31, 12, 0, 0);
                
                List<Personas> actualizaciones = await rp.GetAllActualizado(fechaInicio, fechaTermino);



                string cant1 = actualizaciones.Count().ToString();
                string cant2 = personas.ToString();


                porcentaje = double.Parse(cant1) / double.Parse(cant2);
                
                if(porcentaje > 0)
                   promedio = porcentaje * 100;
               
                return promedio.ToString();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
