using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace INEEL.WebAPI.Utilidades
{
    public class EstadosToInt
    {
        public List<int> ListEstados { get; set; }
        public DateTime Fecha { get; set; }

        public EstadosToInt(String estados)
        {
            Fecha = new DateTime(1900, 1, 2);
            ListEstados = new List<int>(3);
            if (!String.IsNullOrEmpty(estados))
            {
                var lista= estados.Split(',');
                foreach (var x in lista)
                {
                    try {
                        ListEstados.Add(Int32.Parse(x));
                    }
                    catch (Exception e) { }
                }
            }
        }
        public EstadosToInt(String estados, int yearsBack)
        {
            DateTime AuxFecha = DateTime.Now;
            Fecha = new DateTime(AuxFecha.Year,1,1);
            Fecha = Fecha.AddYears(-yearsBack);
            
            ListEstados = new List<int>(3);
            if (!String.IsNullOrEmpty(estados))
            {
                var lista = estados.Split(',');
                foreach (var x in lista)
                {
                    try
                    {
                        ListEstados.Add(Int32.Parse(x));
                    }
                    catch (Exception e) { }
                }
            }
        }
    }
}