using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class indicadoresCPRepository : IDisposable
    {


      
        private CP_Context _db;
        public indicadoresCPRepository()
        {
            _db = new CP_Context();
           
        }


        public async Task<string> participantesComunidad(string id, string trimestre) {
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
                
                var query = "SELECT DISTINCT idPersonas FROM CP.tab_Miembros where FechaAlta >  convert(date,'" + fechaInicio.ToShortDateString() + "',103) and FechaAlta <  convert(date,'" + fechaTermino.ToShortDateString() + "',103) and estado = 1";
                List<string> miembros = await _db.Database.SqlQuery<string>(query).ToListAsync();

                PersonasRepository rp = new PersonasRepository();
                int personas = await rp.ContabilizaNoEmpleados();
                
                string cant1 = miembros.Count().ToString();
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


        public async Task<string> estudiosComunidad(string id, string trimestre)
        {
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

                var query = "SELECT DISTINCT idPersonas FROM CP.tab_Miembros where FechaAlta >  convert(date,'" + fechaInicio.ToShortDateString() + "',103) and FechaAlta <  convert(date,'" + fechaTermino.ToShortDateString() + "',103) and estado = 1";
                List<string> miembros = await _db.Database.SqlQuery<string>(query).ToListAsync();

                var propiedadPorPeriodo = await _db.DbSetTemasInnovacion.Where(e => (e.FechaRegistro > fechaInicio && e.FechaRegistro < fechaTermino) && e.Estado == "Aprobado").CountAsync();

                var estudiosPorPeriodo = await _db.DbSetEstudios.Where(e => (e.FechaRegistro > fechaInicio && e.FechaRegistro < fechaTermino) && e.Estado == "Aprobado").CountAsync();

                int suma = propiedadPorPeriodo + estudiosPorPeriodo;
                
                string cant1 = suma.ToString();
                string cant2 = miembros.Count().ToString();
                
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


        public async Task<string> mapasComunidad(string id, string trimestre)
        {
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

                var query = "SELECT DISTINCT idPersonas FROM CP.tab_Miembros where FechaAlta >  convert(date,'" + fechaInicio.ToShortDateString() + "',103) and FechaAlta <  convert(date,'" + fechaTermino.ToShortDateString() + "',103) and estado = 1";
                List<string> miembros = await _db.Database.SqlQuery<string>(query).ToListAsync();

                var artePorPeriodo = await _db.DbSetEstadoArte.Where(e => (e.FechaRegistro > fechaInicio && e.FechaRegistro < fechaTermino) && e.Estado == "Aprobado").CountAsync();

                var mapasPorPeriodo = await _db.DbSetMapasRutas.Where(e => (e.FechaRegistro > fechaInicio && e.FechaRegistro < fechaTermino) && e.Estatus == "Aprobado").CountAsync();

                int suma = artePorPeriodo + mapasPorPeriodo;

                
                string cant1 = suma.ToString();
                string cant2 = miembros.Count().ToString();

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


        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
