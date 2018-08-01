using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class indicadoresCRRepository : IDisposable
    {

        CR_Context _cr;

        public void Dispose()
        {
            ((IDisposable)_cr).Dispose();
           
        }


        public indicadoresCRRepository()
        {
            _cr = new CR_Context();
          
        }


        public async Task<string> oportunidadesConcretadas(string id, string trimestre) {

            try
            {

                double indicador = 0;

                DateTime fechaInicio;
                DateTime fechaTermino;

                switch (trimestre)
                {

                    case "1":
                        fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 3, 31, 12, 0, 0);
                        break;

                    case "2":
                        fechaInicio = new DateTime(int.Parse(id), 4, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 6, 30, 12, 0, 0);
                        break;

                    case "3":
                        fechaInicio = new DateTime(int.Parse(id), 7, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 9, 30, 12, 0, 0);
                        break;

                    case "4":
                        fechaInicio = new DateTime(int.Parse(id), 10, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);
                        break;

                    default:
                        fechaInicio = new DateTime(int.Parse(id), 1, 1, 12, 0, 0);
                        fechaTermino = new DateTime(int.Parse(id), 12, 31, 12, 0, 0);
                        break;
                }



                var oportunidadesPeriodo = await _cr.OportunidadNegocio.Where(e => e.FechaRegistro > fechaInicio && e.FechaRegistro < fechaTermino).CountAsync();

                var oportunidadesConcretadas = await _cr.OportunidadNegocio.Where(e => (e.FechaRegistro > fechaInicio && e.FechaRegistro < fechaTermino) && e.EstadoONId == 4).CountAsync();


                string cant1 = oportunidadesConcretadas.ToString();
                string cant2 = oportunidadesPeriodo.ToString();


                double porcentaje = double.Parse(cant1) / double.Parse(cant2);

                if (porcentaje > 0)
                {
                    indicador = porcentaje * 100;
                }
               

              

                return indicador.ToString();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
