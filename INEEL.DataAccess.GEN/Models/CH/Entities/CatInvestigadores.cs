using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN.CH.Entities
{
    public class CatInvestigadores
    {
        public Personas Persona { get; set; }
        public List<FormacionAcademica> Formacion { get; set; }
        public FormacionAcademica FormacionRepo { get; set; }
        public List<Idiomas> Idiomas { get; set; }
        public SNI sni { get; set; }
        public string Claveunidad { get; set; }
        public DateTime Fecha { get; set; }
        public string Becas { get; set; }
        public decimal Antiguedad
        {
            get
            {
                if (Persona == null)
                {
                    return 0;
                }
                //TimeSpan dif = this.Fecha - Persona.FechaIngreso;
                //decimal ret = decimal.Round(Convert.ToDecimal(dif.TotalDays / 365.25), 2);
                //return ret;






                TimeSpan dif;

                if (Persona.Estado == 0)
                {
                    dif = Persona.FechaEfectiva - Persona.FechaIngreso;
                }
                else
                {
                    DateTime Hoy = DateTime.Today;
                    dif = Hoy - Persona.FechaIngreso;
                }

                decimal ret = decimal.Round(Convert.ToDecimal(dif.TotalDays / 365.25), 2);
                return ret;










            }
        }
        public decimal Edad
        {
            get
            {
                if (Persona == null)
                {
                    return 0;
                }
                TimeSpan dif = this.Fecha - Persona.FechaNacimiento;
                decimal ret = decimal.Round(Convert.ToDecimal(dif.TotalDays / 365.25), 2);
                return ret;
            }
        }
        public decimal Experiencia
        {
            get
            {

                if (Persona == null)
                {
                    return 0;
                }
                TimeSpan dif = this.Fecha - Persona.FechaIngreso;
                decimal ret = this.ExperienciaIIE + this.ExperienciaExterna;
                return ret;

             }
        }
        public decimal ExperienciaIIE
        {
            get
            {

                if (Persona == null)
                {
                    return 0;
                }
                TimeSpan dif = this.Fecha - Persona.FechaIngreso;
                decimal ret = decimal.Round(Convert.ToDecimal(dif.TotalDays / 365.25), 2);
                return ret;
            }
        }
        public decimal ExperienciaExterna
        {
            get
            {
                if (Persona == null)
                {
                    return 0;
                }

                return Convert.ToDecimal(Persona.ExperienciaPrevia);
            }
        }
        public string Nivel { get; set; }
        public int BanderaInvestigador { get; set; }
    }
    public class ParametrosConsultas
    {
        public string Claveunidad { get; set; }
        public DateTime Fecha { get; set; }
        public string texto { get; set; }
        public int Gradoacademico { get; set; }
        public int TipoConsulta { get; set; }
        public int Rango { get; set; }
        public int EdadMinima { get; set; }
        public int EdadMaxima { get; set; }
        public int Sexo { get; set; }
        public int Antiguedad { get; set; }


    }
    enum Consulta
    {
        Carrera = 1,
        Institucion = 2
    }
    enum Sexo
    {
        M = 1,
        F = 2
    }

    public class PersonalInvestigacion
    {
        public UnidadOrganizacional UnidadOrganizacional { get; set; }
        public int InvGteDD { get; set; }
        public int Investigadores
        {
            get { return InvGteDD - MandoMedio; }
        }
        public int InvPosgrado { get; set; }
        public int Licenciatura { get; set; }
        public int Maestria { get; set; }
        public int Doctorado { get; set; }
        public int MandoMedio { get; set; }
    }

    public class PersonalSNI
    {
        public UnidadOrganizacional UnidadOrganizacional { get; set; }
        public int Candidatos { get; set; }
        public int Nivel1 { get; set; }
        public int Nivel2 { get; set; }
        public int Nivel3 { get; set; }
        public int Total
        {
            get { return Candidatos + Nivel1 + Nivel2 + Nivel3; }
        }
    }

    enum NivelSNI
    {
        Candidato = 1,
        Nivel1 = 2,
        Nivel2 = 3,
        Nivel3 = 4
    }
    public class AnalisisSNI
    {
        public Personas Persona { get; set; }
        public List<SNI> snis { get; set; }
        public DateTime FechaIngresoSNI
        {
            get
            {
                var fecha = this.snis.Select(e => e.fechaIngreso).FirstOrDefault();
                if (fecha != null)
                {
                    return DateTime.Parse(fecha.ToString());
                }
                else
                {
                    var fechaAlterna = this.snis.Select(e => e.fechaInicioNombramiento).FirstOrDefault();
                    return DateTime.Parse(fechaAlterna.ToString());
                }
                
            }
        }
        public decimal Candidato
        {
            get
            {
                decimal total = 0;
                var candidato = this.snis.Where(e => e.NivelSNIId == (int)NivelSNI.Candidato)
                    .Select(e => e.fechaTerminoNombramiento - e.fechaInicioNombramiento);
                foreach (var item in candidato)
                {
                    total += decimal.Round(Convert.ToDecimal((item.TotalDays + 1) / 365.25), 2);
                }
                return total;
            }
        }
        public decimal Nivel1
        {
            get
            {
                decimal total = 0;
                var nivel = this.snis.Where(e => e.NivelSNIId == (int)NivelSNI.Nivel1)
                    .Select(e => e.fechaTerminoNombramiento - e.fechaInicioNombramiento);
                foreach (var item in nivel)
                {
                    total += decimal.Round(Convert.ToDecimal((item.TotalDays + 1) / 365.25), 2);
                }
                return total;
            }
        }
        public decimal Nivel2
        {
            get
            {
                decimal total = 0;
                var nivel = this.snis.Where(e => e.NivelSNIId == (int)NivelSNI.Nivel2)
                    .Select(e => e.fechaTerminoNombramiento - e.fechaInicioNombramiento);
                foreach (var item in nivel)
                {
                    total += decimal.Round(Convert.ToDecimal((item.TotalDays + 1) / 365.25), 2);
                }
                return total;
            }
        }
        public decimal Nivel3
        {
            get
            {
                decimal total = 0;
                var nivel = this.snis.Where(e => e.NivelSNIId == (int)NivelSNI.Nivel3)
                    .Select(e => e.fechaTerminoNombramiento - e.fechaInicioNombramiento);
                foreach (var item in nivel)
                {
                    total += decimal.Round(Convert.ToDecimal((item.TotalDays + 1) / 365.25), 2);
                }
                return total;
            }
        }
        public decimal Total
        {
            get { return Candidato + Nivel1 + Nivel2 + Nivel3; }
        }
    }

    public class Grafica
    {
        public Grafica() {
            Datos = new List<List<string>>();
            Etiquetas = new List<string>();
        }
        public List<string> Etiquetas { get; set; }

        public List<string> Series { get; set; }

        public List<List<string>> Datos { get; set; }
    }
}
